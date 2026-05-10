import Link from "next/link"
import TopBar from "@/components/layout/TopBar"
import { supabaseAdmin } from "@/lib/supabase"

interface AuditRow {
  id: string
  created_at: string
  tools_json: unknown[]
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

export default async function DashboardPage() {
  const { data: audits } = await supabaseAdmin
    .from("audits")
    .select("id, created_at, tools_json, total_monthly_savings")
    .order("created_at", { ascending: false })
    .limit(5)

  const rows = (audits ?? []) as AuditRow[]
  const latest = rows[0] ?? null

  const totalSpend = latest
    ? (latest.tools_json as { monthlySpend?: number }[]).reduce(
        (sum, t) => sum + (t.monthlySpend ?? 0),
        0
      )
    : 0

  const toolCount = latest ? (latest.tools_json?.length ?? 0) : 0

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-6xl mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-on-surface tracking-tight">Dashboard</h1>
          <p className="text-on-surface-variant mt-2">Your AI spend overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-surface border border-outline-variant rounded p-6">
            <h3 className="text-sm text-on-surface-variant mb-1 font-mono">Total Monthly Spend</h3>
            <p className="text-3xl font-bold text-on-surface">
              {totalSpend > 0 ? formatCurrency(totalSpend) : "$0"}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-6">
            <h3 className="text-sm text-on-surface-variant mb-1 font-mono">Tools Tracked</h3>
            <p className="text-3xl font-bold text-on-surface">{toolCount}</p>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-6">
            <h3 className="text-sm text-on-surface-variant mb-1 font-mono">Potential Savings</h3>
            <p className="text-3xl font-bold text-primary">
              {latest ? formatCurrency(latest.total_monthly_savings) : "$0"}
            </p>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-6">
            <h3 className="text-sm text-on-surface-variant mb-1 font-mono">Last Audit</h3>
            <p className="text-3xl font-bold text-on-surface">
              {latest ? formatDate(latest.created_at) : "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-on-surface mb-4">Recent Audits</h2>
            <div className="bg-surface border border-outline-variant rounded divide-y divide-outline-variant">
              {rows.length === 0 ? (
                <div className="p-6 text-center text-on-surface-variant">
                  No audits yet. Run your first audit.
                </div>
              ) : (
                rows.map((audit) => (
                  <div key={audit.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-on-surface">{formatDate(audit.created_at)}</p>
                      <p className="text-sm text-on-surface-variant">
                        {audit.tools_json?.length ?? 0} tools analyzed
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {formatCurrency(audit.total_monthly_savings)}
                        </p>
                        <p className="text-xs text-on-surface-variant">Savings found</p>
                      </div>
                      <Link
                        href={`/audit/${audit.id}`}
                        className="text-sm text-on-surface hover:underline font-mono"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-on-surface mb-4">Quick Actions</h2>
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
