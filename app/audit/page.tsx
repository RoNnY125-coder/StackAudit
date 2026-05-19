import AuditShell from "@/components/audit/AuditShell"

export const metadata = {
  title: "Audit Your AI Stack",
  description: "Enter your AI tool subscriptions and get an instant savings report. Supports Cursor, GitHub Copilot, ChatGPT, Claude, Vercel, Datadog, Notion, and more.",
  alternates: { canonical: "https://stackaudit.app/audit" },
}

export default function AuditPage() {
  return <AuditShell />
}
