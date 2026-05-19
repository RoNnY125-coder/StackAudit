/**
 * @file hooks/useAuditForm.ts
 * @description React hook that owns all form state for the audit flow.
 *
 * State managed:
 *   - teamSize    — number of people on the team
 *   - useCase     — primary use case (e.g. "Software Engineering")
 *   - tools       — map of toolId → ToolEntry for all active tools
 *   - isLoading   — true while the /api/analyze request is in flight
 *   - error       — last API error message, or null
 *
 * Side effects:
 *   - Reads initial state from localStorage on mount (persists between page loads)
 *   - Writes state back to localStorage whenever teamSize / useCase / tools change
 *
 * Returns everything SpendForm needs, plus `completionPercent` which
 * AuditShell passes to SideNav so the progress bar is always accurate.
 */

import { useState, useMemo, useEffect } from "react"
import { ToolEntry } from "@/lib/types"
import { createLogger } from "@/lib/logger"

const log = createLogger("useAuditForm")

/** Shape persisted to / restored from localStorage under "stackaudit_form". */
interface PersistedForm {
  teamSize: number
  useCase: string
  tools: Record<string, ToolEntry>
}

function loadPersistedForm(): PersistedForm | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("stackaudit_form")
    if (!raw) return null
    const saved: PersistedForm = JSON.parse(raw)
    log.info("Restored saved form from localStorage", {
      teamSize: saved.teamSize,
      useCase:  saved.useCase,
      toolCount: Object.keys(saved.tools ?? {}).length,
    })
    return saved
  } catch (err) {
    log.warn("Failed to parse saved form from localStorage — clearing", err)
    localStorage.removeItem("stackaudit_form")
    return null
  }
}

export function useAuditForm() {
  const [saved] = useState(loadPersistedForm)
  const [teamSize, setTeamSize] = useState<number>(saved?.teamSize ?? 1)
  const [useCase,  setUseCase]  = useState<string>(saved?.useCase ?? "Software Engineering")
  const [tools,    setTools]    = useState<Record<string, ToolEntry>>(saved?.tools ?? {})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error,     setError]     = useState<string | null>(null)

  // ── Persist form state whenever it changes ─────────────────────────────────
  useEffect(() => {
    try {
      const payload: PersistedForm = { teamSize, useCase, tools }
      localStorage.setItem("stackaudit_form", JSON.stringify(payload))
    } catch (err) {
      log.warn("Failed to persist form to localStorage", err)
    }
  }, [teamSize, useCase, tools])

  // ── Completion percentage shown in SideNav progress bar ───────────────────
  const completionPercent = useMemo(() => {
    let score = 0
    if (teamSize > 0) score += 20
    if (useCase)      score += 20
    const toolCount = Object.keys(tools).length
    if (toolCount > 0) score += 30
    if (toolCount > 2) score += 30
    return Math.min(100, score)
  }, [teamSize, useCase, tools])

  // ── Tool management ────────────────────────────────────────────────────────

  /** Add a new tool entry or update an existing one (keyed by entry.id). */
  const addOrUpdateTool = (entry: ToolEntry) => {
    log.info(`Tool updated: ${entry.name}`, { plan: entry.plan, seats: entry.seats, monthlySpend: entry.monthlySpend })
    setTools(prev => ({ ...prev, [entry.id]: entry }))
  }

  /** Remove a tool from the active list by its ID. */
  const removeTool = (id: string) => {
    log.info(`Tool removed: ${id}`)
    setTools(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  // ── Form submission ────────────────────────────────────────────────────────

  /**
   * POST the current form to /api/analyze.
   * Stores the result in sessionStorage and returns true on success.
   * On failure, sets the `error` state and returns false.
   */
  const submit = async (): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    log.info("Submitting audit", { teamSize, useCase, toolCount: Object.keys(tools).length })

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools:    Object.values(tools),
          teamSize,
          useCase,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "Unknown error")
        throw new Error(`/api/analyze responded ${res.status}: ${text}`)
      }

      const result = await res.json()
      sessionStorage.setItem("stackaudit_result", JSON.stringify(result))
      log.info("Audit complete", { totalMonthlySavings: result.totalMonthlySavings })
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      log.error("Audit submission failed", err)
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    teamSize,
    setTeamSize,
    useCase,
    setUseCase,
    tools,
    addOrUpdateTool,
    removeTool,
    completionPercent,
    submit,
    isLoading,
    error,
  }
}
