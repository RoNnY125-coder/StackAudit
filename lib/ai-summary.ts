/**
 * @file lib/ai-summary.ts
 * @description Deterministic fallback summaries when Gemini API is unavailable.
 */

/**
 * Generate a personalized text summary of the audit findings.
 * 
 * @param monthlySavings - Total identified monthly savings in USD
 * @param teamSize       - Number of team members
 * @param useCase        - Primary use case (e.g. "Software Engineering")
 * @returns A 2-3 sentence string summary
 */
export function generateFallbackSummary(monthlySavings: number, teamSize: number, useCase: string): string {
  if (monthlySavings === 0) {
    return `Your team of ${teamSize} is spending efficiently on AI tools for ${useCase}. Your current stack is well-optimized — no immediate changes recommended. We'll notify you when better options become available for your use case.`
  }
  
  const annualSavings = monthlySavings * 12
  return `Your team of ${teamSize} focused on ${useCase} could save $${monthlySavings}/month ($${annualSavings}/year) by optimizing your AI tool subscriptions. The biggest opportunities are in plan right-sizing — you're paying for features your team size doesn't need. Acting on these recommendations takes less than 30 minutes and requires no workflow changes.`
}
