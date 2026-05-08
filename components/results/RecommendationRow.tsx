import { ArrowRight } from "lucide-react"
import { Recommendation } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

export default function RecommendationRow({ rec }: { rec: Recommendation }) {
  const getPriorityColor = () => {
    switch (rec.priority) {
      case "high": return "bg-primary"
      case "medium": return "bg-tertiary"
      case "low": return "bg-tertiary"
      default: return "bg-outline"
    }
  }

  return (
    <div className="border-b border-outline-variant/30 py-6 relative hover:bg-surface-container-lowest transition-colors pl-4">
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full ${getPriorityColor()}`} />
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-on-surface-variant font-medium">{rec.tool}</span>
          <ArrowRight className="w-4 h-4 text-on-surface-variant" />
          <span className="font-bold text-on-surface">{rec.action}</span>
        </div>
        <span className="font-mono text-primary font-bold shrink-0 ml-4">
          +{formatCurrency(rec.monthlySavings)}/mo
        </span>
      </div>
      
      <p className="text-[12px] italic text-on-surface-variant leading-relaxed">
        {rec.reasoning}
      </p>
    </div>
  )
}
