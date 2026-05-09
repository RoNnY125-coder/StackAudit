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

    let shareSlug = Math.random().toString(36).slice(2, 8)
    
    try {
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

      if (!error && data) {
        shareSlug = data.id
      }
    } catch (dbError) {
      console.error("Supabase error:", dbError)
    }

    let aiAnalysis = ""
    try {
      const geminiPrompt = `You are an AI spend analyst. Based on this audit data, write a 100-word personalized summary for a startup founder. Team size: ${teamSize}. Use case: ${useCase}. Total monthly savings found: $${auditResult.totalMonthlySavings}. Top recommendations: ${auditResult.recommendations.slice(0,3).map(r => r.tool + ': ' + r.recommendedAction).join(', ')}. Be specific, encouraging, and actionable. Do not use bullet points.`
      
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }]
        })
      })
      if (!geminiRes.ok) throw new Error("Gemini API failed")
      const geminiData = await geminiRes.json()
      aiAnalysis = geminiData.candidates[0].content.parts[0].text
    } catch (aiError) {
      console.error("Gemini error:", aiError)
      aiAnalysis = generateFallbackSummary(auditResult.totalMonthlySavings, teamSize, useCase)
    }

    return NextResponse.json({
      ...auditResult,
      shareSlug,
      generatedAt: new Date().toISOString(),
      aiAnalysis,
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