/**
 * @file lib/audit-rules.ts
 * @description One named rule function per supported SaaS tool.
 *
 * Each function follows the same contract:
 *   (entry: ToolEntry, useCase: string) => ToolRecommendation
 *
 * Helper factories at the top (`overspending`, `switchPlan`, `review`, `optimal`)
 * eliminate repetitive object literals and make diffs tiny and readable.
 *
 * To add a new tool:
 *   1. Write a new `auditXxx` function below.
 *   2. Register it in the RULE_MAP inside `lib/auditEngine.ts`.
 */

import { ToolEntry, ToolRecommendation } from "./types"

// ─────────────────────────────────────────────────────────────────────────────
// Shared helper factories
// ─────────────────────────────────────────────────────────────────────────────

/** Build an "overspending" recommendation with pre-computed savings. */
function overspending(
  entry: ToolEntry,
  projected: number,
  action: string,
  reason: string,
  affiliateUrl?: string,
): ToolRecommendation {
  const savings = Math.max(entry.monthlySpend - projected, 0)
  return {
    tool: entry.name,
    currentPlan: entry.plan,
    currentSpend: entry.monthlySpend,
    recommendedAction: action,
    projectedSpend: projected,
    monthlySavings: savings,
    annualSavings: savings * 12,
    status: "overspending",
    reason,
    affiliateUrl,
  }
}

/** Build a "switch plan" recommendation (0 direct savings, but better fit). */
function switchPlan(
  entry: ToolEntry,
  projected: number,
  action: string,
  reason: string,
  affiliateUrl?: string,
): ToolRecommendation {
  return {
    tool: entry.name,
    currentPlan: entry.plan,
    currentSpend: entry.monthlySpend,
    recommendedAction: action,
    projectedSpend: projected,
    monthlySavings: 0,
    annualSavings: 0,
    status: "switch",
    reason,
    affiliateUrl,
  }
}

/** Build a "review" recommendation (flag for manual review, no hard savings). */
function review(
  entry: ToolEntry,
  action: string,
  reason: string,
  savingsFraction = 0,
  affiliateUrl?: string,
): ToolRecommendation {
  const savings = Math.round(entry.monthlySpend * savingsFraction)
  return {
    tool: entry.name,
    currentPlan: entry.plan,
    currentSpend: entry.monthlySpend,
    recommendedAction: action,
    projectedSpend: entry.monthlySpend - savings,
    monthlySavings: savings,
    annualSavings: savings * 12,
    status: "review",
    reason,
    affiliateUrl,
  }
}

