"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Stats {
  totalAudits: number
  avgMonthlySavings: number
  lastAuditAt: string | null
}

function formatTimeAgo(isoString: string | null): string {
  if (!isoString) return "—"
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)
}

// Fallback values shown while loading — realistic, not inflated
const FALLBACK: Stats = {
  totalAudits: 0,
  avgMonthlySavings: 0,
  lastAuditAt: null,
}

export default function SocialProof() {
  const [stats, setStats] = useState<Stats>(FALLBACK)
  const [loaded, setLoaded] = useState(false)
  const [lastAuditLabel, setLastAuditLabel] = useState<string>("—")

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: Stats) => {
        setStats(data)
        setLastAuditLabel(formatTimeAgo(data.lastAuditAt))
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  // Update the "X ago" label every 30 seconds without re-fetching
  useEffect(() => {
    if (!stats.lastAuditAt) return
    const interval = setInterval(() => {
      setLastAuditLabel(formatTimeAgo(stats.lastAuditAt))
    }, 30_000)
    return () => clearInterval(interval)
  }, [stats.lastAuditAt])

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
      <h2 className="sr-only">Audit Statistics</h2>
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant">
          <div className="px-6 py-5 text-center">
            <p
              className={`text-2xl font-bold text-on-surface transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-40"}`}
            >
              {stats.totalAudits > 0 ? stats.totalAudits.toLocaleString() : "—"}
            </p>
            <p className="text-sm text-on-surface-variant">audits run</p>
          </div>
          <div className="px-6 py-5 text-center">
            <p
              className={`text-2xl font-bold text-primary transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-40"}`}
            >
              {stats.avgMonthlySavings > 0
                ? `${formatCurrency(stats.avgMonthlySavings)}/mo`
                : "—"}
            </p>
            <p className="text-sm text-on-surface-variant">avg saving found</p>
          </div>
          <div className="px-6 py-5 text-center">
            <p
              className={`text-2xl font-bold text-on-surface transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-40"}`}
            >
              {lastAuditLabel}
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
