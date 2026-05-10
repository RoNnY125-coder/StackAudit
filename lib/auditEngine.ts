import { FormState, ToolRecommendation, ToolEntry } from "./types"

function auditTool(entry: ToolEntry, teamSize: number, useCase: string): ToolRecommendation {
  const id = entry.id
  const seats = Math.max(entry.seats, 1)
  const spend = entry.monthlySpend

  const optimal = (): ToolRecommendation => ({
    tool: entry.name,
    currentPlan: entry.plan,
    currentSpend: spend,
    recommendedAction: "No change needed — plan is well-matched",
    projectedSpend: spend,
    monthlySavings: 0,
    annualSavings: 0,
    status: "optimal",
    reason: "Your current plan is cost-effective for your team size and usage pattern.",
  })

  // ── CURSOR ──────────────────────────────────────────────────────────────────
  if (id === "cursor") {
    if (entry.plan === "Business" && seats <= 3) {
      const projected = seats * 20
      const savings = spend - projected
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: `Downgrade to Cursor Pro ($20/user) — save $${Math.max(savings,0)}/mo`, projectedSpend: projected, monthlySavings: Math.max(savings, 0), annualSavings: Math.max(savings * 12, 0), status: "overspending", reason: "Cursor Business adds SSO and privacy mode which are unnecessary for teams under 4. Pro gives identical AI completion features at half the price." }
    }
    if (entry.plan === "Business" && seats >= 4) {
      return { ...optimal(), reason: "Business plan is justified at 4+ seats where SSO and centralized billing save admin time." }
    }
    if (entry.plan === "Pro" && seats >= 5) {
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Consider Cursor Business for centralized billing and SSO", projectedSpend: seats * 40, monthlySavings: 0, annualSavings: 0, status: "switch", reason: "At 5+ seats, Cursor Business adds centralized billing and SSO worth the $20/user premium. Consider upgrading for admin efficiency." }
    }
    if (entry.plan === "Pro" && seats === 1 && spend > 20) {
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Check if annual billing saves 20%", projectedSpend: 16, monthlySavings: spend - 16, annualSavings: (spend - 16) * 12, status: "switch", reason: "Cursor Pro on annual billing costs $16/mo vs $20/mo monthly. Switch to annual to save 20%." }
    }
    if (entry.plan === "Hobby" && seats > 1) {
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Hobby plan is single-user — each developer needs their own subscription", projectedSpend: spend, monthlySavings: 0, annualSavings: 0, status: "switch", reason: "Cursor Hobby is single-user only. Multiple developers cannot share a single Hobby subscription." }
    }
    return optimal()
  }

  // ── GITHUB COPILOT ──────────────────────────────────────────────────────────
  if (id === "github-copilot") {
    if (entry.plan === "Enterprise") {
      const projected = seats * 19
      const savings = spend - projected
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: `Downgrade to Copilot Business ($19/user)`, projectedSpend: projected, monthlySavings: Math.max(savings, 0), annualSavings: Math.max(savings * 12, 0), status: "overspending", reason: "Copilot Enterprise requires GitHub Enterprise Cloud ($21/user extra). Unless you need custom fine-tuned models, Business tier is functionally identical." }
    }
    if (entry.plan === "Business" && useCase !== "coding" && useCase !== "Software Engineering") {
      const projected = seats * 10
      const savings = spend - projected
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: `Downgrade to Copilot Pro ($10/user)`, projectedSpend: projected, monthlySavings: Math.max(savings, 0), annualSavings: Math.max(savings * 12, 0), status: "overspending", reason: "Copilot Business audit logs and policy controls add value only for coding-heavy teams. For your use case, Pro is sufficient." }
    }
    if (entry.plan === "Individual" && seats > 1) {
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Switch to Copilot Business for multi-user management", projectedSpend: seats * 19, monthlySavings: 0, annualSavings: 0, status: "switch", reason: "Individual plans cannot be centrally managed. Business plan at $19/user adds admin controls, audit logs, and policy enforcement for teams." }
    }
    if (entry.plan === "Business" && seats >= 10 && (useCase === "coding" || useCase === "Software Engineering")) {
      return { ...optimal(), reason: "Copilot Business is the right call at 10+ coding seats — audit logs and policy controls pay for themselves." }
    }
    if (entry.plan === "Pro" && seats > 3) {
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Switch to Copilot Business ($19/user) for team management", projectedSpend: seats * 19, monthlySavings: 0, annualSavings: 0, status: "switch", reason: "Pro plans cannot be centrally managed or audited. Business adds admin controls worth the $9/user premium at 4+ seats." }
    }
    return optimal()
  }

  // ── ANTHROPIC CLAUDE ────────────────────────────────────────────────────────
  if (id === "anthropic") {
    if (entry.plan === "Team" && seats < 5) {
      const projected = seats * 20
      const savings = spend - projected
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: `Switch to Claude Pro per user ($20/user)`, projectedSpend: projected, monthlySavings: Math.max(savings, 0), annualSavings: Math.max(savings * 12, 0), status: "overspending", reason: "Claude Team has a 5-seat minimum at $25/seat = $125/mo minimum. Under 5 users, individual Pro plans at $20/user cost less." }
    }
    if (entry.plan === "Team" && seats >= 5) {
      return { ...optimal(), reason: "Claude Team is cost-effective at 5+ seats and includes collaborative features and admin controls." }
    }
    if (entry.plan === "Claude.ai Pro" && seats > 1) {
      const projected = seats * 25
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Switch to Claude Team plan for multi-user management", projectedSpend: projected, monthlySavings: 0, annualSavings: 0, status: "switch", reason: "Multiple users on individual Pro plans cannot share usage or be centrally managed. Team plan adds admin controls and centralized billing." }
    }
    return optimal()
  }

  // ── CHATGPT ─────────────────────────────────────────────────────────────────
  if (id === "chatgpt") {
    if (entry.plan === "Team" && seats < 3) {
      const projected = seats * 20
      const savings = spend - projected
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: `Switch to ChatGPT Plus per user ($20/user)`, projectedSpend: projected, monthlySavings: Math.max(savings, 0), annualSavings: Math.max(savings * 12, 0), status: "overspending", reason: "ChatGPT Team ($30/user) adds shared workspaces and admin controls. Under 3 users these features rarely justify the $10/user premium over Plus." }
    }
    if (entry.plan === "Enterprise" && seats < 10) {
      const projected = seats * 30
      const savings = spend - projected
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Downgrade to ChatGPT Team — Enterprise overkill for your size", projectedSpend: projected, monthlySavings: Math.max(savings, 0), annualSavings: Math.max(savings * 12, 0), status: "overspending", reason: "ChatGPT Enterprise is designed for 150+ seat orgs with compliance requirements. Under 10 users, Team plan provides the same core functionality." }
    }
    if (entry.plan === "Plus" && seats > 1) {
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Switch to ChatGPT Team ($30/user) for shared workspace", projectedSpend: seats * 30, monthlySavings: 0, annualSavings: 0, status: "switch", reason: "Plus plans are individual and cannot share usage or be centrally managed. Team plan at $30/user adds collaborative features for multi-user setups." }
    }
    if (entry.plan === "Enterprise" && seats >= 10) {
      return { ...optimal(), reason: "ChatGPT Enterprise is appropriate at 10+ seats with compliance requirements." }
    }
    return optimal()
  }

  // ── VERCEL ──────────────────────────────────────────────────────────────────
  if (id === "vercel") {
    if (entry.plan === "Pro" && seats > 5) {
      const savings = (seats - 5) * 20
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Audit inactive team members and remove unused seats", projectedSpend: spend - savings, monthlySavings: savings, annualSavings: savings * 12, status: "overspending", reason: "Vercel Pro charges per team member. Removing inactive members with no deployments in 90+ days reduces cost without affecting active developers." }
    }
    return optimal()
  }

  // ── WINDSURF ────────────────────────────────────────────────────────────────
  if (id === "windsurf") {
    if (entry.plan === "Teams" && seats < 4) {
      const projected = seats * 15
      const savings = spend - projected
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: `Downgrade to Windsurf Pro ($15/user)`, projectedSpend: projected, monthlySavings: Math.max(savings, 0), annualSavings: Math.max(savings * 12, 0), status: "overspending", reason: "Windsurf Teams adds admin controls and SSO unnecessary for teams under 4. Pro gives identical AI completion features." }
    }
    if (entry.plan === "Pro" && seats >= 5) {
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Consider Windsurf Teams for admin controls", projectedSpend: spend, monthlySavings: 0, annualSavings: 0, status: "switch", reason: "Windsurf Teams adds admin controls and SSO worth considering at 5+ seats." }
    }
    if (entry.plan === "Free") {
      return { ...optimal(), reason: "Free plan is appropriate if usage needs are being met." }
    }
    return optimal()
  }

  // ── DATADOG ─────────────────────────────────────────────────────────────────
  if (id === "datadog") {
    const savings = Math.round(spend * 0.35)
    return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Audit metric retention and host count — estimated 35% reduction possible", projectedSpend: spend - savings, monthlySavings: savings, annualSavings: savings * 12, status: "overspending", reason: "Datadog charges per host and metric retention period. Most teams over-provision both. Reducing retention from 15 to 7 days and removing idle hosts typically saves 30-40%." }
  }

  // ── OPENAI API ──────────────────────────────────────────────────────────────
  if (id === "openai") {
    if (spend > 100) {
      const savings = Math.round(spend * 0.4)
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Switch high-volume calls from GPT-4o to GPT-4o-mini", projectedSpend: spend - savings, monthlySavings: savings, annualSavings: savings * 12, status: "overspending", reason: "GPT-4o-mini costs 15x less than GPT-4o for equivalent tasks like summarization, classification, and structured extraction. Route only complex reasoning tasks to full GPT-4o." }
    }
    if (spend >= 50 && spend <= 100) {
      const savings = Math.round(spend * 0.3)
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Route classification and extraction tasks to GPT-4o-mini", projectedSpend: spend - savings, monthlySavings: savings, annualSavings: savings * 12, status: "overspending", reason: "GPT-4o-mini costs 15x less than GPT-4o for classification, summarization, and extraction tasks. Route only complex reasoning to GPT-4o." }
    }
    if (spend < 50) {
      return { ...optimal(), reason: "API spend is low and well-managed. No changes needed." }
    }
    return optimal()
  }

  // ── NOTION AI ───────────────────────────────────────────────────────────────
  if (id === "notion") {
    if (entry.plan === "Business" && seats > 10) {
      const savings = Math.round(spend * 0.2)
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Audit inactive Notion seats — remove users not active in 60 days", projectedSpend: spend - savings, monthlySavings: savings, annualSavings: savings * 12, status: "overspending", reason: "Notion Business charges per member. Teams typically have 15-25% inactive members. Removing them reduces cost with zero workflow impact." }
    }
    if (entry.plan === "Plus" && seats <= 3) {
      return { ...optimal(), reason: "Notion Plus is cost-effective for small teams under 4." }
    }
    if (entry.plan === "Enterprise" && seats < 10) {
      const savings = Math.round(spend * 0.4)
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Downgrade to Notion Business plan", projectedSpend: spend - savings, monthlySavings: savings, annualSavings: savings * 12, status: "overspending", reason: "Notion Enterprise is designed for large orgs with SSO and advanced permissions. Under 10 users, Business plan covers all core features." }
    }
    return optimal()
  }

  // ── LINEAR ──────────────────────────────────────────────────────────────────
  if (id === "linear") {
    if (entry.plan === "Plus" && seats <= 10) {
      return { ...optimal(), reason: "Linear Plus is well-priced for teams under 10. No changes needed." }
    }
    if (entry.plan === "Standard" && seats > 15) {
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Consider upgrading to Linear Plus", projectedSpend: spend, monthlySavings: 0, annualSavings: 0, status: "switch", reason: "Linear Plus adds advanced analytics and priority support worth considering at 15+ seats." }
    }
    return optimal()
  }

  // ── PAGERDUTY ───────────────────────────────────────────────────────────────
  if (id === "pagerduty") {
    if (entry.plan === "Professional" && seats > 5) {
      const savings = Math.round(spend * 0.25)
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Audit active users and alert routing policies", projectedSpend: spend - savings, monthlySavings: savings, annualSavings: savings * 12, status: "review", reason: "PagerDuty Professional at 5+ seats often has significant unused alert routing features. Audit active users and alert policies before next renewal." }
    }
    return optimal()
  }

  // ── DEFAULT ─────────────────────────────────────────────────────────────────
  return optimal()
}

