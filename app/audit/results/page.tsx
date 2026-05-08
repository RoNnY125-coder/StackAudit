"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Save } from "lucide-react"
import { AuditResult } from "@/lib/types"
import SavingsHero from "@/components/results/SavingsHero"
import ShareBar from "@/components/results/ShareBar"
import RecommendationRow from "@/components/results/RecommendationRow"
import AIAnalysis from "@/components/results/AIAnalysis"
import CTABlock from "@/components/results/CTABlock"
import SaveReportModal from "@/components/modals/SaveReportModal"

export default function ResultsPage() {
  const [result, setResult] = useState<AuditResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("stackaudit_result")
    if (stored) {
      setResult(JSON.parse(stored))
    } else {
      // Fallback to mock data if accessed directly
      import("@/lib/mock-data").then(m => setResult(m.MOCK_AUDIT_RESULT))
    }
  }, [])

  if (!result) return null

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[680px] mx-auto px-4 py-8" id="main-content">
        <Link 
          href="/audit" 
          className="inline-flex items-center gap-2 text-label text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Run new audit
        </Link>

        <SavingsHero amount={result.totalMonthlySavings} />
        
        <ShareBar slug={result.shareSlug} />

        <div className="border-t border-outline-variant/30 mt-4">
          {result.recommendations.map((rec, i) => (
            <RecommendationRow key={i} rec={rec} />
          ))}
        </div>

        <AIAnalysis text={result.aiAnalysis} />

        <CTABlock />

        <div className="flex justify-center items-center gap-4 mt-12 mb-24">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant px-6 py-3 rounded-lg font-bold text-on-surface transition-colors"
          >
            <Save className="w-5 h-5" /> Save Report
          </button>
          <button 
            className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant px-6 py-3 rounded-lg font-bold text-on-surface transition-colors"
          >
            <Download className="w-5 h-5" /> Export PDF
          </button>
        </div>
      </main>

      <SaveReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
