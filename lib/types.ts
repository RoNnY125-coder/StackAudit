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
  usageScore: number  // 0-10
}

export interface Recommendation {
  tool: string
  action: string
  monthlySavings: number
  priority: "high" | "medium" | "low"
  reasoning: string
}

export interface AuditResult {
  totalMonthlySavings: number
  totalAnnualSavings: number
  recommendations: Recommendation[]
  aiAnalysis: string
  shareSlug: string
  generatedAt: string
}