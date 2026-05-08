import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "StackAudit | AI Spend Analyzer", template: "%s | StackAudit" },
  description: "Analyze your AI tool subscriptions in 60 seconds. Find overlapping features, underutilized seats, and hidden costs.",
  keywords: ["AI spend", "SaaS audit", "developer tools", "cost optimization"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stackaudit.com",
    siteName: "StackAudit",
    title: "StackAudit | AI Spend Analyzer",
    description: "Find $2,400/mo in wasted AI tool spend. Free audit in 60 seconds.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "StackAudit | AI Spend Analyzer",
    description: "Find wasted AI spend in 60 seconds.",
  },
  robots: { index: true, follow: true },
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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-on-surface antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
