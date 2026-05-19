# StackAudit

**Free AI spend auditor for startups.** Find wasted money in your AI tool subscriptions in 60 seconds. No login required.

→ **[stackaudit.app](https://stackaudit.app)**

## What It Does

StackAudit analyzes your AI and developer tool subscriptions — Cursor, GitHub Copilot, ChatGPT, Claude, Vercel, Datadog, and more — and identifies:

- **Overlapping tools** paying for the same features twice
- **Oversized plans** where your team size doesn't justify the tier
- **Underutilized seats** you're paying for but not using

Average startup finds $1,200–2,400/year in potential savings.

## How It Works

1. Enter your tools, plans, team size, and monthly spend
2. Our audit engine runs per-tool and cross-tool analysis
3. Get an instant savings report with specific, actionable recommendations
4. Share your results via a unique link

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI summary**: Google Gemini 1.5 Flash
- **Email**: Resend
- **Deployment**: Vercel

## Running Locally

```bash
git clone https://github.com/[your-username]/stackaudit
cd stackaudit
npm install
cp .env.local.example .env.local
# Fill in your Supabase and Gemini API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
```

## Adding New Tools

1. Add the tool's audit logic to `lib/audit-rules.ts`
2. Add the mapping in `lib/auditEngine.ts` RULE_MAP
3. Add pricing data to the rule function constants
4. The orchestrator picks it up automatically

## License

MIT
