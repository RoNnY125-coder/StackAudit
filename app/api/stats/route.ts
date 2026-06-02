import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const revalidate = 60 // revalidate every 60 seconds

export async function GET() {
  try {
    // Total audit count
    const { count, error: countError } = await supabaseAdmin
      .from("audits")
      .select("*", { count: "exact", head: true })

    if (countError) throw countError

    // Average monthly savings — computed from all rows
    const { data: savingsData, error: savingsError } = await supabaseAdmin
      .from("audits")
      .select("total_monthly_savings, recommendations_json:savings_json")
      .order("created_at", { ascending: false })
      .limit(500)

    if (savingsError) throw savingsError

    // For each audit, recompute totalMonthlySavings from savings_json rows
    // so the average reflects the fixed engine, not stale stored totals
    const correctedSavings = (savingsData ?? []).map((row) => {
      const recs = Array.isArray(row.recommendations_json)
        ? row.recommendations_json
        : []
      const computed = recs.reduce(
        (sum: number, r: { monthlySavings?: number }) =>
          sum + (r.monthlySavings ?? 0),
        0
      )
      // Use computed if it differs significantly from stored (old engine rows)
      return computed > 0 ? computed : (row.total_monthly_savings ?? 0)
    })

    const avgSavings =
      correctedSavings.length > 0
        ? Math.round(
            correctedSavings.reduce((a, b) => a + b, 0) /
              correctedSavings.length
          )
        : 0

    // Most recent audit timestamp
    const { data: latestRow, error: latestError } = await supabaseAdmin
      .from("audits")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (latestError && latestError.code !== "PGRST116") throw latestError

    return NextResponse.json({
      totalAudits: count ?? 0,
      avgMonthlySavings: avgSavings,
      lastAuditAt: latestRow?.created_at ?? null,
    })
  } catch (err) {
    console.error("[stats]", err)
    return NextResponse.json(
      { totalAudits: 0, avgMonthlySavings: 0, lastAuditAt: null },
      { status: 500 }
    )
  }
}
