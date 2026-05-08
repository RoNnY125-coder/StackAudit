import { ToolEntry } from "./types";

export interface ToolRecommendation {
  tool: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  projectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  status: "overspending" | "optimal";
  reason: string;
}

export interface FormState {
  teamSize: number;
  useCase: string;
  tools: ToolEntry[];
}

export interface EngineAuditResult {
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  teamSize: number;
  useCase: string;
}

function auditCursor(entry: ToolEntry): ToolRecommendation {
  const base = {
    tool: entry.id,
    currentPlan: entry.plan,
    currentSpend: entry.monthlySpend,
  } as const;

  const seats = Math.max(entry.seats, 1);

  if (entry.plan === "business" && seats <= 3) {
    const projected = seats * 20;
    const savings = entry.monthlySpend - projected;
    return {
      ...base,
      recommendedAction: `Downgrade to Cursor Pro ($20/user)`,
      projectedSpend: projected,
      monthlySavings: Math.max(savings, 0),
      annualSavings: Math.max(savings * 12, 0),
      status: savings > 0 ? "overspending" : "optimal",
      reason:
        "Cursor Business adds SSO and privacy mode — unnecessary for teams under 4. Pro gives identical AI features.",
    };
  }

  if (entry.plan === "business" && seats >= 4) {
    return {
      ...base,
      recommendedAction: "Business plan is appropriate for your team size",
      projectedSpend: entry.monthlySpend,
      monthlySavings: 0,
      annualSavings: 0,
      status: "optimal",
      reason:
        "Business plan makes sense at 4+ seats where SSO and centralized billing add real value.",
    };
  }

  return {
    ...base,
    recommendedAction: "No change needed",
    projectedSpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    status: "optimal",
    reason: "You are on the most cost-effective Cursor plan for your usage.",
  };
}

function auditGithubCopilot(
  entry: ToolEntry,
  useCase: string
): ToolRecommendation {
  const base = {
    tool: entry.id,
    currentPlan: entry.plan,
    currentSpend: entry.monthlySpend,
  } as const;

  const seats = Math.max(entry.seats, 1);

  if (entry.plan === "enterprise") {
    const projected = seats * 19;
    const savings = entry.monthlySpend - projected;
    return {
      ...base,
      recommendedAction: `Downgrade to Copilot Business ($19/user)`,
      projectedSpend: projected,
      monthlySavings: Math.max(savings, 0),
      annualSavings: Math.max(savings * 12, 0),
      status: "overspending",
      reason:
        "Enterprise requires GitHub Enterprise Cloud. Unless you need custom AI models or fine-grained policy controls, Business is identical.",
    };
  }

  if (entry.plan === "business" && useCase !== "coding") {
    const projected = seats * 10;
    const savings = entry.monthlySpend - projected;
    return {
      ...base,
      recommendedAction: `Downgrade to Copilot Pro ($10/user)`,
      projectedSpend: projected,
      monthlySavings: Math.max(savings, 0),
      annualSavings: Math.max(savings * 12, 0),
      status: "overspending",
      reason:
        "Copilot Business audit logs and policy controls are valuable only for coding-heavy teams. For your use case, Pro is sufficient.",
    };
  }

  return {
    ...base,
    recommendedAction: "No change needed",
    projectedSpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    status: "optimal",
    reason:
      "You are on the right Copilot plan for your team size and use case.",
  };
}

function auditClaude(entry: ToolEntry): ToolRecommendation {
  const base = {
    tool: entry.id,
    currentPlan: entry.plan,
    currentSpend: entry.monthlySpend,
  } as const;

  const seats = Math.max(entry.seats, 1);

  if (entry.plan === "team" && seats < 5) {
    const projected = seats * 20;
    const savings = entry.monthlySpend - projected;
    return {
      ...base,
      recommendedAction: `Switch to Claude Pro per user ($20/user)`,
      projectedSpend: projected,
      monthlySavings: Math.max(savings, 0),
      annualSavings: Math.max(savings * 12, 0),
      status: "overspending",
      reason:
        "Claude Team has a 5-seat minimum at $25/seat = $125/mo minimum. Under 5 users, individual Pro plans at $20/user are cheaper.",
    };
  }

  if (entry.plan === "max_20x" && seats === 1) {
    return {
      ...base,
      recommendedAction: "Evaluate if Max 20x usage is justified",
      projectedSpend: 100,
      monthlySavings: 100,
      annualSavings: 1200,
      status: "overspending",
      reason:
        "Max 20x ($200/mo) is for extremely heavy users. Max 5x ($100/mo) covers most power users. Downgrade if you are not hitting rate limits.",
    };
  }

  return {
    ...base,
    recommendedAction: "No change needed",
    projectedSpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    status: "optimal",
    reason: "You are on the most cost-effective Claude plan for your team.",
  };
}

function auditChatGPT(entry: ToolEntry): ToolRecommendation {
  const base = {
    tool: entry.id,
    currentPlan: entry.plan,
    currentSpend: entry.monthlySpend,
  } as const;

  const seats = Math.max(entry.seats, 1);

  if (entry.plan === "team" && seats < 3) {
    const projected = seats * 20;
    const savings = entry.monthlySpend - projected;
    return {
      ...base,
      recommendedAction: `Switch to ChatGPT Plus per user ($20/user)`,
      projectedSpend: projected,
      monthlySavings: Math.max(savings, 0),
      annualSavings: Math.max(savings * 12, 0),
      status: "overspending",
      reason:
        "ChatGPT Team ($30/user) adds shared workspaces and admin controls. Under 3 users these features rarely justify the $10/user premium.",
    };
  }

  return {
    ...base,
    recommendedAction: "No change needed",
    projectedSpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    status: "optimal",
    reason: "Your ChatGPT plan matches your team size and needs.",
  };
}

function auditGenericTool(entry: ToolEntry): ToolRecommendation {
  return {
    tool: entry.id,
    currentPlan: entry.plan,
    currentSpend: entry.monthlySpend,
    recommendedAction: "No change needed",
    projectedSpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    status: "optimal",
    reason: "Your current plan appears well-matched to your usage.",
  };
}

export function runAudit(form: FormState): EngineAuditResult {
  const enabledTools = form.tools.filter(
    (t) => t.monthlySpend > 0
  );

  const recommendations: ToolRecommendation[] = enabledTools.map((entry) => {
    switch (entry.id) {
      case "cursor":
        return auditCursor(entry);
      case "github_copilot":
        return auditGithubCopilot(entry, form.useCase);
      case "claude":
        return auditClaude(entry);
      case "chatgpt":
        return auditChatGPT(entry);
      default:
        return auditGenericTool(entry);
    }
  });

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    teamSize: form.teamSize,
    useCase: form.useCase,
  };
}