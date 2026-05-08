"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TeamContextSectionProps {
  teamSize: number
  setTeamSize: (size: number) => void
  useCase: string
  setUseCase: (useCase: string) => void
}

export default function TeamContextSection({
  teamSize,
  setTeamSize,
  useCase,
  setUseCase,
}: TeamContextSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-h2 font-bold border-b border-outline-variant pb-2 tracking-tighter mb-4">
        Team Context
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="teamSize" className="text-on-surface-variant font-mono text-xs uppercase tracking-wider">
            Team Size
          </Label>
          <Input
            id="teamSize"
            type="number"
            min={1}
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value) || 0)}
            className="bg-surface-container-lowest border border-outline-variant rounded focus-visible:ring-primary focus-visible:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="useCase" className="text-on-surface-variant font-mono text-xs uppercase tracking-wider">
            Primary Use Case
          </Label>
          <Select value={useCase} onValueChange={(val) => { if (val) setUseCase(val) }}>
            <SelectTrigger id="useCase" className="bg-surface-container-lowest border border-outline-variant rounded focus:ring-primary focus:border-primary">
              <SelectValue placeholder="Select Use Case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Software Engineering">Software Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  )
}
