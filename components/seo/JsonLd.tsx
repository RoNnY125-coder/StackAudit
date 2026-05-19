export function WebAppJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "StackAudit",
          "url": "https://stackaudit.app",
          "description": "Free AI spend audit tool for startups. Analyze your AI tool subscriptions and find wasted costs.",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Free AI spend audit"
          }
        })
      }}
    />
  )
}

export function FAQJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is StackAudit free?",
              "acceptedAnswer": { "@type": "Answer", "text": "Yes. The core AI spend audit is completely free with no login required." }
            },
            {
              "@type": "Question",
              "name": "What AI tools does StackAudit support?",
              "acceptedAnswer": { "@type": "Answer", "text": "StackAudit supports Cursor, GitHub Copilot, ChatGPT, Claude (Anthropic), OpenAI API, Windsurf, Vercel, Datadog, Notion, Linear, and PagerDuty." }
            },
            {
              "@type": "Question",
              "name": "Do I need to connect my billing accounts?",
              "acceptedAnswer": { "@type": "Answer", "text": "No. StackAudit works entirely on self-reported data. You enter what you're paying and we calculate your savings." }
            }
          ]
        })
      }}
    />
  )
}
