import { NextResponse } from "next/server"
import { runAudit } from "@/lib/auditEngine"
import { supabaseAdmin } from "@/lib/supabase"
import { FormState } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tools, teamSize, useCase } = body

    const form: FormState = { tools, teamSize, useCase }
    const auditResult = runAudit(form)

    // Save to Supabase
    const { data, error } = await supabaseAdmin
      .from("audits")
      .insert({
        tools_json: tools,
        savings_json: auditResult.recommendations,
        total_monthly_savings: auditResult.totalMonthlySavings,
      })
      .select("id")
      .single()

    if (error) {
      console.error("Supabase error:", error)
      // Still return result even if save fails
      return NextResponse.json({ ...auditResult, shareSlug: "error", generatedAt: new Date().toISOString() })
    }

    return NextResponse.json({
      ...auditResult,
      shareSlug: data.id,
      generatedAt: new Date().toISOString(),
      aiAnalysis: generateFallbackSummary(auditResult.totalMonthlySavings, teamSize, useCase),
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 })
  }
}

function generateFallbackSummary(monthlySavings: number, teamSize: number, useCase: string): string {
  if (monthlySavings === 0) {
    return `Your team of ${teamSize} is spending efficiently on AI tools for ${useCase}. Your current stack is well-optimized — no immediate changes recommended. We'll notify you when better options become available for your use case.`
  }
  return `Your team of ${teamSize} focused on ${useCase} could save $${monthlySavings}/month ($${monthlySavings * 12}/year) by optimizing your AI tool subscriptions. The biggest opportunities are in plan right-sizing — you're paying for features your team size doesn't need. Acting on these recommendations takes less than 30 minutes and requires no workflow changes.`
}