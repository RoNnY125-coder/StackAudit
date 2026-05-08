"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/utils"

export default function SavingsHero({ amount }: { amount: number }) {
  const [displayAmount, setDisplayAmount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1200
    const increment = amount / (duration / 16) // 60fps

    const animate = () => {
      start += increment
      if (start < amount) {
        setDisplayAmount(Math.floor(start))
        requestAnimationFrame(animate)
      } else {
        setDisplayAmount(amount)
      }
    }
    requestAnimationFrame(animate)
  }, [amount])

  return (
    <div className="text-center mt-4">
      <p className="font-mono text-label text-primary uppercase tracking-widest">
        Total Potential Savings
      </p>
      <div className="text-[72px] font-bold text-primary tracking-tight drop-shadow-[0_0_15px_rgba(79,219,200,0.3)]">
        {formatCurrency(displayAmount)}
      </div>
      <p className="text-on-surface-variant">
        per month · {formatCurrency(amount * 12)} per year
      </p>
    </div>
  )
}
