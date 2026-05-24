"use client"

import { useState } from "react"
import { ToolCatalogEntry, ToolEntry } from "@/lib/types"
import { ChevronDown, ChevronUp, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ToolRowProps {
  tool: ToolCatalogEntry
  entry?: ToolEntry
  onChange: (entry: ToolEntry) => void
  onRemove: (id: string) => void
}

const PLAN_PRICES: Record<string, Record<string, number>> = {
  "cursor": { "Hobby": 0, "Pro": 20, "Business": 40 },
  "github-copilot": { "Individual": 10, "Pro": 10, "Business": 19, "Enterprise": 39 },
  "windsurf": { "Free": 0, "Pro": 15, "Teams": 35 },
  "notion": { "Free": 0, "Plus": 16, "Business": 18, "Enterprise": 35 },
  "linear": { "Free": 0, "Standard": 8, "Plus": 16 },
  "pagerduty": { "Free": 0, "Professional": 21, "Business": 41 },
  "chatgpt": { "Free": 0, "Plus": 20, "Team": 30, "Enterprise": 60 },
  "anthropic": { "API": 0, "Claude.ai Pro": 20, "Team": 25 },
}

export default function ToolRow({ tool, entry, onChange, onRemove }: ToolRowProps) {
  const [isExpanded, setIsExpanded] = useState(!!entry)

  const isChecked = !!entry

  const toggleChecked = () => {
    if (isChecked) {
      onRemove(tool.id)
      setIsExpanded(false)
    } else {
      onChange({
        id: tool.id,
        name: tool.name,
        category: tool.category,
        monthlySpend: tool.defaultPrice,
        seats: 1,
        plan: tool.plans[0],
        usageScore: 5
      })
      setIsExpanded(true)
    }
  }

  const updateField = (field: keyof ToolEntry, value: string | number) => {
    if (!entry) return

    const updated = { ...entry, [field]: value }

    const isPerSeatTool = ["dev-tools", "productivity"].includes(tool.category)
    if (isPerSeatTool) {
      const planPrices = PLAN_PRICES[tool.id]
      if (planPrices) {
        const activePlan = field === "plan" ? (value as string) : entry.plan
        const activeSeats = field === "seats"
          ? (typeof value === "number" ? value : parseInt(value as string) || 1)
          : entry.seats
        const pricePerSeat = planPrices[activePlan] ?? tool.defaultPrice
        updated.monthlySpend = pricePerSeat * activeSeats
      } else if (field === "seats" && typeof value === "number") {
        updated.monthlySpend = value * tool.defaultPrice
      }
    }

    onChange(updated)
  }

  return (
    <div 
      className="bg-surface-container-low border border-outline-variant rounded mb-2 overflow-hidden"
      data-testid={`tool-row-${tool.id}`}
    >
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-surface-container transition-colors"
        onClick={() => {
          if (isChecked) setIsExpanded(!isExpanded)
          else toggleChecked()
        }}
        data-testid={`tool-row-header-${tool.id}`}
      >
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={toggleChecked} 
            onClick={(e) => e.stopPropagation()}
            className="border-outline-variant data-[state=checked]:bg-primary data-[state=checked]:text-on-primary"
            data-testid={`tool-checkbox-${tool.id}`}
          />
          <span className="font-bold text-on-surface">{tool.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-on-surface-variant text-sm">
            {isChecked ? `$${entry?.monthlySpend}/mo` : '—'}
          </span>
          <button 
            className="text-on-surface-variant hover:text-on-surface flex items-center gap-1 text-sm"
            onClick={(e) => {
              e.stopPropagation()
              if (isChecked) setIsExpanded(!isExpanded)
              else toggleChecked()
            }}
            data-testid={`tool-expand-${tool.id}`}
          >
            {isChecked ? (isExpanded ? <><ChevronUp className="w-4 h-4" /> collapse</> : <><ChevronDown className="w-4 h-4" /> expand</>) : <><Plus className="w-4 h-4" /> add</>}
          </button>
        </div>
      </div>

      {isExpanded && isChecked && entry && (
        <div className="p-4 border-t border-outline-variant/50 bg-surface-container-lowest space-y-4">
          {(tool.category === "llm-apis" || tool.category === "infrastructure") && (
            <div className="space-y-1">
              <label className="text-xs text-on-surface-variant font-mono uppercase">
                Monthly Spend ($) — enter your actual bill
              </label>
              <Input
                type="number"
                min={0}
                step={1}
                value={entry.monthlySpend}
                onChange={(e) =>
                  onChange({ ...entry, monthlySpend: parseFloat(e.target.value) || 0 })
                }
                className="h-8 bg-surface border-outline-variant focus-visible:ring-primary"
                placeholder="e.g. 340"
                data-testid={`tool-spend-input-${tool.id}`}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-on-surface-variant font-mono uppercase">Seats</label>
              <Input
                type="number"
                min={1}
                value={entry.seats}
                onChange={(e) => updateField("seats", parseInt(e.target.value) || 1)}
                className="h-8 bg-surface border-outline-variant focus-visible:ring-primary"
                data-testid={`tool-seats-input-${tool.id}`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-on-surface-variant font-mono uppercase">Plan</label>
              <Select value={entry.plan} onValueChange={(val) => { if (val) updateField("plan", val) }}>
                <SelectTrigger
                  className="h-8 bg-surface border-outline-variant focus:ring-primary"
                  data-testid={`tool-plan-select-${tool.id}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tool.plans.map((plan) => (
                    <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-on-surface-variant font-mono uppercase">
                Used Daily ({entry.usageScore}/10)
              </label>
              <input
                type="range"
                min={0}
                max={10}
                value={entry.usageScore}
                onChange={(e) => updateField("usageScore", parseInt(e.target.value))}
                className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                data-testid={`tool-usage-slider-${tool.id}`}
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant">
                <span>Rarely</span>
                <span>Always</span>
              </div>
            </div>
          </div>

          {(tool.category === "dev-tools" || tool.category === "productivity") && (
            <p className="text-xs text-on-surface-variant font-mono">
              Auto-calculated: <strong className="text-on-surface">${entry.monthlySpend}/mo</strong>
              {" "}({entry.seats} seat{entry.seats !== 1 ? "s" : ""} ×{" "}
              ${entry.seats > 0 ? Math.round(entry.monthlySpend / entry.seats) : 0}/seat)
            </p>
          )}
        </div>
      )}
    </div>
  )
}
