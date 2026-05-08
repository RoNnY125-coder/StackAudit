"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export default function ShareBar({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false)

  const url = `${typeof window !== "undefined" ? window.location.origin : "https://stack-audit-ashy.vercel.app"}/audit/${slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareX = () => {
    const text = `Just audited my AI tool spend with StackAudit — found potential savings. Check it out:`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank")
  }

  return (
    <div className="bg-surface border border-outline-variant/50 rounded-xl p-2 flex items-center justify-between my-8">
      <div className="px-2 font-mono text-xs text-on-surface-variant truncate">
        {url}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleCopy}
          className="border border-outline-variant text-on-surface hover:bg-surface-container rounded px-4 py-2 text-sm transition-colors flex items-center gap-2"
        >
          {copied ? <><Check className="w-4 h-4 text-primary" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy link</>}
        </button>
        <button
          onClick={handleShareX}
          className="border border-outline-variant text-on-surface hover:bg-surface-container rounded px-4 py-2 text-sm transition-colors"
        >
          Share on X
        </button>
      </div>
    </div>
  )
}