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
    if (entry.plan === "Pro" && seats === 1 && spend > 20) {
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Check if annual billing saves 20%", projectedSpend: 16, monthlySavings: spend - 16, annualSavings: (spend - 16) * 12, status: "switch", reason: "Cursor Pro on annual billing costs $16/mo vs $20/mo monthly. Switch to annual to save 20%." }
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
    return optimal()
  }

  // ── NOTION AI ───────────────────────────────────────────────────────────────
  if (id === "notion") {
    if (entry.plan === "Business" && seats > 10) {
      const savings = Math.round(spend * 0.2)
      return { tool: entry.name, currentPlan: entry.plan, currentSpend: spend, recommendedAction: "Audit inactive Notion seats — remove users not active in 60 days", projectedSpend: spend - savings, monthlySavings: savings, annualSavings: savings * 12, status: "overspending", reason: "Notion Business charges per member. Teams typically have 15-25% inactive members. Removing them reduces cost with zero workflow impact." }
    }
    return optimal()
  }

  // ── DEFAULT ─────────────────────────────────────────────────────────────────
  return optimal()
}

export function runAudit(form: FormState) {
  const recommendations = form.tools
    .filter(t => t.monthlySpend > 0)
    .map(entry => auditTool(entry, form.teamSize, form.useCase))

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0)

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    teamSize: form.teamSize,
    useCase: form.useCase,
  }
}