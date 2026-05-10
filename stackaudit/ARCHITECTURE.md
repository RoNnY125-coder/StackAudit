# Architecture

## System Diagram
(Mermaid diagram — adding Day 5)

## Data Flow
1. User fills spend form → state saved to localStorage on every change
2. User submits → auditEngine.ts runs client-side (pure functions, no API calls)
3. Audit result posted to Supabase → returns unique audit ID
4. User redirected to /audit/[id]
5. Page loads audit from Supabase, calls Gemini API for AI summary
6. User sees results → clicks "Save Report" → email captured → lead saved to Supabase → confirmation email sent via Resend

## Stack
- Frontend: Next.js 14 + TypeScript + Tailwind + shadcn/ui
- Database: Supabase (Postgres)
- Email: Resend
- AI Summary: Gemini API (free tier)
- Deploy: Vercel
- CI: GitHub Actions

## Why This Stack
(Filling out Day 5)

## Scaling to 10k Audits/Day
(Filling out Day 5)