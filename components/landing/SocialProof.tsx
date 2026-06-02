"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

interface Stats {
  totalAudits: number
  avgMonthlySavings: number
  lastAuditAt: string | null
}

function timeAgo(iso: string | null): string {
  if (!iso) return "—"
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)
}

export default function SocialProof() {
  const [stats, setStats] = useState<Stats>({
    totalAudits: 0,
    avgMonthlySavings: 0,
    lastAuditAt: null,
  })
  const [loaded, setLoaded] = useState(false)
  const [lastLabel, setLastLabel] = useState("—")

  const fetchStats = () => {
    fetch(`/api/stats?t=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error(`stats ${r.status}`)
        return r.json()
      })
      .then((data: Stats) => {
        setStats(data)
        setLastLabel(timeAgo(data.lastAuditAt))
        setLoaded(true)
      })
      .catch((err) => {
        console.error("[SocialProof]", err)
        setLoaded(true)
      })
  }

  // Initial fetch
  useEffect(() => {
    fetchStats()
  }, [])

  // Re-fetch when the tab becomes visible again (e.g. user returns from audit page)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchStats()
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [])

  // Re-fetch when a new audit completes (fired by useAuditForm)
  useEffect(() => {
    const onAuditComplete = () => fetchStats()
    window.addEventListener("stackaudit:audit-complete", onAuditComplete)
    return () => window.removeEventListener("stackaudit:audit-complete", onAuditComplete)
  }, [])

  // Refresh the "X ago" label every 30 s without re-fetching
  useEffect(() => {
    if (!stats.lastAuditAt) return
    const id = setInterval(
      () => setLastLabel(timeAgo(stats.lastAuditAt)),
      30_000
    )
    return () => clearInterval(id)
  }, [stats.lastAuditAt])

  const dimClass = loaded ? "opacity-100" : "opacity-30"

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
      <h2 className="sr-only">Audit Statistics</h2>
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant">

          {/* Audits run */}
          <div className="px-6 py-5 text-center">
            <p className={`text-2xl font-bold text-on-surface transition-opacity duration-500 ${dimClass}`}>
              {stats.totalAudits > 0
                ? stats.totalAudits.toLocaleString()
                : loaded ? "0" : "—"}
            </p>
            <p className="text-sm text-on-surface-variant">audits run</p>
          </div>

          {/* Avg saving */}
          <div className="px-6 py-5 text-center">
            <p className={`text-2xl font-bold text-primary transition-opacity duration-500 ${dimClass}`}>
              {stats.avgMonthlySavings > 0
                ? `${formatCurrency(stats.avgMonthlySavings)}/mo`
                : loaded ? "$0/mo" : "—"}
            </p>
            <p className="text-sm text-on-surface-variant">avg saving found</p>
          </div>

          {/* Last audit */}
          <div className="px-6 py-5 text-center">
            <p className={`text-2xl font-bold text-on-surface transition-opacity duration-500 ${dimClass}`}>
              {lastLabel}
            </p>
            <p className="text-sm text-on-surface-variant">last audit</p>
          </div>

        </div>
        <div className="border-t border-outline-variant px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-on-surface-variant text-sm">
            Trusted by founders optimizing their AI spend.
          </p>
          <Link
            href="/audit"
            className="text-primary hover:text-primary-fixed font-bold text-sm transition-colors whitespace-nowrap"
          >
            Run your audit →
          </Link>
        </div>
      </div>
    </section>
  )
}
