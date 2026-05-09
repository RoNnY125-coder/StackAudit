import Link from "next/link"
import TopBar from "@/components/layout/TopBar"

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-on-surface tracking-tight">Resources</h1>
          <p className="text-on-surface-variant mt-2 text-lg">Guides and benchmarks for AI tool optimization</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link href="/audit" className="bg-surface border border-outline-variant rounded p-6 hover:border-outline transition-colors group block">
            <h3 className="font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">AI Tool Pricing Guide 2026</h3>
            <p className="text-sm text-on-surface-variant">Complete breakdown of every major AI tool pricing tier with our recommendations.</p>
          </Link>
          <Link href="/audit" className="bg-surface border border-outline-variant rounded p-6 hover:border-outline transition-colors group block">
            <h3 className="font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">How to Audit Your AI Spend</h3>
            <p className="text-sm text-on-surface-variant">Step by step guide to identifying waste in your AI subscriptions.</p>
          </Link>
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="bg-surface border border-outline-variant rounded p-6 hover:border-outline transition-colors group block">
            <h3 className="font-bold text-on-surface mb-2 group-hover:text-primary transition-colors flex items-center gap-1">Credex Credits Explained ↗</h3>
            <p className="text-sm text-on-surface-variant">How discounted AI infrastructure credits work and who qualifies.</p>
          </a>
        </div>

        <div className="border-t border-outline-variant pt-12">
          <h2 className="text-2xl font-bold text-on-surface mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-on-surface mb-1">What is StackAudit?</h4>
              <p className="text-on-surface-variant">StackAudit analyzes your current AI and developer tool subscriptions to identify unused seats, overlapping features, and better pricing tiers.</p>
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">How accurate is the AI spend analysis?</h4>
              <p className="text-on-surface-variant">Our engine uses current 2026 pricing data and aggregates usage patterns from thousands of startups to provide highly accurate, actionable recommendations.</p>
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">Do I need to connect my billing accounts?</h4>
              <p className="text-on-surface-variant">No. StackAudit operates entirely on self-reported data. You just tell us what tools you use and your team size, and we calculate the rest.</p>
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">What tools do you support?</h4>
              <p className="text-on-surface-variant">We currently support major developer tools (Cursor, GitHub Copilot, Vercel), LLM APIs (OpenAI, Anthropic, Gemini), and core infrastructure tools (Datadog, AWS).</p>
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">Are my audit results private?</h4>
              <p className="text-on-surface-variant">Yes. Your audit results are saved securely and are only accessible via the unique shareable link generated for you.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