/** Build an "optimal" recommendation — no changes needed. */
function optimal(entry: ToolEntry, reason?: string, affiliateUrl?: string): ToolRecommendation {
  return {
    tool: entry.name,
    currentPlan: entry.plan,
    currentSpend: entry.monthlySpend,
    recommendedAction: "No change needed — plan is well-matched",
    projectedSpend: entry.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    status: "optimal",
    reason: reason ?? "Your current plan is cost-effective for your team size and usage pattern.",
    affiliateUrl,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool rule functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cursor — AI code editor.
 *
 * Business plan adds SSO + privacy mode, only justified at 4+ seats.
 * Pro on annual billing saves 20 % vs monthly.
 * Hobby is single-user only.
 */
export function auditCursor(entry: ToolEntry, _useCase: string): ToolRecommendation {
  const seats = Math.max(entry.seats, 1)
  const spend  = entry.monthlySpend

  // Business plan overkill for tiny teams
  if (entry.plan === "Business" && seats <= 3) {
    return overspending(
      entry,
      seats * 20,
      `Downgrade to Cursor Pro ($20/user) — save $${Math.max(spend - seats * 20, 0)}/mo`,
      "Cursor Business adds SSO and privacy mode which are unnecessary for teams under 4. " +
      "Pro gives identical AI completion features at half the price.",
    )
  }

  // Business justified at scale
  if (entry.plan === "Business" && seats >= 4) {
    return optimal(entry, "Business plan is justified at 4+ seats where SSO and centralized billing save admin time.")
  }

  // Suggest upgrading to Business for admin efficiency at 5+ seats
  if (entry.plan === "Pro" && seats >= 5) {
    return switchPlan(
      entry,
      seats * 40,
      "Consider Cursor Business for centralized billing and SSO",
      "At 5+ seats, Cursor Business adds centralized billing and SSO worth the $20/user premium.",
    )
  }

  // Annual billing saves 20 % for solo users on monthly Pro
  if (entry.plan === "Pro" && seats === 1 && spend > 20) {
    return overspending(
      entry,
      16,
      "Switch to annual billing — saves 20 %",
      "Cursor Pro on annual billing costs $16/mo vs $20/mo monthly. Switch to save 20 %.",
      "https://cursor.com/pricing?ref=stackaudit" // TODO: replace with real affiliate link
    )
  }

  // Hobby is single-user only — flag if multiple seats entered
  if (entry.plan === "Hobby" && seats > 1) {
    return switchPlan(
      entry,
      spend,
      "Hobby plan is single-user — each developer needs their own subscription",
      "Cursor Hobby is single-user only. Multiple developers cannot share a single Hobby subscription.",
    )
  }

  return optimal(entry)
}

/**
 * GitHub Copilot — AI pair programmer.
 *
 * Enterprise requires GitHub Enterprise Cloud ($21/user extra).
 * Business audit logs/policy controls only add value for coding teams.
 * Individual plans cannot be centrally managed.
 */
export function auditGithubCopilot(entry: ToolEntry, useCase: string): ToolRecommendation {
  const seats = Math.max(entry.seats, 1)

  // Enterprise overkill unless you have GitHub Enterprise Cloud
  if (entry.plan === "Enterprise") {
    return overspending(
      entry,
      seats * 19,
      "Downgrade to Copilot Business ($19/user)",
      "Copilot Enterprise requires GitHub Enterprise Cloud ($21/user extra). " +
      "Unless you need custom fine-tuned models, Business tier is functionally identical.",
    )
  }

  // Business policy controls are only valuable for coding teams
  const isCodingTeam = useCase === "coding" || useCase === "Software Engineering"
  if (entry.plan === "Business" && !isCodingTeam) {
    return overspending(
      entry,
      seats * 10,
      "Downgrade to Copilot Pro ($10/user)",
      "Copilot Business audit logs and policy controls add value only for coding-heavy teams. " +
      "For your use case, Pro is sufficient.",
    )
  }

  // Individual plans can't be centrally managed for teams
  if (entry.plan === "Individual" && seats > 1) {
    return switchPlan(
      entry,
      seats * 19,
      "Switch to Copilot Business for multi-user management",
      "Individual plans cannot be centrally managed. Business plan at $19/user adds admin controls, " +
      "audit logs, and policy enforcement for teams.",
    )
  }

  // Business at scale for coding teams is optimal
  if (entry.plan === "Business" && seats >= 10 && isCodingTeam) {
    return optimal(entry, "Copilot Business is the right call at 10+ coding seats — audit logs and policy controls pay for themselves.")
  }

  // Pro doesn't scale well for teams
  if (entry.plan === "Pro" && seats > 3) {
    return switchPlan(
      entry,
      seats * 19,
      "Switch to Copilot Business ($19/user) for team management",
      "Pro plans cannot be centrally managed or audited. Business adds admin controls worth the $9/user premium at 4+ seats.",
    )
  }

  return optimal(entry)
}

/**
 * Anthropic Claude — AI assistant / API.
 *
 * Team plan has a 5-seat minimum at $25/seat = $125/mo floor.
 * Under 5 users, individual Pro plans ($20/user) cost less.
 */
export function auditAnthropic(entry: ToolEntry, _useCase: string): ToolRecommendation {
  const seats = Math.max(entry.seats, 1)

  // Team plan below minimum seat threshold → individual Pro is cheaper
  if (entry.plan === "Team" && seats < 5) {
    return overspending(
      entry,
      seats * 20,
      `Switch to Claude Pro per user ($20/user)`,
      "Claude Team has a 5-seat minimum at $25/seat = $125/mo minimum. " +
      "Under 5 users, individual Pro plans at $20/user cost less.",
    )
  }

  // Team is optimal at 5+ seats
  if (entry.plan === "Team" && seats >= 5) {
    return optimal(entry, "Claude Team is cost-effective at 5+ seats and includes collaborative features and admin controls.")
  }

  // Multiple users on individual Pro should migrate to Team
  if (entry.plan === "Claude.ai Pro" && seats > 1) {
    return switchPlan(
      entry,
      seats * 25,
      "Switch to Claude Team plan for multi-user management",
      "Multiple users on individual Pro plans cannot share usage or be centrally managed. " +
      "Team plan adds admin controls and centralized billing.",
    )
  }

  return optimal(entry)
}

/**
 * ChatGPT — OpenAI's chat product.
 *
 * Team adds shared workspaces but is only justified at 3+ users.
 * Enterprise is designed for 150+ seat orgs — overkill under 10 users.
 */
export function auditChatGPT(entry: ToolEntry, _useCase: string): ToolRecommendation {
  const seats = Math.max(entry.seats, 1)

  // Team plan premium not justified for tiny squads
  if (entry.plan === "Team" && seats < 3) {
    return overspending(
      entry,
      seats * 20,
      `Switch to ChatGPT Plus per user ($20/user)`,
      "ChatGPT Team ($30/user) adds shared workspaces and admin controls. " +
      "Under 3 users these features rarely justify the $10/user premium over Plus.",
    )
  }

  // Enterprise overkill under 10 seats
  if (entry.plan === "Enterprise" && seats < 10) {
    return overspending(
      entry,
      seats * 30,
      "Downgrade to ChatGPT Team — Enterprise overkill for your size",
      "ChatGPT Enterprise is designed for 150+ seat orgs with compliance requirements. " +
      "Under 10 users, Team plan provides the same core functionality.",
    )
  }

  // Individual Plus can't be shared
  if (entry.plan === "Plus" && seats > 1) {
    return switchPlan(
      entry,
      seats * 30,
      "Switch to ChatGPT Team ($30/user) for shared workspace",
      "Plus plans are individual and cannot share usage or be centrally managed. " +
      "Team plan at $30/user adds collaborative features for multi-user setups.",
    )
  }

  // Enterprise appropriate at scale
  if (entry.plan === "Enterprise" && seats >= 10) {
    return optimal(entry, "ChatGPT Enterprise is appropriate at 10+ seats with compliance requirements.")
  }

  return optimal(entry)
}

/**
 * Vercel — frontend hosting platform.
 *
 * Pro charges per team member.
 * Removing inactive members (no deploys in 90+ days) is pure savings.
 */
export function auditVercel(entry: ToolEntry, _useCase: string): ToolRecommendation {
  const seats = Math.max(entry.seats, 1)

  // Flag large Pro teams for seat audit
  if (entry.plan === "Pro" && seats > 5) {
    const savings = (seats - 5) * 20
    return overspending(
      { ...entry, monthlySpend: entry.monthlySpend },
      entry.monthlySpend - savings,
      "Audit inactive team members and remove unused seats",
      "Vercel Pro charges per team member. Removing inactive members with no deployments " +
      "in 90+ days reduces cost without affecting active developers.",
    )
  }

  return optimal(entry)
}

/**
 * Windsurf — AI code editor (Codeium).
 *
 * Teams plan adds admin controls and SSO — unnecessary under 4 seats.
 */
export function auditWindsurf(entry: ToolEntry, _useCase: string): ToolRecommendation {
  const seats = Math.max(entry.seats, 1)

  // Teams overkill for micro squads
  if (entry.plan === "Teams" && seats < 4) {
    return overspending(
      entry,
      seats * 15,
      `Downgrade to Windsurf Pro ($15/user)`,
      "Windsurf Teams adds admin controls and SSO unnecessary for teams under 4. " +
      "Pro gives identical AI completion features.",
    )
  }

  // Suggest Teams for larger Pro setups
  if (entry.plan === "Pro" && seats >= 5) {
    return switchPlan(
      entry,
      entry.monthlySpend,
      "Consider Windsurf Teams for admin controls",
      "Windsurf Teams adds admin controls and SSO worth considering at 5+ seats.",
      "https://windsurf.com/?ref=stackaudit" // TODO: replace with real affiliate link
    )
  }

  // Free plan — nothing to optimize
  if (entry.plan === "Free") {
    return optimal(entry, "Free plan is appropriate if usage needs are being met.")
  }

  return optimal(entry)
}

/**
 * Datadog — observability platform.
 *
 * Metric retention and host count are the two biggest cost levers.
 * Most teams over-provision both. Estimated 35 % reduction is conservative.
 */
export function auditDatadog(entry: ToolEntry, _useCase: string): ToolRecommendation {
  const savings = Math.round(entry.monthlySpend * 0.35)
  return overspending(
    entry,
    entry.monthlySpend - savings,
    "Audit metric retention and host count — estimated 35 % reduction possible",
    "Datadog charges per host and metric retention period. Most teams over-provision both. " +
    "Reducing retention from 15 to 7 days and removing idle hosts typically saves 30–40 %.",
  )
}

/**
 * OpenAI API — pay-as-you-go model API.
 *
 * GPT-4o-mini costs ~15× less than GPT-4o for equivalent tasks
 * like summarization, classification, and structured extraction.
 */
export function auditOpenAI(entry: ToolEntry, _useCase: string): ToolRecommendation {
  const spend = entry.monthlySpend

  if (spend > 100) {
    const savings = Math.round(spend * 0.4)
    return overspending(
      entry,
      spend - savings,
      "Route high-volume calls from GPT-4o to GPT-4o-mini",
      "GPT-4o-mini costs 15× less than GPT-4o for tasks like summarization, classification, " +
      "and structured extraction. Route only complex reasoning to full GPT-4o.",
    )
  }

  if (spend >= 50) {
    const savings = Math.round(spend * 0.3)
    return overspending(
      entry,
      spend - savings,
      "Route classification and extraction tasks to GPT-4o-mini",
      "GPT-4o-mini costs 15× less than GPT-4o for classification, summarization, and extraction. " +
      "Route only complex reasoning to GPT-4o.",
    )
  }

  // Low spend — already well-managed
  return optimal(entry, "API spend is low and well-managed. No changes needed.")
}

/**
 * Notion AI — team workspace with AI add-on.
 *
 * Enterprise designed for large orgs with SSO and advanced permissions.
 * Business tier covers all core features for teams under 10.
 * Inactive member seats are a common cost leak.
 */
export function auditNotion(entry: ToolEntry, _useCase: string): ToolRecommendation {
  const seats = Math.max(entry.seats, 1)

  // Large Business teams likely have inactive seats
  if (entry.plan === "Business" && seats > 10) {
    const savings = Math.round(entry.monthlySpend * 0.2)
    return overspending(
      entry,
      entry.monthlySpend - savings,
      "Audit inactive Notion seats — remove users not active in 60 days",
      "Notion Business charges per member. Teams typically have 15–25 % inactive members. " +
      "Removing them reduces cost with zero workflow impact.",
    )
  }

  // Plus is cost-effective for small teams
  if (entry.plan === "Plus" && seats <= 3) {
    return optimal(entry, "Notion Plus is cost-effective for small teams under 4.")
  }

  // Enterprise overkill under 10 seats
  if (entry.plan === "Enterprise" && seats < 10) {
    const savings = Math.round(entry.monthlySpend * 0.4)
    return overspending(
      entry,
      entry.monthlySpend - savings,
      "Downgrade to Notion Business plan",
      "Notion Enterprise is designed for large orgs with SSO and advanced permissions. " +
      "Under 10 users, Business plan covers all core features.",
    )
  }

  return optimal(entry)
}

/**
 * Linear — project management tool.
 *
 * Plus is well-priced for small teams.
 * Large Standard teams may benefit from Plus analytics.
 */
export function auditLinear(entry: ToolEntry, _useCase: string): ToolRecommendation {
  const seats = Math.max(entry.seats, 1)

  if (entry.plan === "Plus" && seats <= 10) {
    return optimal(entry, "Linear Plus is well-priced for teams under 10. No changes needed.")
  }

  if (entry.plan === "Standard" && seats > 15) {
    return switchPlan(
      entry,
      entry.monthlySpend,
      "Consider upgrading to Linear Plus",
      "Linear Plus adds advanced analytics and priority support worth considering at 15+ seats.",
    )
  }

  return optimal(entry)
}

/**
 * PagerDuty — incident management platform.
 *
 * Professional tier at 5+ seats often has unused alert routing features.
 * Flag for manual review before next renewal.
 */
export function auditPagerDuty(entry: ToolEntry, _useCase: string): ToolRecommendation {
  const seats = Math.max(entry.seats, 1)

  if (entry.plan === "Professional" && seats > 5) {
    return review(
      entry,
      "Audit active users and alert routing policies",
      "PagerDuty Professional at 5+ seats often has significant unused alert routing features. " +
      "Audit active users and alert policies before next renewal.",
      0.25,
    )
  }

  return optimal(entry)
}

// ─────────────────────────────────────────────────────────────────────────────
// Export the RuleFn type so auditEngine.ts can type the RULE_MAP
// ─────────────────────────────────────────────────────────────────────────────

/** Function signature every tool rule must satisfy. */
export type RuleFn = (entry: ToolEntry, useCase: string) => ToolRecommendation
