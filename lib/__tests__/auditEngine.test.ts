import { runAudit } from "../auditEngine"
import { FormState } from "../types"

const baseForm: FormState = {
  teamSize: 3,
  useCase: "coding",
  tools: [],
}

test("Cursor Business with 2 seats recommends downgrade to Pro", () => {
  const form: FormState = {
    ...baseForm,
    tools: [{
      id: "cursor", name: "Cursor", category: "dev-tools",
      plan: "Business", monthlySpend: 80, seats: 2, usageScore: 5
    }],
  }
  const result = runAudit(form)
  expect(result.recommendations[0].monthlySavings).toBe(40)
  expect(result.recommendations[0].status).toBe("overspending")
})

test("Cursor Business with 5 seats is marked optimal", () => {
  const form: FormState = {
    ...baseForm,
    tools: [{
      id: "cursor", name: "Cursor", category: "dev-tools",
      plan: "Business", monthlySpend: 200, seats: 5, usageScore: 8
    }],
  }
  const result = runAudit(form)
  expect(result.recommendations[0].status).toBe("optimal")
  expect(result.recommendations[0].monthlySavings).toBe(0)
})

test("GitHub Copilot Enterprise recommends downgrade to Business", () => {
  const form: FormState = {
    ...baseForm,
    tools: [{
      id: "github-copilot", name: "GitHub Copilot", category: "dev-tools",
      plan: "Enterprise", monthlySpend: 117, seats: 3, usageScore: 7
    }],
  }
  const result = runAudit(form)
  expect(result.recommendations[0].monthlySavings).toBeGreaterThan(0)
  expect(result.recommendations[0].status).toBe("overspending")
})

test("Claude Team with 2 users recommends switching to Pro", () => {
  const form: FormState = {
    ...baseForm,
    tools: [{
      id: "anthropic", name: "Anthropic Claude", category: "llm-apis",
      plan: "Team", monthlySpend: 50, seats: 2, usageScore: 6
    }],
  }
  const result = runAudit(form)
  expect(result.recommendations[0].monthlySavings).toBeGreaterThan(0)
  expect(result.recommendations[0].status).toBe("overspending")
})

test("Total savings sums correctly across multiple tools", () => {
  const form: FormState = {
    ...baseForm,
    tools: [
      {
        id: "cursor", name: "Cursor", category: "dev-tools",
        plan: "Business", monthlySpend: 80, seats: 2, usageScore: 5
      },
      {
        id: "github-copilot", name: "GitHub Copilot", category: "dev-tools",
        plan: "Enterprise", monthlySpend: 117, seats: 3, usageScore: 7
      },
    ],
  }
  const result = runAudit(form)
  expect(result.totalMonthlySavings).toBeGreaterThan(0)
  expect(result.totalAnnualSavings).toBe(
    result.recommendations.reduce((sum, recommendation) => sum + recommendation.annualSavings, 0)
  )
})

test("Tool with zero spend is excluded from recommendations", () => {
  const form: FormState = {
    ...baseForm,
    tools: [{
      id: "cursor", name: "Cursor", category: "dev-tools",
      plan: "Business", monthlySpend: 0, seats: 2, usageScore: 5
    }],
  }
  const result = runAudit(form)
  expect(result.recommendations.length).toBe(0)
  expect(result.totalMonthlySavings).toBe(0)
})

test("Low usage tools are flagged for cancellation review before tool rules", () => {
  const form: FormState = {
    ...baseForm,
    tools: [{
      id: "cursor", name: "Cursor", category: "dev-tools",
      plan: "Business", monthlySpend: 80, seats: 2, usageScore: 2
    }],
  }
  const result = runAudit(form)
  expect(result.recommendations[0].status).toBe("review")
  expect(result.recommendations[0].recommendedAction).toBe("Evaluate cancellation — usage is very low")
  expect(result.recommendations[0].monthlySavings).toBe(80)
  expect(result.recommendations[0].annualSavings).toBe(960)
})

test("Datadog Developer plan is not automatically marked overspending", () => {
  const form: FormState = {
    ...baseForm,
    tools: [{
      id: "datadog", name: "Datadog", category: "infrastructure",
      plan: "Developer", monthlySpend: 31, seats: 1, usageScore: 5
    }],
  }
  const result = runAudit(form)
  expect(result.recommendations[0].status).toBe("optimal")
  expect(result.recommendations[0].monthlySavings).toBe(0)
})

test("Redundancy recommendations compute savings from cancelled tool spend", () => {
  const form: FormState = {
    ...baseForm,
    tools: [
      {
        id: "cursor", name: "Cursor", category: "dev-tools",
        plan: "Business", monthlySpend: 120, seats: 3, usageScore: 5
      },
      {
        id: "windsurf", name: "Windsurf", category: "dev-tools",
        plan: "Teams", monthlySpend: 70, seats: 2, usageScore: 5
      },
    ],
  }
  const result = runAudit(form)
  const redundancy = result.recommendations.find(r => r.recommendedAction.includes("primary AI coding editor"))
  expect(redundancy).toBeDefined()
  expect(redundancy?.tool).toBe("Cursor")
  expect(redundancy?.monthlySavings).toBe(120)
  expect(redundancy?.annualSavings).toBe(1440)
})
