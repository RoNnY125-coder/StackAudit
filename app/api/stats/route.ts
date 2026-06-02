import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Cache for 60 seconds so the homepage doesn't hammer Supabase on every visit
export const revalidate = 60

export async function GET() {
  try {
    // 1. Total audit count
    const { count, error: countError } = await supabaseAdmin
      .from("audits")
      .select("*", { count: "exact", head: true })

    if (countError) throw countError

    if (count === 0) {
      return NextResponse.json({
        totalAudits: 0,
        avgMonthlySavings: 0,
        lastAuditAt: null,
      })
    }

    // 2. Average monthly savings
    const { data: rows, error: rowsError } = await supabaseAdmin
      .from("audits")
      .select("savings_json, total_monthly_savings")
      .order("created_at", { ascending: false })
      .limit(500)

    if (rowsError) throw rowsError

    const savingsPerAudit = (rows ?? []).map((row) => {
      const recs = Array.isArray(row.savings_json) ? row.savings_json : []
      const computed: number = recs.reduce(
        (sum: number, r: any) =>
          sum + (typeof r?.monthlySavings === 'number' ? r.monthlySavings : 0),
        0
      )
      // If computed > 0 use it (fixed engine), otherwise fall back to stored value
      return computed > 0 ? computed : (row.total_monthly_savings ?? 0)
    })

    const avgMonthlySavings =
      savingsPerAudit.length > 0
        ? Math.round(
            savingsPerAudit.reduce((a, b) => a + b, 0) / savingsPerAudit.length
          )
        : 0

    // 3. Most recent audit timestamp
    const { data: latest, error: latestError } = await supabaseAdmin
      .from("audits")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // PGRST116 = no rows found — we already handled count === 0, but just in case
    if (latestError && latestError.code !== "PGRST116") throw latestError

    return NextResponse.json({
      totalAudits: count ?? 0,
      avgMonthlySavings,
      lastAuditAt: latest?.created_at ?? null,
    })
  } catch (err) {
    console.error("[/api/stats]", err)
    // Return zeros rather than a 500 so the UI degrades gracefully
    return NextResponse.json({
      totalAudits: 0,
      avgMonthlySavings: 0,
      lastAuditAt: null,
    })
  }
}
