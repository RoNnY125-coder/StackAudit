# Tests

## How to Run

```bash
npm test
```

## Current Results

7 tests passing across 2 test suites.

## Test Files

### lib/__tests__/auditEngine.test.ts

6 tests covering the core audit engine. This is the most critical file to test — the savings logic is the product.

**Test 1 — Cursor Business with 2 seats returns $40/mo savings**
2 seats on Business at $40/user = $80/mo actual. Pro at $20/user = $40/mo projected. Savings = $40/mo. Confirms the most common Cursor downgrade scenario works correctly.

**Test 2 — Cursor Business with 5 seats returns optimal**
Business plan is justified at 4+ seats where SSO and centralized billing add real value. Engine must not flag this as overspending.

**Test 3 — GitHub Copilot Enterprise recommends downgrade to Business**
Enterprise requires GitHub Enterprise Cloud which adds $21/user. Unless custom models are needed, Business at $19/user is functionally identical. Confirms savings calculation fires correctly.

**Test 4 — Claude Team with 2 users recommends switching to Pro**
Claude Team has a 5-seat minimum at $25/seat = $125/mo minimum. 2 users on individual Pro = $40/mo. Engine must catch this gap and flag it as overspending.

**Test 5 — Total savings sums correctly across multiple tools**
Integration test. Cursor Business (2 seats) + Copilot Enterprise (3 seats) combined. Confirms totalMonthlySavings equals sum of individual savings and totalAnnualSavings equals totalMonthlySavings times 12.

**Test 6 — Tool with zero spend excluded from recommendations**
A tool with monthlySpend of 0 must not appear in recommendations and must not contribute to totalMonthlySavings. Prevents false positives from empty form fields.

### lib/__tests__/placeholder.test.ts

Single passing test to keep CI green. Will be removed when full coverage is in place.

## CI Integration

Tests run automatically on every push to main via GitHub Actions.
See .github/workflows/ci.yml for the workflow configuration.
Latest commit must show a green checkmark on GitHub Actions tab.