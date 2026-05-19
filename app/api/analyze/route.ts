import { NextResponse } from "next/server"
import { runAudit } from "@/lib/auditEngine"
import { supabaseAdmin } from "@/lib/supabase"
import { FormState } from "@/lib/types"
import { generateFallbackSummary } from "@/lib/ai-summary"
import { z } from "zod"
import { randomBytes } from "crypto"
import { createLogger } from "@/lib/logger"

const AnalyzeSchema = z.object({
  tools: z.array(z.record(z.string(), z.unknown())),
  teamSize: z.number().int().min(1),
  useCase: z.string().min(1),
})

const log = createLogger("analyzeRoute")

export async function POST(request: Request) {
  try {
    const jsonBody = await request.json()
    const parsed = AnalyzeSchema.safeParse(jsonBody)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request format", details: parsed.error }, { status: 400 })
    }

    const { tools, teamSize, useCase } = parsed.data

    const form: FormState = { tools: tools as any, teamSize, useCase }
    const auditResult = runAudit(form)

    let shareSlug = randomBytes(4).toString("hex") // 8 hex chars, crypto-safe
    
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
      log.error("Supabase error", dbError)
    }

    let aiAnalysis = ""
    try {
      const GEMINI_KEY = process.env.GEMINI_API_KEY
      if (!GEMINI_KEY) {
        throw new Error("GEMINI_API_KEY missing")
      }
      
      const geminiPrompt = `You are an AI spend analyst. Based on this audit data, write a 100-word personalized summary for a startup founder. Team size: ${teamSize}. Use case: ${useCase}. Total monthly savings found: $${auditResult.totalMonthlySavings}. Top recommendations: ${auditResult.recommendations.slice(0,3).map(r => r.tool + ': ' + r.recommendedAction).join(', ')}. Be specific, encouraging, and actionable. Do not use bullet points.`
      
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_KEY}`, {
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
      log.error("Gemini error", aiError)
      aiAnalysis = generateFallbackSummary(auditResult.totalMonthlySavings, teamSize, useCase)
    }

    return NextResponse.json({
      ...auditResult,
      shareSlug,
      generatedAt: new Date().toISOString(),
      aiAnalysis,
    })
  } catch (error) {
    log.error("API Error", error)
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 })
  }
}