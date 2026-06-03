import Link from "next/link"
import TopBar from "@/components/layout/TopBar"
import { supabaseAdmin } from "@/lib/supabase"

interface AuditRow {
  id: string
  created_at: string
  tools_json: { monthlySpend?: number; id?: string }[]
  savings_json: { monthlySavings?: number; annualSavings?: number }[]
  total_monthly_savings: number
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)
}

// Recompute savings from savings_json rows — never trust the stored aggregate
function recomputeSavings(row: AuditRow): number {
  const recs = Array.isArray(row.savings_json) ? row.savings_json : []
  const computed = recs.reduce((sum, r) => sum + (r.monthlySavings ?? 0), 0)
  return computed > 0 ? computed : (row.total_monthly_savings ?? 0)
}

// Count only tools the user actually activated (monthlySpend > 0)
function countActiveTools(row: AuditRow): number {
  const tools = Array.isArray(row.tools_json) ? row.tools_json : []
  return tools.filter((t) => (t.monthlySpend ?? 0) > 0).length
}

// Sum only active tool spend
function sumTotalSpend(row: AuditRow): number {
  const tools = Array.isArray(row.tools_json) ? row.tools_json : []
  return tools.reduce((sum, t) => sum + (t.monthlySpend ?? 0), 0)
}

export default async function DashboardPage() {
  const { data: audits, error } = await supabaseAdmin
    .from("audits")
    .select("id, created_at, tools_json, savings_json, total_monthly_savings")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("[Dashboard] Supabase error:", error)
  }

  const rows = (audits ?? []) as AuditRow[]
  const latest = rows[0] ?? null

  const latestSavings = latest ? recomputeSavings(latest) : 0
  const latestSpend = latest ? sumTotalSpend(latest) : 0
  const latestToolCount = latest ? countActiveTools(latest) : 0

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-6xl mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-on-surface tracking-tight">
            Dashboard
          </h1>
          <p className="text-on-surface-variant mt-2">Your AI spend overview</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-surface border border-outline-variant rounded p-6">
            <h3 className="text-sm text-on-surface-variant mb-1 font-mono">
              Total Monthly Spend
            </h3>
            <p className="text-3xl font-bold text-on-surface">
              {latestSpend > 0 ? formatCurrency(latestSpend) : "—"}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-6">
            <h3 className="text-sm text-on-surface-variant mb-1 font-mono">
              Tools Tracked
            </h3>
            <p className="text-3xl font-bold text-on-surface">
              {latestToolCount > 0 ? latestToolCount : "—"}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-6">
            <h3 className="text-sm text-on-surface-variant mb-1 font-mono">
              Potential Savings
            </h3>
            <p className="text-3xl font-bold text-primary">
              {latestSavings > 0 ? formatCurrency(latestSavings) : "—"}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-6">
            <h3 className="text-sm text-on-surface-variant mb-1 font-mono">
              Last Audit
            </h3>
            <p className="text-3xl font-bold text-on-surface">
              {latest ? formatDate(latest.created_at) : "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Audit history table */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-on-surface mb-4">
              Recent Audits
            </h2>
            <div className="bg-surface border border-outline-variant rounded divide-y divide-outline-variant">
              {rows.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-on-surface-variant mb-4">
                    No audits yet.
                  </p>
                  <Link
                    href="/audit"
                    className="text-primary hover:underline font-bold text-sm"
                  >
                    Run your first audit →
                  </Link>
                </div>
              ) : (
                rows.map((audit) => {
                  const savings = recomputeSavings(audit)
                  const toolCount = countActiveTools(audit)
                  return (
                    <div
                      key={audit.id}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-on-surface truncate">
                          {formatDate(audit.created_at)}
                        </p>
                        <p className="text-sm text-on-surface-variant">
                          {toolCount} tool{toolCount !== 1 ? "s" : ""} analyzed
                        </p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="font-bold text-primary">
                            {savings > 0 ? formatCurrency(savings) : "$0"}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            /mo savings
                          </p>
                        </div>
                        <Link
                          href={`/audit/${audit.id}`}
                          className="text-sm text-primary hover:underline font-mono whitespace-nowrap"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="text-xl font-bold text-on-surface mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/audit"
                className="w-full bg-primary-container text-on-primary-container font-bold px-4 py-3 rounded hover:brightness-110 transition-all flex items-center justify-center"
              >
                Run New Audit
              </Link>
              <Link
                href="/resources"
                className="w-full bg-surface border border-outline-variant text-on-surface-variant font-bold px-4 py-3 rounded hover:text-on-surface hover:border-outline transition-all flex items-center justify-center"
              >
                View Resources
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
