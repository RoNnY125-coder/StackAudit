import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { email, company, role, website } = await request.json()

    // Honeypot check — bots fill hidden fields
    if (website) {
      return NextResponse.json({ success: true })
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("leads")
      .insert({ email, company_name: company, role })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}