/**
 * @file lib/auditEngine.ts
 * @description Audit orchestrator for StackAudit.
 *
 * Responsibilities:
 *   1. Map each tool ID to its rule function (see lib/audit-rules.ts).
 *   2. Run per-tool rules against the submitted form.
 *   3. Run cross-tool redundancy checks.
 *   4. Aggregate and return the final AuditResult totals.
 *
 * To add a new tool:
 *   1. Write its `auditXxx` function in lib/audit-rules.ts.
 *   2. Add the tool's catalog ID → function mapping to RULE_MAP below.
 *   3. Done — the orchestrator picks it up automatically.
 */

import { createLogger }       from "./logger"
import {
  auditCursor,
  auditGithubCopilot,
  auditAnthropic,
  auditChatGPT,
  auditVercel,
  auditWindsurf,
  auditDatadog,
  auditOpenAI,
  auditNotion,
  auditLinear,
  auditPagerDuty,
  type RuleFn,
} from "./audit-rules"
import { FormState, ToolEntry, ToolRecommendation } from "./types"

const log = createLogger("auditEngine")

// ─────────────────────────────────────────────────────────────────────────────
// Rule map — catalog tool ID → audit function
// ─────────────────────────────────────────────────────────────────────────────

const RULE_MAP: Record<string, RuleFn> = {
  "cursor":         auditCursor,
  "github-copilot": auditGithubCopilot,
  "anthropic":      auditAnthropic,
  "chatgpt":        auditChatGPT,
  "vercel":         auditVercel,
  "windsurf":       auditWindsurf,
  "datadog":        auditDatadog,
  "openai":         auditOpenAI,
  "notion":         auditNotion,
  "linear":         auditLinear,
  "pagerduty":      auditPagerDuty,
}

// ─────────────────────────────────────────────────────────────────────────────
// Cross-tool redundancy checks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect overlapping tools that serve the same purpose.
 * Returns extra ToolRecommendation entries appended to the main list.
 *
 * @param recommendations - Per-tool results already computed
 * @param tools           - Raw tool entries from the form
 */
function checkRedundancy(
  recommendations: ToolRecommendation[],
  tools: ToolEntry[],
): ToolRecommendation[] {
  const extras: ToolRecommendation[] = []

  /** IDs of tools the user is actually paying for (spend > 0). */
  const activeIds = new Set(tools.filter(t => t.monthlySpend > 0).map(t => t.id))

  // These currentSpend values came from entry.monthlySpend at rule time.
  const spendByName = new Map(recommendations.map(r => [r.tool.toLowerCase(), r.currentSpend]))

  const getSpend = (toolId: string, displayName: string): number => {
    const fromRec = spendByName.get(displayName.toLowerCase())
    if (fromRec !== undefined) return fromRec
    return tools.find(t => t.id === toolId)?.monthlySpend ?? 0
  }

  // ── Cursor + Windsurf overlap ─────────────────────────────────────────────
  if (activeIds.has("cursor") && activeIds.has("windsurf")) {
    const cursorSpend   = getSpend("cursor", "Cursor")
    const windsurfSpend = getSpend("windsurf", "Windsurf")
    const cancelName    = cursorSpend >= windsurfSpend ? "Cursor" : "Windsurf"
    const cancelId      = cursorSpend >= windsurfSpend ? "cursor" : "windsurf"
    const keepName      = cancelName === "Cursor" ? "Windsurf" : "Cursor"
    const cancelSpend   = cancelName === "Cursor" ? cursorSpend : windsurfSpend
    const cancelEntry   = tools.find(t => t.id === cancelId)!

    extras.push({
      tool: cancelName,
      currentPlan: cancelEntry.plan,
      currentSpend: cancelSpend,
      recommendedAction: `Cancel ${cancelName} — keep ${keepName} as primary AI coding editor`,
      projectedSpend: 0,
      monthlySavings: cancelSpend,
      annualSavings: cancelSpend * 12,
      status: "overspending",
      reason:
        `You are paying for two AI coding editors (Cursor + Windsurf). Pick one and cancel the other. ` +
        `Cancelling ${cancelName} saves $${cancelSpend}/mo.`,
    })
  }

  // ── Claude + ChatGPT overlap ──────────────────────────────────────────────
  if (activeIds.has("anthropic") && activeIds.has("chatgpt")) {
    const claudeSpend  = getSpend("anthropic", "Anthropic Claude")
    const chatgptSpend = getSpend("chatgpt", "ChatGPT Plus")
    const cancelName   = claudeSpend >= chatgptSpend ? "Anthropic Claude" : "ChatGPT Plus"
    const cancelId     = claudeSpend >= chatgptSpend ? "anthropic" : "chatgpt"
    const cancelSpend  = claudeSpend >= chatgptSpend ? claudeSpend : chatgptSpend
    const cancelEntry  = tools.find(t => t.id === cancelId)!

    extras.push({
      tool: cancelName,
      currentPlan: cancelEntry.plan,
      currentSpend: cancelSpend,
      recommendedAction: `Consolidate AI assistants — cancel ${cancelName}`,
      projectedSpend: 0,
      monthlySavings: cancelSpend,
      annualSavings: cancelSpend * 12,
      status: "overspending",
      reason:
        "Overlapping general AI assistants detected. Evaluate which one your team uses daily and consolidate. " +
        `Cancelling ${cancelName} saves $${cancelSpend}/mo.`,
    })
  }

  // ── OpenAI API + Anthropic API overlap ───────────────────────────────────
  if (activeIds.has("openai") && activeIds.has("anthropic")) {
    const openaiSpend    = getSpend("openai", "OpenAI API")
    const anthropicSpend = getSpend("anthropic", "Anthropic Claude")
    const combinedSpend  = openaiSpend + anthropicSpend

    if (openaiSpend > 100) {
      const estimatedSavings = Math.round(combinedSpend * 0.30)
      extras.push({
        tool: "Dual API Spend",
        currentPlan: "—",
        currentSpend: combinedSpend,
        recommendedAction: "Standardize on one API provider to reduce operational complexity",
        projectedSpend: combinedSpend - estimatedSavings,
        monthlySavings: estimatedSavings,
        annualSavings: estimatedSavings * 12,
        status: "review",
        reason:
          "Running two LLM API providers simultaneously adds billing complexity and duplicated prompt engineering. " +
          "Standardizing on one provider typically reduces combined spend 25-35% through volume discounts.",
      })
    }
  }

  return extras
}

