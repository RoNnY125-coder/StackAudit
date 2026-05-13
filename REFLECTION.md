# Reflection — StackAudit

## 1. Technical Decisions & Rationale
For StackAudit, I chose **Next.js (App Router)** as the core framework. This was driven by the need for rapid development, excellent SEO out-of-the-box, and easy deployment to Vercel. For the database, **Supabase** was selected due to its seamless integration with Next.js and the ease of setting up tables like `audits` and `leads` without managing a full backend server.

The choice of **Gemini 1.5 Flash** for AI summaries was a strategic pivot. While Anthropic was the original choice, regional payment restrictions necessitated a switch. Gemini provided comparable quality for the specific task of 100-word personalized audit summaries while remaining completely free via Google AI Studio.

## 2. Key Challenges & Resolutions
- **Regional API Constraints:** As mentioned, Anthropic's regional billing was a blocker. I resolved this by migrating the prompt and logic to Gemini, which integrated smoothly with the existing Next.js API routes.
- **Data Consistency:** Ensuring that the audit engine's calculations matched the real-world pricing documented in `PRICING_DATA.md` required several iterations. I implemented a centralized `TOOL_CATALOG` to ensure the engine and the UI shared the same source of truth.
- **PowerShell vs Bash:** Developing on Windows presented some syntax challenges for automated scripts. I learned to use `;` instead of `&&` and properly escape strings for PowerShell commands.

## 3. Core Learnings
- **The Power of Rapid Prototyping:** Building a functional audit engine within the first 48 hours allowed me to spend the remaining time on UI polish and real-world testing.
- **Documentation as a Design Tool:** Writing `GTM.md`, `ECONOMICS.md`, and `ARCHITECTURE.md` early in the process forced me to think through edge cases that influenced the final code structure.
- **User-Centric Adjustments:** User interviews revealed that small startups often mix currencies (INR and USD). This highlighted a need for multi-currency support in the future roadmap.

## 4. Notable Successes
- **Functional Accuracy:** The audit engine successfully identifies significant savings (e.g., $630/mo on standard test data), providing immediate value to the user.
- **Deployment Stability:** Achieved a consistent green status on GitHub Actions CI and maintained a stable production environment on Vercel throughout the development cycle.
- **Security Posture:** Successfully implemented a robust environment variable system to keep all sensitive API keys out of public repositories.

## 5. Future Roadmap
- **Automated Cancellations:** Implement direct integration with SaaS provider APIs to allow users to cancel or downgrade plans directly from the StackAudit dashboard.
- **Multi-User Workspaces:** Allow startup teams to collaborate on audits and share savings reports internally.
- **Expanded Tool Support:** Add more specific enterprise tools and infrastructure services (e.g., Snowflake, New Relic) to the audit engine.
