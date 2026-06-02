import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WebAppJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "StackAudit — Free AI Spend Audit for Startups",
    template: "%s | StackAudit",
  },
  description:
    "Find out exactly where your startup is wasting money on AI tools. Free audit in 60 seconds. No login required. Supports Cursor, GitHub Copilot, ChatGPT, Claude, Vercel, Datadog, Linear, Notion, and more.",
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
    "Vercel cost optimization",
    "Datadog cost reduction",
  ],
  authors: [{ name: "StackAudit" }],
  creator: "StackAudit",
  publisher: "StackAudit",
  metadataBase: new URL("https://stack-audit-ashy.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stack-audit-ashy.vercel.app",
    siteName: "StackAudit",
    title: "StackAudit — Free AI Spend Audit for Startups",
    description:
      "Find wasted AI tool spend in 60 seconds. No signup required. Supports Cursor, Copilot, ChatGPT, Claude, Vercel, Datadog and more.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "StackAudit — AI Spend Analyzer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StackAudit — Free AI Spend Audit for Startups",
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
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://stack-audit-ashy.vercel.app",
  },
};

export const viewport = {
  themeColor: "#0e1513",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("stackaudit_theme");if(t==="light")document.documentElement.classList.remove("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.className} bg-background text-on-surface antialiased`}>
        <WebAppJsonLd />
        <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
