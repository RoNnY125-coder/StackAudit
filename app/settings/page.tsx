"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import TopBar from "@/components/layout/TopBar"

function Toggle({
  id,
  checked,
  onChange,
  disabled,
}: {
  id: string
  checked: boolean
  onChange?: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-primary-container" : "bg-surface-container-highest"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-on-surface shadow-lg transform transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-surface border border-outline-variant rounded-xl p-6 mb-6">
      <h2 className="font-mono text-label text-primary uppercase tracking-wider mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-on-surface font-medium text-sm">{label}</p>
        {description && (
          <p className="text-on-surface-variant text-xs mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function loadSavedSettings(): { emailSavings: boolean; weeklyUpdates: boolean } {
  if (typeof window === "undefined") return { emailSavings: false, weeklyUpdates: false }
  try {
    const saved = localStorage.getItem("stackaudit_settings")
    if (saved) {
      const s = JSON.parse(saved)
      return {
        emailSavings: typeof s.emailSavings === "boolean" ? s.emailSavings : false,
        weeklyUpdates: typeof s.weeklyUpdates === "boolean" ? s.weeklyUpdates : false,
      }
    }
  } catch {}
  return { emailSavings: false, weeklyUpdates: false }
}

function loadSavedTheme(): boolean {
  if (typeof window === "undefined") return true // default dark on SSR
  try {
    return localStorage.getItem("stackaudit_theme") !== "light"
  } catch {
    return true
  }
}

export default function SettingsPage() {
  const [isDark, setIsDark] = useState<boolean>(loadSavedTheme)
  const [savedSettings] = useState(loadSavedSettings)
  const [emailSavings, setEmailSavings] = useState(savedSettings.emailSavings)
  const [weeklyUpdates, setWeeklyUpdates] = useState(savedSettings.weeklyUpdates)
  const [clearMsg, setClearMsg] = useState("")

  // Apply theme class to <html> whenever isDark changes
  // Writing to the DOM is the correct use of useEffect
  useEffect(() => {
    try {
      const root = document.documentElement
      if (isDark) {
        root.classList.remove("light")
        localStorage.setItem("stackaudit_theme", "dark")
      } else {
        root.classList.add("light")
        localStorage.setItem("stackaudit_theme", "light")
      }
    } catch {}
  }, [isDark])

  // Persist notification settings
  useEffect(() => {
    try {
      localStorage.setItem(
        "stackaudit_settings",
        JSON.stringify({ emailSavings, weeklyUpdates })
      )
    } catch {}
  }, [emailSavings, weeklyUpdates])

  function handleClearFormData() {
    try { localStorage.removeItem("stackaudit_form") } catch {}
    setClearMsg("Form data cleared")
    setTimeout(() => setClearMsg(""), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="max-w-[640px] mx-auto px-4 pt-24 pb-16" id="main-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">
            Settings
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            Manage your StackAudit preferences.
          </p>
        </div>

        <Section title="Appearance">
          <SettingRow
            label="Dark mode"
            description={
              isDark
                ? "Currently using dark mode"
                : "Currently using light mode"
            }
          >
            <Toggle
              id="toggle-dark-mode"
              checked={isDark}
              onChange={setIsDark}
            />
          </SettingRow>
        </Section>

        <Section title="Notifications">
          <SettingRow
            label="Savings opportunity alerts"
            description="Email me when new savings opportunities are found for my stack"
          >
            <Toggle
              id="toggle-email-savings"
              checked={emailSavings}
              onChange={setEmailSavings}
            />
          </SettingRow>
          <SettingRow
            label="Weekly AI tool pricing updates"
            description="Get a weekly digest of price changes across your tools"
          >
            <Toggle
              id="toggle-weekly-updates"
              checked={weeklyUpdates}
              onChange={setWeeklyUpdates}
            />
          </SettingRow>
        </Section>

        <Section title="Data">
          <SettingRow
            label="Clear saved form data"
            description="Removes your last audit inputs from local storage"
          >
            <button
              id="btn-clear-form"
              onClick={handleClearFormData}
              className="text-sm px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface rounded transition-colors"
            >
              {clearMsg || "Clear"}
            </button>
          </SettingRow>
          <SettingRow
            label="Delete audit history"
            description="Contact support to permanently delete your data"
          >
            <button
              disabled
              className="text-sm px-4 py-2 bg-surface-container border border-outline-variant text-on-surface-variant rounded opacity-50 cursor-not-allowed"
            >
              Contact support
            </button>
          </SettingRow>
        </Section>

        <Section title="About">
          <div className="space-y-2 text-sm text-on-surface-variant">
            <p>
              <span className="text-on-surface font-medium">Version</span>{" "}
              1.0.0
            </p>
            <p>
              <span className="text-on-surface font-medium">Built by</span>{" "}
              Raunak
            </p>
            <p>
              <Link
                href="https://github.com/RoNnY125-coder/StackAudit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub Repository ↗
              </Link>
            </p>
          </div>
        </Section>
      </main>
    </div>
  )
}

