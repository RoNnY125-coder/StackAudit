import Link from "next/link"
import { ArrowLeft, Info } from "lucide-react"
import { MOCK_AUDIT_RESULT } from "@/lib/mock-data"
import SavingsHero from "@/components/results/SavingsHero"
import RecommendationRow from "@/components/results/RecommendationRow"
import AIAnalysis from "@/components/results/AIAnalysis"
import TopBar from "@/components/layout/TopBar"

export const metadata = {
  title: "Sample Audit | StackAudit",
}

export default function SampleAuditPage() {
  const result = MOCK_AUDIT_RESULT

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-[680px] mx-auto px-4 pt-24 pb-16" id="main-content">
        <div className="flex items-center gap-3 bg-surface border border-outline-variant rounded-lg px-4 py-3 mb-8 text-sm">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <p className="text-on-surface-variant">
            This is a sample audit.{" "}
            <Link href="/audit" className="text-primary hover:underline font-medium">
              Run your own free audit
            </Link>{" "}
            to see your real savings.
          </p>
        </div>

        <Link
          href="/audit"
          className="inline-flex items-center gap-2 text-label text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Run new audit
        </Link>

        <SavingsHero amount={result.totalMonthlySavings} />

        <div className="border-t border-outline-variant/30 mt-4">
          {result.recommendations.map((rec, i) => (
            <RecommendationRow key={i} rec={rec} />
          ))}
        </div>

        <AIAnalysis text={result.aiAnalysis} />
      </main>
    </div>
  )
}
