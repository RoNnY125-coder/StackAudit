"use client"

import Link from "next/link"

interface SideNavProps {
  progress: number
}

export default function SideNav({ progress }: SideNavProps) {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] border-r border-outline-variant bg-surface-container hidden md:flex flex-col">
      <div className="p-4 border-b border-outline-variant">
        <h2 className="font-mono font-bold text-h2 mb-1">Audit Progress</h2>
        <p className="text-label text-on-surface-variant mb-2">{progress}% Complete</p>
        <div className="h-1.5 w-full bg-surface-container-highest rounded overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          <li>
            <Link href="/dashboard" className="flex px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
              Overview
            </Link>
          </li>
          <li>
            <Link href="/audit?section=infrastructure" className="flex px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
              Infrastructure
            </Link>
          </li>
          <li>
            <Link href="/audit?section=saas" className="flex px-4 py-2 text-sm bg-secondary-container text-on-secondary-container font-bold border-l-4 border-primary transition-colors">
              SaaS Spend
            </Link>
          </li>
          <li>
            <Link href="/dashboard#security" className="flex px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
              Security
            </Link>
          </li>
          <li>
            <Link href="/audit/results" className="flex px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
              Optimization
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
