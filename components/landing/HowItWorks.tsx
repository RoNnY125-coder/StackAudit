import Link from "next/link";

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
    title: "Act on recommendations",
    description:
      "Get a shareable report with exact downgrade and cancellation recommendations. See your potential monthly and annual savings instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto border-t border-outline-variant/30 pt-24 mt-24 px-4 lg:px-8 mb-24">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold text-on-surface mb-6 tracking-tight">
          How it works
        </h2>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
          StackAudit analyzes your AI tool subscriptions and identifies savings
          opportunities for engineering teams in under 60 seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-outline-variant/50 -z-10"></div>
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center md:items-start text-center md:text-left bg-surface-container/30 p-8 rounded-3xl border border-outline-variant/20 relative backdrop-blur-sm"
          >
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-xl mb-6 border border-primary/20">
              {step.number}
            </span>
            <h3 className="text-xl text-on-surface font-bold mb-3">
              {step.title}
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center p-8 bg-surface-container rounded-3xl border border-outline-variant/50">
        <p className="text-on-surface-variant text-sm mb-6 max-w-3xl mx-auto">
          Supports Cursor, GitHub Copilot, ChatGPT, Claude, OpenAI API,
          Windsurf, Vercel, Datadog, Notion, Linear, PagerDuty, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium">
          <Link
            href="/resources/cursor-vs-copilot"
            className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            Cursor vs Copilot pricing <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/resources/ai-tool-pricing-guide"
            className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            AI tool pricing guide <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/resources"
            className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            All resources <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
