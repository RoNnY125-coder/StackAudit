import { useState, useMemo, useEffect } from "react"
import { ToolEntry } from "@/lib/types"

export function useAuditForm() {
  const [teamSize, setTeamSize] = useState<number>(1)
  const [useCase, setUseCase] = useState<string>("Software Engineering")
  const [tools, setTools] = useState<Record<string, ToolEntry>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("stackaudit_form")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.teamSize) setTeamSize(parsed.teamSize)
        if (parsed.useCase) setUseCase(parsed.useCase)
        if (parsed.tools) setTools(parsed.tools)
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("stackaudit_form", JSON.stringify({ teamSize, useCase, tools }))
  }, [teamSize, useCase, tools])

  const completionPercent = useMemo(() => {
    let score = 0
    if (teamSize > 0) score += 20
    if (useCase) score += 20
    const toolCount = Object.keys(tools).length
    if (toolCount > 0) score += 30
    if (toolCount > 2) score += 30
    return Math.min(100, score)
  }, [teamSize, useCase, tools])

  const addOrUpdateTool = (entry: ToolEntry) => {
    setTools((prev) => ({ ...prev, [entry.id]: entry }))
  }

  const removeTool = (id: string) => {
    setTools((prev) => {
      const newTools = { ...prev }
      delete newTools[id]
      return newTools
    })
  }

  const submit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools: Object.values(tools),
          teamSize,
          useCase,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to analyze audit")
      }

      const result = await res.json()
      sessionStorage.setItem("stackaudit_result", JSON.stringify(result))
      return true
    } catch (err: any) {
      setError(err.message || "An error occurred")
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
