# Architecture

## System Diagram

```mermaid
graph TD
    A[User lands on /] --> B[Clicks Audit My Stack]
    B --> C[/audit — Spend Input Form]
    C --> D[Selects tools, plans, seats, spend]
    D --> E[Clicks Run Audit]
    E --> F[useAuditForm.submit]
    F --> G[POST /api/analyze]
    G --> H[runAudit — auditEngine.ts]
    H --> I[Per-tool savings logic]
    I --> J[AuditResult object]
    J --> K[Save to Supabase audits table]
    K --> L[Call Gemini API for AI summary]
    L --> M[Return result with shareSlug UUID]
    M --> N[Store in sessionStorage]
    N --> O[Redirect to /audit/results]
    O --> P[SavingsHero + RecommendationRows + AIAnalysis]
    P --> Q[User clicks Save Report]
    Q --> R[SaveReportModal opens]
    R --> S[POST /api/leads]
    S --> T[Supabase leads table]
    P --> U[User clicks Copy Link]
    U --> V[/audit/id — public shareable page]
    V --> W[Fetch from Supabase by ID]
    W --> X[Show tools and savings — no PII]
```

## Data Flow

1. User fills form — state saved to localStorage on every change so it survives page reloads
2. User submits — auditEngine.ts runs client-side as pure functions with no external calls
3. Result posted to Supabase audits table — returns UUID used as share slug
4. Gemini API called with audit context — generates 100-word personalized summary
5. Full result stored in sessionStorage — redirect to /audit/results
6. Results page reads from sessionStorage — fetches from Supabase if empty
7. User saves report — /api/leads saves email to Supabase leads table with honeypot check
8. Shareable URL /audit/[id] reads from Supabase — strips PII, shows savings only

## Why This Stack

**Next.js 16** — App Router gives SSR for Open Graph tags on shareable URLs. API routes live in the same codebase. No separate backend needed.

**Supabase** — free Postgres, simple TypeScript client, two-table data model. No need for Firebase document model complexity.

**Gemini API** — completely free via Google AI Studio. Anthropic requires upfront payment in India with no free trial. Same output quality for a 100-word summary task.

**Tailwind + shadcn/ui** — shadcn copies components directly into the project so they are fully editable. Lighthouse accessibility 93 on first run with zero extra accessibility work.

**Vercel** — one command deploy, automatic CI on every push to main, free hobby tier covers this scale easily.

## Scaling to 10k Audits Per Day

**Rate limiting** — currently no rate limiting on /api/analyze. At scale add Upstash Redis rate limiting — 10 requests per IP per hour prevents abuse without affecting legitimate users.

**Background Gemini calls** — calling Gemini synchronously on every audit adds latency and risks hitting rate limits at volume. Move to Vercel background functions. Return audit result immediately and update AI summary asynchronously.

**Short slugs instead of UUIDs** — current shareable URL exposes the Supabase row UUID. Replace with a 6-character random slug stored in a separate column. Cleaner URLs and harder to enumerate.

**CDN caching for shared audits** — /audit/[id] data never changes after creation. Cache at CDN edge with 24-hour TTL to reduce Supabase reads significantly at scale.

**Pricing data in database** — pricing is currently hardcoded in auditEngine.ts. At scale this needs to be a Supabase table so prices can be updated weekly without a code deploy.