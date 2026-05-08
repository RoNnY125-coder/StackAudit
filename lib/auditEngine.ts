import { FormState, ToolRecommendation, ToolEntry } from "./types"

function auditTool(entry: ToolEntry): ToolRecommendation {
  const id = entry.id
  const seats = Math.max(entry.seats, 1)
  const spend = entry.monthlySpend

  // Cursor
  if (id === "cursor") {
    if (entry.plan === "Business" && seats <= 3) {
      const projected = seats * 20
      const savings = spend - projected
      return {
        tool: entry.name, currentPlan: entry.plan, currentSpend: spend,
        recommendedAction: `Downgrade to Cursor Pro ($20/user)`,
        projectedSpend: projected,
        monthlySavings: Math.max(savings, 0),
        annualSavings: Math.max(savings * 12, 0),
        status: savings > 0 ? "overspending" : "optimal",
        reason: "Cursor Business adds SSO and privacy mode — unnecessary for teams under 4. Pro gives identical AI features.",
      }
    }
  }

  // GitHub Copilot
  if (id === "github-copilot") {
    if (entry.plan === "Enterprise") {
      const projected = seats * 19
      const savings = spend - projected
      return {
        tool: entry.name, currentPlan: entry.plan, currentSpend: spend,
        recommendedAction: `Downgrade to Copilot Business ($19/user)`,
        projectedSpend: projected,
        monthlySavings: Math.max(savings, 0),
        annualSavings: Math.max(savings * 12, 0),
        status: "overspending",
        reason: "Enterprise requires GitHub Enterprise Cloud. Unless you need custom models or fine-grained admin, Business is identical.",
      }
    }
  }

  // Anthropic Claude
  if (id === "anthropic") {
    if (entry.plan === "Team" && seats < 5) {
      const projected = seats * 20
      const savings = spend - projected
      return {
        tool: entry.name, currentPlan: entry.plan, currentSpend: spend,
        recommendedAction: `Switch to Claude Pro per user ($20/user)`,
        projectedSpend: projected,
        monthlySavings: Math.max(savings, 0),
        annualSavings: Math.max(savings * 12, 0),
        status: "overspending",
        reason: "Claude Team has a 5-seat minimum at $25/seat. Under 5 users, individual Pro at $20/user is cheaper.",
      }
    }
  }

  // ChatGPT
  if (id === "chatgpt") {
    if (entry.plan === "Team" && seats < 3) {
      const projected = seats * 20
      const savings = spend - projected
      return {
        tool: entry.name, currentPlan: entry.plan, currentSpend: spend,
        recommendedAction: `Switch to ChatGPT Plus per user ($20/user)`,
        projectedSpend: projected,
        monthlySavings: Math.max(savings, 0),
        annualSavings: Math.max(savings * 12, 0),
        status: "overspending",
        reason: "ChatGPT Team ($30/user) admin controls rarely justify the premium for teams under 3.",
      }
    }
  }

  // Default — optimal
  return {
    tool: entry.name,
    currentPlan: entry.plan,
    currentSpend: spend,
    recommendedAction: "No change needed",
    projectedSpend: spend,
    monthlySavings: 0,
    annualSavings: 0,
    status: "optimal",
    reason: "Your current plan appears well-matched to your team size and usage.",
  }
}

export function runAudit(form: FormState) {
  const recommendations = form.tools
    .filter(t => t.monthlySpend > 0)
    .map(entry => auditTool(entry))

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0)

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    teamSize: form.teamSize,
    useCase: form.useCase,
  }
}