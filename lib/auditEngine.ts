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

  // ── Cursor + Windsurf overlap ─────────────────────────────────────────────
  if (activeIds.has("cursor") && activeIds.has("windsurf")) {
    const cursorSpend   = tools.find(t => t.id === "cursor")!.monthlySpend
    const windsurfSpend = tools.find(t => t.id === "windsurf")!.monthlySpend
    const cheaperTool   = cursorSpend <= windsurfSpend ? "Cursor" : "Windsurf"

    log.warn("Redundancy: Cursor + Windsurf both active", { cursorSpend, windsurfSpend })

    extras.push({
      tool: cheaperTool,
      currentPlan: "—",
      currentSpend: 0,
      recommendedAction: "Eliminate overlapping AI coding editor",
      projectedSpend: 0,
      monthlySavings: 0,
      annualSavings: 0,
      status: "switch",
      reason:
        "You are paying for two AI coding editors. Pick one primary tool and cancel the other to eliminate overlap.",
    })
  }

  // ── Claude + ChatGPT overlap ──────────────────────────────────────────────
  if (activeIds.has("anthropic") && activeIds.has("chatgpt")) {
    const claudeRec  = recommendations.find(r => r.tool.toLowerCase().includes("claude") || r.tool.toLowerCase().includes("anthropic"))
    const chatgptRec = recommendations.find(r => r.tool.toLowerCase().includes("chatgpt"))
    const target     = (claudeRec?.monthlySavings ?? 0) <= (chatgptRec?.monthlySavings ?? 0)
      ? "Anthropic Claude"
      : "ChatGPT Plus"

    log.warn("Redundancy: Anthropic Claude + ChatGPT both active")

    extras.push({
      tool: target,
      currentPlan: "—",
      currentSpend: 0,
      recommendedAction: "Consolidate overlapping AI assistants",
      projectedSpend: 0,
      monthlySavings: 0,
      annualSavings: 0,
      status: "switch",
      reason:
        "Overlapping general AI assistants detected. Evaluate which one your team actually uses daily and consolidate.",
    })
  }

  // ── OpenAI API + Anthropic API overlap ───────────────────────────────────
  if (activeIds.has("openai") && activeIds.has("anthropic")) {
    log.warn("Redundancy: OpenAI API + Anthropic API both active")

    extras.push({
      tool: "API Overlap",
      currentPlan: "—",
      currentSpend: 0,
      recommendedAction: "Standardize on one API provider",
      projectedSpend: 0,
      monthlySavings: 0,
      annualSavings: 0,
      status: "switch",
      reason:
        "Dual API spend detected. If using both for similar tasks, standardize on one provider to simplify billing and reduce cognitive overhead.",
    })
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
  const totalAnnualSavings  = totalMonthlySavings * 12

  log.info("runAudit complete", { totalMonthlySavings, totalAnnualSavings, recommendations: allRecommendations.length })

  return {
    recommendations:     allRecommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    teamSize:            form.teamSize,
    useCase:             form.useCase,
  }
}