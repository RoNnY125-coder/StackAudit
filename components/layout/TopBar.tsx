"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Settings, Menu } from "lucide-react"
import { useAuditForm } from "@/hooks/useAuditForm"

export default function TopBar() {
  const pathname = usePathname()
  const isAudit = pathname?.startsWith("/audit")

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-outline-variant z-50 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-mono font-bold text-primary text-lg tracking-tight">
          StackAudit
        </Link>
      </div>

      {!isAudit && (
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {["Dashboard", "Audits", "Resources"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-on-surface-variant hover:bg-surface-container px-3 py-1.5 rounded text-sm transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>
      )}

      {isAudit && (
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
          <span className="text-sm text-on-surface-variant font-mono">Running Audit...</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button aria-label="Notifications" className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded hover:bg-surface-container">
          <Bell className="w-5 h-5" />
        </button>
        <button aria-label="Settings" className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded hover:bg-surface-container hidden md:block">
          <Settings className="w-5 h-5" />
        </button>
        <Link
          href="/audit"
          className="hidden md:flex bg-primary-container text-on-primary-container font-bold px-4 py-2 rounded text-sm hover:brightness-110 transition-all active:scale-[0.98]"
        >
          Connect Stack
        </Link>
        <button aria-label="Menu" className="md:hidden text-on-surface-variant hover:text-on-surface p-2">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
