# Dev Log

## Day 1 — 2026-05-07
**Hours worked:** 7
**What I did:** Initialized Next.js project with TypeScript, Tailwind, shadcn/ui. Set up Supabase with audits and leads tables. Deployed to Vercel at https://stack-audit-two.vercel.app. Set up GitHub Actions CI — confirmed green checkmark. Researched and documented pricing for all 8 required AI tools in PRICING_DATA.md. Got Gemini and Resend API keys. Sent outreach messages to people for user interviews.
**What I learned:** Supabase free tier only allows 2 projects — reused existing project. PowerShell uses different syntax than bash for multiline commands. Next.js project names cannot have capital letters on npm.
**Blockers / what I'm stuck on:** Anthropic API requires payment in my region — switched to Gemini API for AI summary. Need to confirm interview times with people I reached out to.
**Plan for tomorrow:** Build the full spend input form with all 8 tools, plan dropdowns, seat inputs, and localStorage persistence. Create auditEngine.ts with savings calculation logic. Write 5 real Jest unit tests for the engine.