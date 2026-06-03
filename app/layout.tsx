import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { WebAppJsonLd } from "@/components/seo/JsonLd"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: {
    default: "StackAudit — Free AI Tool Spend Audit for Dev Teams",
    template: "%s | StackAudit",
  },
  description:
    "Find wasted AI tool spend in 60 seconds. Free audit, no login. Supports Cursor, Copilot, ChatGPT, Claude, Vercel, Datadog, Notion and more.",
  keywords: [
    "AI spend audit",
    "SaaS cost optimization",
    "cursor vs copilot 2026",
    "reduce AI tool costs",
    "startup tool audit",
    "developer tool pricing",
    "AI subscription management",
    "tech stack cost analysis",
    "github copilot pricing",
    "ChatGPT team pricing",
  ],
  authors: [{ name: "StackAudit" }],
  creator: "StackAudit",
  metadataBase: new URL("https://stack-audit-ashy.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stack-audit-ashy.vercel.app",
    siteName: "StackAudit",
    title: "StackAudit — Free AI Tool Spend Audit for Dev Teams",
    description:
      "Find wasted AI tool spend in 60 seconds. Free audit, no login required.",
    // No images key — omit entirely until /og-default.png is created
    // Adding a 404 image is worse than no image
  },
  twitter: {
    card: "summary",
    title: "StackAudit — Free AI Tool Spend Audit for Dev Teams",
    description: "Find wasted AI tool spend in 60 seconds. Free, no login.",
    creator: "@stackaudit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://stack-audit-ashy.vercel.app",
  },
}

export const viewport = {
  themeColor: "#0e1513",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${inter.className} bg-background text-on-surface antialiased`}
      >
        {/* Inline theme script — runs before first paint, prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('stackaudit_theme');if(t==='light'){document.documentElement.classList.add('light')}else{document.documentElement.classList.remove('light')}}catch(e){}})()`,
          }}
        />
        <WebAppJsonLd />
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
