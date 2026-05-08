import { ToolCatalogEntry, AuditResult } from "./types"

// Populate with realistic AI/dev tools
export const TOOL_CATALOG: ToolCatalogEntry[] = [
  // Developer Tools
  { id: "cursor",         name: "Cursor",          category: "dev-tools",      defaultPrice: 19,   plans: ["Hobby", "Pro", "Business"] },
  { id: "github-copilot", name: "GitHub Copilot",  category: "dev-tools",      defaultPrice: 19,   plans: ["Individual", "Business", "Enterprise"] },
  { id: "vercel",         name: "Vercel",           category: "dev-tools",      defaultPrice: 20,   plans: ["Hobby", "Pro", "Enterprise"] },
  { id: "windsurf",       name: "Windsurf",         category: "dev-tools",      defaultPrice: 15,   plans: ["Free", "Pro", "Teams"] },
  // AI/LLM
  { id: "openai",         name: "OpenAI API",       category: "llm-apis",       defaultPrice: 200,  plans: ["Pay-as-you-go", "Tier 1", "Tier 2"] },
  { id: "anthropic",      name: "Anthropic Claude", category: "llm-apis",       defaultPrice: 150,  plans: ["API", "Claude.ai Pro", "Team"] },
  { id: "gemini",         name: "Google Gemini",    category: "llm-apis",       defaultPrice: 0,    plans: ["Free", "Advanced", "API"] },
  { id: "chatgpt",        name: "ChatGPT Plus",     category: "llm-apis",       defaultPrice: 20,   plans: ["Free", "Plus", "Team", "Enterprise"] },
  // Infrastructure
  { id: "datadog",        name: "Datadog",          category: "infrastructure", defaultPrice: 1800, plans: ["Developer", "Pro", "Enterprise"] },
  { id: "aws",            name: "AWS",              category: "infrastructure", defaultPrice: 500,  plans: ["Pay-as-you-go"] },
  { id: "pagerduty",      name: "PagerDuty",        category: "infrastructure", defaultPrice: 21,   plans: ["Free", "Professional", "Business"] },
  // Productivity
  { id: "notion",         name: "Notion AI",        category: "productivity",   defaultPrice: 16,   plans: ["Free", "Plus", "Business", "Enterprise"] },
  { id: "linear",         name: "Linear",           category: "productivity",   defaultPrice: 8,    plans: ["Free", "Standard", "Plus"] },
]

export const MOCK_AUDIT_RESULT: AuditResult = {
  totalMonthlySavings: 2400,
  totalAnnualSavings: 28800,
  recommendations: [
    {
      tool: "Datadog",
      action: "Downgrade to Standard Tier",
      monthlySavings: 1250,
      priority: "high",
      reasoning: "Current usage metrics show 85% of premium features are unutilized across active projects over the last 90 days."
    },
    {
      tool: "AWS EC2",
      action: "Terminate Idle Instances",
      monthlySavings: 800,
      priority: "medium",
      reasoning: "Identified 14 instances in us-east-1 with <2% CPU utilization for consecutive 14-day periods."
    },
    {
      tool: "Vercel",
      action: "Consolidate Team Seats",
      monthlySavings: 350,
      priority: "low",
      reasoning: "7 user accounts have not initiated a deployment or logged into the dashboard in the past 6 months."
    },
  ],
  aiAnalysis: "Your infrastructure spending is highly optimized at the database layer, but computing and monitoring tools show significant drift. We detected a pattern of over-provisioning during Q3 that was never scaled back. Addressing the Datadog tier alone will recover 52% of your identified bloat without impacting current deployment velocity or observability requirements.",
  shareSlug: "8f2a9c-2024",
  generatedAt: new Date().toISOString(),
}
