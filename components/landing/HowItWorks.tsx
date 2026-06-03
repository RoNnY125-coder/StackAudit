import Link from "next/link"

const steps = [
  {
    number: "01",
    title: "Enter your AI tools",
    description:
      "Select which AI tools and SaaS subscriptions your startup or dev team pays for. Add your plan tier and seat count for each tool.",
  },
  {
    number: "02",
    title: "Get your spend audit",
    description:
      "Our audit engine checks every plan against current 2026 pricing and flags where you are overpaying, over-provisioned, or running redundant subscriptions.",
  },
  {
    number: "03",
    title: "Act on the recommendations",
    description:
      "Get a shareable report with exact downgrade and cancellation recommendations. See your potential monthly and annual savings instantly.",
  },
]

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto border-t border-outline-variant pt-24 mt-24 px-4 lg:px-8 mb-24">
      <h2 className="text-h2 font-bold text-on-surface text-center mb-4">
        How the AI Spend Audit Works
      </h2>
      <p className="text-on-surface-variant text-center max-w-2xl mx-auto mb-16 text-base">
        StackAudit analyzes your AI tool subscriptions and identifies savings
        opportunities for startups and engineering teams in under 60 seconds.
        No account required. Results are instant and shareable.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col">
            <span className="font-mono text-h1 text-primary font-bold mb-4">
              {step.number}
            </span>
            <h3 className="text-h3 text-on-surface font-bold mb-2">
              {step.title}
            </h3>
            <p className="text-on-surface-variant text-body">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-on-surface-variant text-sm mb-4">
          Supports Cursor, GitHub Copilot, ChatGPT, Claude, OpenAI API,
          Windsurf, Vercel, Datadog, Notion, Linear, PagerDuty, and more.
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <Link href="/resources/cursor-vs-copilot" className="text-primary hover:underline">
            Cursor vs Copilot pricing →
          </Link>
          <Link href="/resources/ai-tool-pricing-guide" className="text-primary hover:underline">
            AI tool pricing guide →
          </Link>
          <Link href="/resources" className="text-primary hover:underline">
            All resources →
          </Link>
        </div>
      </div>
    </section>
  )
}
