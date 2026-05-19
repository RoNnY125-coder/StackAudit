"use client"
import Link from "next/link"
import { useState } from "react"
import { createLogger } from "@/lib/logger"

const log = createLogger("CTABlock")

export default function CTABlock({ savings }: { savings: number }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "notify" }),
      })
      setSubmitted(true)
    } catch (err) {
      log.error("Failed to submit lead", err)
    }
  }

  if (savings >= 300) {
    return (
      <div className="bg-surface border border-outline-variant rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 my-8">
        <div>
          <h3 className="font-bold text-on-surface mb-1">You&apos;re leaving ${savings}/month on the table.</h3>
          <p className="text-on-surface-variant text-sm">
            Book a free 20-minute call. We&apos;ll walk through your stack and show you exactly how to implement these savings.
          </p>
        </div>
        <Link 
          href="https://cal.com/stackaudit/savings-call" 
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-primary text-on-primary hover:bg-primary-fixed-dim px-6 py-2 rounded text-label font-bold transition-colors whitespace-nowrap text-center w-full sm:w-auto"
        >
          Book Free Call →
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 my-8">
      <div>
        <h3 className="font-bold text-on-surface mb-1">Your stack looks lean.</h3>
        <p className="text-on-surface-variant text-sm">
          Get notified when better pricing becomes available for your tools.
        </p>
      </div>
      {submitted ? (
        <div className="shrink-0 text-primary font-bold text-sm px-6 py-2">Thanks! We&apos;ll keep you posted.</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full sm:w-auto shrink-0">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-surface-container border border-outline-variant rounded-l px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary w-full sm:w-48"
          />
          <button 
            type="submit"
            className="bg-primary text-on-primary hover:bg-primary-fixed-dim px-4 py-2 rounded-r text-label font-bold transition-colors whitespace-nowrap"
          >
            Notify Me
          </button>
        </form>
      )}
    </div>
  )
}
