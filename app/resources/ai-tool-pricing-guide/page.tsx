import TopBar from "@/components/layout/TopBar"
import Link from "next/link"

export const metadata = {
  title: "AI Developer Tool Pricing Guide 2026 — All Plans, All Prices",
  description: "Complete pricing reference for every major AI developer tool in 2026. Cursor, GitHub Copilot, ChatGPT, Claude, Windsurf, Vercel, Datadog. Updated monthly.",
  alternates: { canonical: "https://stackaudit.app/resources/ai-tool-pricing-guide" },
}

export default function PricingGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-3xl mx-auto px-4 py-24">
        <article className="prose prose-invert max-w-none">
          <Link href="/resources" className="text-sm text-on-surface-variant hover:text-primary no-underline mb-8 inline-block">
            ← Back to Resources
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-6">
            AI Developer Tool Pricing Guide 2026
          </h1>
          
          <p className="text-lg text-on-surface-variant mb-12">
            A comprehensive, regularly updated reference of pricing for the most popular AI and developer tools. All prices verified as of May 2026.
          </p>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Cursor Pricing</h2>
            <ul className="space-y-2 mb-6 text-on-surface-variant">
              <li><strong>Hobby:</strong> $0/month</li>
              <li><strong>Pro:</strong> $20/user/month (Annual billing saves 20%)</li>
              <li><strong>Business:</strong> $40/user/month</li>
            </ul>
            <p className="text-on-surface-variant">
              <strong>Recommendation:</strong> Pro is the sweet spot for most developers. Business is only justified for teams of 4+ that require centralized billing, SSO, and strict privacy modes.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">GitHub Copilot Pricing</h2>
            <ul className="space-y-2 mb-6 text-on-surface-variant">
              <li><strong>Free:</strong> $0</li>
              <li><strong>Pro:</strong> $10/month</li>
              <li><strong>Business:</strong> $19/user/month</li>
              <li><strong>Enterprise:</strong> $39/user/month</li>
            </ul>
            <p className="text-on-surface-variant">
              <strong>Recommendation:</strong> Business is required for team management and policy enforcement. Avoid Enterprise unless you already pay for GitHub Enterprise Cloud.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Claude (Anthropic) Pricing</h2>
            <ul className="space-y-2 mb-6 text-on-surface-variant">
              <li><strong>Free:</strong> $0</li>
              <li><strong>Pro:</strong> $20/month</li>
              <li><strong>Team:</strong> $25/seat/month (Minimum 5 seats = $125/mo)</li>
            </ul>
            <p className="text-on-surface-variant">
              <strong>Recommendation:</strong> Individual Pro is cheaper for teams under 5. Upgrade to Team only when you hit the 5-seat minimum for shared billing and increased limits.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">ChatGPT (OpenAI) Pricing</h2>
            <ul className="space-y-2 mb-6 text-on-surface-variant">
              <li><strong>Free:</strong> $0</li>
              <li><strong>Plus:</strong> $20/month</li>
              <li><strong>Team:</strong> $30/user/month</li>
              <li><strong>Enterprise:</strong> Custom pricing</li>
            </ul>
            <p className="text-on-surface-variant">
              <strong>Recommendation:</strong> Team is valuable for shared workspaces but only justified for 3+ users. Enterprise is generally overkill for startups under 150 employees.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Windsurf Pricing</h2>
            <ul className="space-y-2 mb-6 text-on-surface-variant">
              <li><strong>Free:</strong> $0</li>
              <li><strong>Pro:</strong> $15/month</li>
              <li><strong>Teams:</strong> $35/user/month</li>
            </ul>
            <p className="text-on-surface-variant">
              <strong>Recommendation:</strong> Pro offers incredible value. Teams tier adds admin controls that only make sense for teams larger than 4-5 developers.
            </p>
          </section>
          
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Vercel Pricing</h2>
            <ul className="space-y-2 mb-6 text-on-surface-variant">
              <li><strong>Hobby:</strong> $0/month</li>
              <li><strong>Pro:</strong> $20/user/month</li>
              <li><strong>Enterprise:</strong> Custom</li>
            </ul>
            <p className="text-on-surface-variant">
              <strong>Recommendation:</strong> Vercel charges per seat on Pro. The biggest leak is keeping inactive users (designers, PMs) on the team. Audit seats quarterly.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Datadog Pricing</h2>
            <p className="text-on-surface-variant mb-4">Datadog pricing is complex and based on hosts, log volume, and retention.</p>
            <p className="text-on-surface-variant">
              <strong>Recommendation:</strong> The most common mistake is over-provisioning log retention (e.g., 15+ days when 7 is sufficient) and leaving agents running on idle hosts.
            </p>
          </section>

          <div className="bg-surface-container border border-outline-variant rounded-xl p-8 text-center my-12">
            <h3 className="text-2xl font-bold text-on-surface mb-4">Not sure which plan is right for your team size?</h3>
            <p className="text-on-surface-variant mb-6">
              Stop guessing. Let our engine analyze your stack and tell you exactly what you should be paying.
            </p>
            <Link 
              href="/audit" 
              className="inline-block bg-primary text-on-primary font-bold px-8 py-3 rounded hover:bg-primary-fixed-dim transition-colors"
            >
              Run a free audit →
            </Link>
          </div>

        </article>
      </main>
    </div>
  )
}