// ─────────────────────────────────────────────────────────────────────────────
// Public entry point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a full audit against the submitted form state.
 *
 * @param form - Team size, use case, and list of active tool entries
 * @returns Aggregated recommendations and savings totals
 */
export function runAudit(form: FormState) {
  log.info("runAudit started", { teamSize: form.teamSize, useCase: form.useCase, toolCount: form.tools.length })

  // Only audit tools the user is actually paying for
  const activeTools = form.tools.filter(t => t.monthlySpend > 0)

  const perToolResults: ToolRecommendation[] = activeTools.map(entry => {
    const ruleFn = RULE_MAP[entry.id]

    if (entry.usageScore <= 2) {
      log.info(`Low usageScore for ${entry.name} (${entry.usageScore}/10) — flagging for cancellation review`)
      return {
        tool: entry.name,
        currentPlan: entry.plan,
        currentSpend: entry.monthlySpend,
        recommendedAction: "Evaluate cancellation — usage is very low",
        projectedSpend: 0,
        monthlySavings: entry.monthlySpend,
        annualSavings: entry.monthlySpend * 12,
        status: "review" as const,
        reason:
          `This tool has a usage score of ${entry.usageScore}/10. Low daily usage is the strongest indicator ` +
          "of a cancellation candidate. Survey the team before your next renewal.",
      }
    }

    if (!ruleFn) {
      // No specific rule for this tool — mark as optimal (unknown tool)
      log.warn(`No rule found for tool id="${entry.id}" — skipping, marking optimal`)
      return {
        tool: entry.name,
        currentPlan: entry.plan,
        currentSpend: entry.monthlySpend,
        recommendedAction: "No rule available — review manually",
        projectedSpend: entry.monthlySpend,
        monthlySavings: 0,
        annualSavings: 0,
        status: "optimal" as const,
        reason: "No automated rule is configured for this tool. Review pricing manually.",
      }
    }

    const result = ruleFn(entry, form.useCase)
    log.info(`Audited ${entry.name}`, { status: result.status, monthlySavings: result.monthlySavings })
    return result
  })

  const redundancyResults = checkRedundancy(perToolResults, form.tools)
  const allRecommendations = [...perToolResults, ...redundancyResults]

  const totalMonthlySavings = allRecommendations.reduce((sum, r) => sum + r.monthlySavings, 0)
  const totalAnnualSavings  = allRecommendations.reduce((sum, r) => sum + r.annualSavings, 0)

  log.info("runAudit complete", { totalMonthlySavings, totalAnnualSavings, recommendations: allRecommendations.length })

  return {
    recommendations:     allRecommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    teamSize:            form.teamSize,
    useCase:             form.useCase,
  }
}
