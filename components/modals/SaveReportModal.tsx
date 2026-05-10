"use client"

import { useState, useEffect, useRef } from "react"
import { X, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SaveReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SaveReportModal({ isOpen, onClose }: SaveReportModalProps) {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const stored = sessionStorage.getItem("stackaudit_result")
      const auditData = stored ? JSON.parse(stored) : null
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, role, auditData }),
      })
      if (!res.ok) throw new Error("Failed")
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 2000)
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/90 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="max-w-[400px] w-full bg-surface border border-outline-variant rounded-xl p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            <div className="mb-6">
              <h2 id="modal-title" className="text-xl font-bold text-on-surface mb-1">
                Save your audit
              </h2>
              <p className="text-on-surface-variant text-sm">
                We'll send the full report to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot — hidden from real users, filled by bots */}
              <input
                type="text"
                name="website"
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                readOnly
              />

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-mono text-on-surface-variant uppercase">
                  Email
                </Label>
                <Input
                  id="email"
                  ref={inputRef}
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface border-outline-variant focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="company" className="text-xs font-mono text-on-surface-variant uppercase">
                  Company
                </Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-surface border-outline-variant focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="role" className="text-xs font-mono text-on-surface-variant uppercase">
                  Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  placeholder="CTO / VP Engineering"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-surface border-outline-variant focus-visible:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-container text-on-primary-container font-semibold py-[10px] rounded hover:brightness-110 active:scale-[0.98] transition-all mt-6 disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Report"}
              </button>
            </form>

            <p className="font-mono text-label text-on-surface-variant text-center border-t border-outline-variant/30 pt-4 mt-6">
              Credex may reach out for high-savings audits. Unsubscribe anytime.
            </p>
          </>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-bold text-on-surface mb-2">Report sent!</h2>
            <p className="text-on-surface-variant">Check your inbox shortly.</p>
          </div>
        )}
      </div>
    </div>
  )
}