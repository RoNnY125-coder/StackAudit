"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Save } from "lucide-react"
import { AuditResult } from "@/lib/types"
import SavingsHero from "@/components/results/SavingsHero"
import ShareBar from "@/components/results/ShareBar"
import RecommendationRow from "@/components/results/RecommendationRow"
import AIAnalysis from "@/components/results/AIAnalysis"
import CTABlock from "@/components/results/CTABlock"
import SaveReportModal from "@/components/modals/SaveReportModal"
import ProReportModal from "@/components/modals/ProReportModal"

function getStoredResult(): AuditResult | null {
  if (typeof window === "undefined") return null
  try {
    const stored = sessionStorage.getItem("stackaudit_result")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function ResultsPage() {
  const [result] = useState<AuditResult | null>(getStoredResult)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProModalOpen, setIsProModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!result) {
      router.push("/audit")
    }
  }, [result, router])

  if (!result) return null

  const totalMonthlySavings = result.recommendations.reduce(
    (sum, r) => sum + (r.monthlySavings ?? 0), 0
  )
  const totalAnnualSavings = result.recommendations.reduce(
    (sum, r) => sum + (r.annualSavings ?? 0), 0
  )
  void totalAnnualSavings

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[680px] mx-auto px-4 py-8" id="main-content">
        <Link
          href="/audit"
          className="inline-flex items-center gap-2 text-label text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Run new audit
        </Link>

        <SavingsHero amount={totalMonthlySavings} />

        <div className="print:hidden">
          <ShareBar slug={result.shareSlug} />
        </div>

        <div className="border-t border-outline-variant/30 mt-4">
          {result.recommendations.map((rec, i) => (
            <RecommendationRow key={i} rec={rec} />
          ))}
        </div>

        <AIAnalysis text={result.aiAnalysis} />

        <div className="print:hidden">
          <CTABlock savings={totalMonthlySavings} />
        </div>

        <div className="flex justify-center items-center gap-4 mt-12 mb-24 print:hidden">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant px-6 py-3 rounded-lg font-bold text-on-surface transition-colors"
          >
            <Save className="w-5 h-5" /> Save Report
          </button>
          <button
            onClick={() => setIsProModalOpen(true)}
            className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant px-6 py-3 rounded-lg font-bold text-on-surface transition-colors"
          >
            <Download className="w-5 h-5" /> Download PDF Report
          </button>
        </div>
      </main>

      <SaveReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ProReportModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        slug={result.shareSlug}
      />
    </div>
  )
}
