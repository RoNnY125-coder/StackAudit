"use client"

import { useRouter } from "next/navigation"
import { useAuditForm } from "@/hooks/useAuditForm"
import { TOOL_CATALOG } from "@/lib/mock-data"
import TeamContextSection from "./TeamContextSection"
import ToolRow from "./ToolRow"
import { Loader2 } from "lucide-react"

export default function SpendForm() {
  const router = useRouter()
  const { 
    teamSize, setTeamSize, 
    useCase, setUseCase, 
    tools, addOrUpdateTool, removeTool, 
    completionPercent, submit, isLoading, error 
  } = useAuditForm()

  const handleRunAudit = async () => {
    const success = await submit()
    if (success) {
      router.push("/audit/results")
    }
  }

  const estMonthlySpend = Object.values(tools).reduce((acc, t) => acc + t.monthlySpend, 0)
  const toolCount = Object.keys(tools).length

  // Group tools by category
  const devTools = TOOL_CATALOG.filter(t => t.category === "dev-tools")
  const llmApis = TOOL_CATALOG.filter(t => t.category === "llm-apis")
  const infraTools = TOOL_CATALOG.filter(t => t.category === "infrastructure")
  const prodTools = TOOL_CATALOG.filter(t => t.category === "productivity")

  const renderToolSection = (title: string, categoryTools: typeof TOOL_CATALOG) => (
    <div className="mb-8">
      <h2 className="text-h2 font-bold border-b border-outline-variant pb-2 tracking-tighter mb-4">{title}</h2>
      <div className="space-y-1">
        {categoryTools.map(tool => (
          <ToolRow 
            key={tool.id} 
            tool={tool} 
            entry={tools[tool.id]} 
            onChange={addOrUpdateTool} 
            onRemove={removeTool} 
          />
        ))}
      </div>
      <button className="w-full mt-3 border border-dashed border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface rounded p-3 flex items-center justify-center gap-2 transition-colors">
        <span className="font-bold">+ Add Tool</span>
      </button>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
      <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
        <h1 className="text-4xl font-bold tracking-tighter text-on-surface">Your Audit</h1>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono text-on-surface-variant">
            <span>Progress</span>
            <span>{completionPercent}%</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${completionPercent}%` }} 
            />
          </div>
        </div>

        <div className="bg-surface border border-outline-variant rounded p-4">
          <p className="text-on-surface-variant text-sm">
            <strong className="text-on-surface">{toolCount}</strong> tools added · Est. monthly spend: <strong className="text-on-surface">${estMonthlySpend}</strong>
          </p>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button 
          onClick={handleRunAudit}
          disabled={isLoading || toolCount === 0}
          className="w-full bg-primary-container text-on-primary-container font-bold px-4 py-3 rounded hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
          ) : (
            <>Run Audit →</>
          )}
        </button>
      </div>

      <div className="lg:col-span-8">
        <TeamContextSection 
          teamSize={teamSize} setTeamSize={setTeamSize}
          useCase={useCase} setUseCase={setUseCase}
        />
        
        {renderToolSection("Developer Tools", devTools)}
        {renderToolSection("AI/LLM APIs", llmApis)}
        {renderToolSection("Infrastructure", infraTools)}
        {renderToolSection("Productivity", prodTools)}
      </div>
    </div>
  )
}
