// ── Form hook types (used by SpendForm and ToolRow) ──────────────────────────
export interface ToolCatalogEntry {
  id: string
  name: string
  category: string
  defaultPrice: number
  plans: string[]
}

export interface ToolEntry {
  id: string
  name: string
  category: string
  monthlySpend: number
  seats: number
  plan: string
  usageScore: number
}

// ── Audit engine types ────────────────────────────────────────────────────────
export type UseCase = "coding" | "writing" | "data" | "research" | "mixed"

export type ToolName =
  | "cursor"
  | "github_copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf"

export type EngineToolEntry = {
  tool: ToolName
  enabled: boolean
  plan: string
  monthlySpend: number
  seats: number
}

export type FormState = {
  teamSize: number
  useCase: string
  tools: ToolEntry[]
}

export type ToolRecommendation = {
  tool: string
  currentPlan: string
  currentSpend: number
  recommendedAction: string
  projectedSpend: number
  monthlySavings: number
  annualSavings: number
  reason: string
  status: "overspending" | "optimal" | "switch" | "review"
}

export type AuditResult = {
  recommendations: ToolRecommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  teamSize: number
  useCase: string
  shareSlug: string
  generatedAt: string
  aiAnalysis: string
}