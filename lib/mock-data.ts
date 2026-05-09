import { ToolCatalogEntry, AuditResult } from "./types"

export const TOOL_CATALOG: ToolCatalogEntry[] = [
  { id: "cursor",         name: "Cursor",          category: "dev-tools",      defaultPrice: 19,   plans: ["Hobby", "Pro", "Business"] },
  { id: "github-copilot", name: "GitHub Copilot",  category: "dev-tools",      defaultPrice: 19,   plans: ["Individual", "Business", "Enterprise"] },
  { id: "vercel",         name: "Vercel",           category: "dev-tools",      defaultPrice: 20,   plans: ["Hobby", "Pro", "Enterprise"] },
  { id: "windsurf",       name: "Windsurf",         category: "dev-tools",      defaultPrice: 15,   plans: ["Free", "Pro", "Teams"] },
  { id: "openai",         name: "OpenAI API",       category: "llm-apis",       defaultPrice: 200,  plans: ["Pay-as-you-go", "Tier 1", "Tier 2"] },
  { id: "anthropic",      name: "Anthropic Claude", category: "llm-apis",       defaultPrice: 150,  plans: ["API", "Claude.ai Pro", "Team"] },
  { id: "gemini",         name: "Google Gemini",    category: "llm-apis",       defaultPrice: 0,    plans: ["Free", "Advanced", "API"] },
  { id: "chatgpt",        name: "ChatGPT Plus",     category: "llm-apis",       defaultPrice: 20,   plans: ["Free", "Plus", "Team", "Enterprise"] },
  { id: "datadog",        name: "Datadog",          category: "infrastructure", defaultPrice: 1800, plans: ["Developer", "Pro", "Enterprise"] },
  { id: "aws",            name: "AWS",              category: "infrastructure", defaultPrice: 500,  plans: ["Pay-as-you-go"] },
  { id: "pagerduty",      name: "PagerDuty",        category: "infrastructure", defaultPrice: 21,   plans: ["Free", "Professional", "Business"] },
  { id: "notion",         name: "Notion AI",        category: "productivity",   defaultPrice: 16,   plans: ["Free", "Plus", "Business", "Enterprise"] },
  { id: "linear",         name: "Linear",           category: "productivity",   defaultPrice: 8,    plans: ["Free", "Standard", "Plus"] },
]

export const MOCK_AUDIT_RESULT: AuditResult = {
  totalMonthlySavings: 2400,
  totalAnnualSavings: 28800,
  teamSize: 5,
  useCase: "coding",
  shareSlug: "mock-audit-2026",
  generatedAt: new Date().toISOString(),
  aiAnalysis: "Your infrastructure spending is optimized at the database layer, but computing and monitoring tools show significant drift. Addressing Datadog alone recovers 52% of identified savings without impacting observability.",
  recommendations: [
    { tool: "Datadog", currentPlan: "Pro", currentSpend: 1800, recommendedAction: "Downgrade to Standard Tier", projectedSpend: 550, monthlySavings: 1250, annualSavings: 15000, status: "overspending", reason: "85% of premium features are unutilized across active projects over the last 90 days." },
    { tool: "AWS EC2", currentPlan: "Pay-as-you-go", currentSpend: 800, recommendedAction: "Terminate Idle Instances", projectedSpend: 0, monthlySavings: 800, annualSavings: 9600, status: "overspending", reason: "14 instances with less than 2% CPU utilization for 14 consecutive days." },
    { tool: "Vercel", currentPlan: "Pro", currentSpend: 350, recommendedAction: "Consolidate Team Seats", projectedSpend: 0, monthlySavings: 350, annualSavings: 4200, status: "overspending", reason: "7 accounts have not deployed or logged in during the past 6 months." }
  ]
}