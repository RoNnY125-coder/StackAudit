"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function TopBar() {
  const pathname = usePathname()
  const isAudit = pathname?.startsWith("/audit")
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: "Audits", href: "/audit" },
    { label: "Resources", href: "/resources" },
    { label: "Settings", href: "/settings" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-outline-variant z-50 flex items-center justify-between px-4 lg:px-6 print:hidden">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-mono font-bold text-primary text-lg tracking-tight">
          StackAudit
        </Link>
      </div>

      {!isAudit && (
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                pathname === link.href
                  ? "bg-surface-container text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {link.label}
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
        <Link
          href="/audit"
          className="hidden md:flex bg-primary-container text-on-primary-container font-bold px-4 py-2 rounded text-sm hover:brightness-110 transition-all active:scale-[0.98]"
        >
          Connect Stack
        </Link>
        <button
          aria-label="Menu"
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden text-on-surface-variant hover:text-on-surface p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-surface border-b border-outline-variant md:hidden z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container transition-colors border-b border-outline-variant/30 last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
