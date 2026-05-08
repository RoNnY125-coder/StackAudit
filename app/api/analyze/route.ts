import { NextResponse } from "next/server"
import { MOCK_AUDIT_RESULT } from "@/lib/mock-data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tools, teamSize, useCase } = body

    // Simulate 1.5s delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, we would process the tools against pricing data here.
    // For this prompt, we return the deterministic MOCK_AUDIT_RESULT.

    return NextResponse.json(MOCK_AUDIT_RESULT)
  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 })
  }
}
