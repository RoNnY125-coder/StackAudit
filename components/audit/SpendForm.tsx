"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuditForm } from "@/hooks/useAuditForm"
import { TOOL_CATALOG } from "@/lib/mock-data"
import { ToolCatalogEntry } from "@/lib/types"
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

  const [loadingText, setLoadingText] = useState("Analyzing your stack...")

  useEffect(() => {
    if (!isLoading) {
      setLoadingText("Analyzing your stack...")
      return
    }
    
    const timer1 = setTimeout(() => setLoadingText("Calculating savings..."), 1000)
    const timer2 = setTimeout(() => setLoadingText("Generating recommendations..."), 2000)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [isLoading])

  const [customTools, setCustomTools] = useState<ToolCatalogEntry[]>([])
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null)
  const [newToolName, setNewToolName] = useState("")
  const [newToolCost, setNewToolCost] = useState("")
  const [newToolSeats, setNewToolSeats] = useState("1")

  const handleAddCustomTool = (category: string) => {
    if (!newToolName) return
    const id = newToolName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const defaultPrice = parseFloat(newToolCost) || 0
    const seats = parseInt(newToolSeats) || 1
    
    const newTool: ToolCatalogEntry = {
      id,
      name: newToolName,
      category: category as any,
      defaultPrice,
      plans: ["Custom"]
    }
    
    setCustomTools(prev => [...prev, newTool])
    
    addOrUpdateTool({
      id,
      name: newToolName,
      category: category as any,
      plan: "Custom",
      seats,
      monthlySpend: defaultPrice * (category === "infrastructure" || category === "llm-apis" ? 1 : seats),
      usageScore: 100
    })
    
    setAddingToCategory(null)
    setNewToolName("")
    setNewToolCost("")
    setNewToolSeats("1")
  }

  const estMonthlySpend = Object.values(tools).reduce((acc, t) => acc + t.monthlySpend, 0)
  const toolCount = Object.keys(tools).length

  // Group tools by category
  const allTools = [...TOOL_CATALOG, ...customTools]
  const devTools = allTools.filter(t => t.category === "dev-tools")
  const llmApis = allTools.filter(t => t.category === "llm-apis")
  const infraTools = allTools.filter(t => t.category === "infrastructure")
  const prodTools = allTools.filter(t => t.category === "productivity")

  const renderToolSection = (title: string, category: string, categoryTools: typeof TOOL_CATALOG) => (
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
      {addingToCategory === category ? (
        <div className="mt-3 p-4 border border-outline-variant rounded bg-surface-container flex flex-col gap-3">
          <input type="text" placeholder="Tool Name" value={newToolName} onChange={e => setNewToolName(e.target.value)} className="bg-surface border border-outline-variant rounded p-2 text-on-surface" />
          <div className="flex gap-3">
            <input type="number" placeholder="Monthly Cost" value={newToolCost} onChange={e => setNewToolCost(e.target.value)} className="bg-surface border border-outline-variant rounded p-2 text-on-surface flex-1" />
            <input type="number" placeholder="Seats" value={newToolSeats} onChange={e => setNewToolSeats(e.target.value)} className="bg-surface border border-outline-variant rounded p-2 text-on-surface flex-1" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setAddingToCategory(null)} className="px-3 py-1 text-on-surface-variant hover:text-on-surface">Cancel</button>
            <button onClick={() => handleAddCustomTool(category)} className="px-3 py-1 bg-primary text-on-primary rounded font-bold">Add</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAddingToCategory(category)} className="w-full mt-3 border border-dashed border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface rounded p-3 flex items-center justify-center gap-2 transition-colors">
          <span className="font-bold">+ Add Tool</span>
        </button>
      )}
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
            <><Loader2 className="w-5 h-5 animate-spin" /> {loadingText}</>
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
        
        {renderToolSection("Developer Tools", "dev-tools", devTools)}
        {renderToolSection("AI/LLM APIs", "llm-apis", llmApis)}
        {renderToolSection("Infrastructure", "infrastructure", infraTools)}
        {renderToolSection("Productivity", "productivity", prodTools)}
      </div>
    </div>
  )
}