// ── Redundancy detection ──────────────────────────────────────────────────────
function checkRedundancy(
  recommendations: ToolRecommendation[],
  tools: ToolEntry[]
): ToolRecommendation[] {
  const extras: ToolRecommendation[] = []
  const enabledIds = new Set(tools.filter(t => t.monthlySpend > 0).map(t => t.id))

  // Cursor + Windsurf overlap
  if (enabledIds.has("cursor") && enabledIds.has("windsurf")) {
    const cursorSpend = tools.find(t => t.id === "cursor")!.monthlySpend
    const windsurfSpend = tools.find(t => t.id === "windsurf")!.monthlySpend
    const cheaperTool = cursorSpend <= windsurfSpend ? "Cursor" : "Windsurf"
    extras.push({
      tool: cheaperTool, currentPlan: "—", currentSpend: 0,
      recommendedAction: "Eliminate overlapping AI coding editor",
      projectedSpend: 0, monthlySavings: 0, annualSavings: 0,
      status: "switch",
      reason: "You are paying for two AI coding editors. Pick one primary tool and cancel the other to eliminate overlap.",
    })
  }

  // Claude + ChatGPT overlap
  if (enabledIds.has("anthropic") && enabledIds.has("chatgpt")) {
    const claudeRec = recommendations.find(r => r.tool.includes("Claude") || r.tool.includes("Anthropic"))
    const chatgptRec = recommendations.find(r => r.tool.includes("ChatGPT"))
    const target = (claudeRec?.monthlySavings ?? 0) <= (chatgptRec?.monthlySavings ?? 0)
      ? "Anthropic Claude" : "ChatGPT Plus"
    extras.push({
      tool: target, currentPlan: "—", currentSpend: 0,
      recommendedAction: "Consolidate overlapping AI assistants",
      projectedSpend: 0, monthlySavings: 0, annualSavings: 0,
      status: "switch",
      reason: "Overlapping general AI assistants detected. Evaluate which one your team actually uses daily and consolidate.",
    })
  }

  // OpenAI API + Anthropic API overlap
  if (enabledIds.has("openai") && enabledIds.has("anthropic")) {
    extras.push({
      tool: "API Overlap", currentPlan: "—", currentSpend: 0,
      recommendedAction: "Standardize on one API provider",
      projectedSpend: 0, monthlySavings: 0, annualSavings: 0,
      status: "switch",
      reason: "Dual API spend detected. If using both for similar tasks, standardize on one provider to simplify billing and reduce cognitive overhead.",
    })
  }

  return extras
}

export function runAudit(form: FormState) {
  const recommendations = form.tools
    .filter(t => t.monthlySpend > 0)
    .map(entry => auditTool(entry, form.teamSize, form.useCase))

  const redundancy = checkRedundancy(recommendations, form.tools)
  const allRecommendations = [...recommendations, ...redundancy]

  const totalMonthlySavings = allRecommendations.reduce((sum, r) => sum + r.monthlySavings, 0)

  return {
    recommendations: allRecommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    teamSize: form.teamSize,
    useCase: form.useCase,
  }
}