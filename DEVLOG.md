# Dev Log

## Day 1 — 2026-05-07
**Hours worked:** 7
**What I did:** Initialized Next.js project with TypeScript, Tailwind, shadcn/ui. Set up Supabase with audits and leads tables. Deployed to Vercel at https://stack-audit-two.vercel.app. Set up GitHub Actions CI — confirmed green checkmark. Researched and documented pricing for all 8 required AI tools in PRICING_DATA.md. Got Gemini and Resend API keys. Sent outreach messages to people for user interviews.
**What I learned:** Supabase free tier only allows 2 projects — reused existing project. PowerShell uses different syntax than bash for multiline commands. Next.js project names cannot have capital letters on npm.
**Blockers / what I'm stuck on:** Anthropic API requires payment in my region — switched to Gemini API for AI summary. Need to confirm interview times with people I reached out to.
**Plan for tomorrow:** Build the full spend input form with all 8 tools, plan dropdowns, seat inputs, and localStorage persistence. Create auditEngine.ts with savings calculation logic. Write 5 real Jest unit tests for the engine.


## Day 2 — 2026-05-09
**Hours worked:** 8
**What I did:** Fixed Vercel deployment root directory issue. Wired real audit engine replacing mock API. Built spend input form with 8 tools, toggles, plan selectors. Fixed all TypeScript build errors across mock-data, RecommendationRow, types. Expanded audit engine to cover Cursor, Copilot, Claude, ChatGPT, Datadog, Vercel, Windsurf, OpenAI, Notion. Fixed $0 savings bug. Audit now correctly shows $630/mo savings on test data. ShareBar with working copy link live.
**What I learned:** Vercel needs blank root directory when package.json is at repo root. PowerShell Set-Content command writes itself into files if syntax is wrong — always use VS Code to edit files. Audit engine plan names must exactly match TOOL_CATALOG plan strings.
**Blockers / what I'm stuck on:** GitHub Copilot shows $0 savings even when Enterprise selected — user needs to fill in monthly spend manually. Gemini AI summary not yet confirmed working on live site.
**Plan for tomorrow:** Build dashboard page, resources page, fix navigation links, wire lead capture modal to Supabase, add localStorage persistence to form, run Lighthouse audit.

## Day 3 — 2026-05-09
**Hours worked:** 7
**What I did:** Wrote all required entrepreneurial markdown files — GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md, TESTS.md. Ran Lighthouse audit on deployed URLs. Conducted user interviews for USER_INTERVIEWS.md. Fixed navigation links so Dashboard and Resources pages are accessible. Confirmed audit engine working correctly — $630/mo savings showing on test data with Datadog and GitHub Copilot Enterprise inputs.
**What I learned:** The audit results being $0 earlier was user error — selecting plans that genuinely don't need changes. The engine is correct. Writing GTM and ECONOMICS forces you to think through whether the product actually makes business sense — good exercise.
**Blockers / what I'm stuck on:** USER_INTERVIEWS.md needs real interview data — conducting calls today. Lighthouse accessibility score needs checking.
**Plan for tomorrow:** Complete user interviews and fill USER_INTERVIEWS.md with real quotes. Write ARCHITECTURE.md Mermaid diagram. Write REFLECTION.md draft. Add honeypot to lead capture form. Final UI polish on mobile.

## Day 4 — 2026-05-10
**Hours worked:** 5
**What I did:** Conducted user interview 2 via LinkedIn DM with co-founder of an
early-stage job search startup. They are using Claude Pro, OpenAI API, and Gemini
simultaneously for a small team — total spend around $27/month. Key finding: Claude
frustration is about credit reduction not price, which is a different overspend
pattern than the engine currently catches. Updated USER_INTERVIEWS.md with full
notes and direct quotes. Continuing to work on final polish and remaining interviews.
**What I learned:** Small Indian startups often mix INR and USD subscriptions —
Gemini at 200rs alongside Claude at $20 USD. The audit engine assumes USD throughout
which could be confusing for this user segment. Worth noting in the README as a
known limitation.
**Blockers / what I'm stuck on:** Still need one more user interview. REFLECTION.md
not started yet — planning tomorrow.
**Plan for tomorrow:** Complete interview 3. Write REFLECTION.md — all 5 questions.
Take final screenshots for README. Do end-to-end test on live URL.