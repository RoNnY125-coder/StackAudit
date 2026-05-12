"use client"

import TopBar from "@/components/layout/TopBar"
import SideNav from "@/components/layout/SideNav"
import SpendForm from "@/components/audit/SpendForm"
import { useAuditForm } from "@/hooks/useAuditForm"

/**
 * @file components/audit/AuditShell.tsx
 * @description Client-side wrapper for the audit flow.
 * 
 * Owns the useAuditForm hook so that the SideNav progress bar 
 * and the SpendForm itself stay in sync.
 */
export default function AuditShell() {
  const formProps = useAuditForm()

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-1 pt-16">
        <SideNav progress={formProps.completionPercent} />
        <main className="flex-1 md:ml-64 p-4 lg:p-8" id="main-content">
          <div className="max-w-5xl mx-auto">
            <SpendForm formProps={formProps} />
          </div>
        </main>
      </div>
    </div>
  )
}
