const BASE = "https://stack-audit-ashy.vercel.app"

export function WebAppJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "StackAudit",
    url: BASE,
    description:
      "Free AI spend audit tool for startups. Analyze your AI tool subscriptions and find wasted costs in 60 seconds.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free AI spend audit — no login required",
    },
    creator: {
      "@type": "Organization",
      name: "StackAudit",
      url: BASE,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is StackAudit free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The core AI spend audit is completely free with no login required.",
        },
      },
      {
        "@type": "Question",
        name: "What AI tools does StackAudit support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "StackAudit supports Cursor, GitHub Copilot, ChatGPT, Claude (Anthropic), OpenAI API, Windsurf, Vercel, Datadog, Notion, Linear, and PagerDuty.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to connect my billing accounts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. StackAudit works entirely on self-reported data. You enter what you are paying and we calculate your savings.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate are the savings estimates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our engine uses verified 2026 pricing data for every supported tool and applies plan-aware rules to detect over-provisioning, redundant subscriptions, and cheaper tier alternatives.",
        },
      },
      {
        "@type": "Question",
        name: "How long does an audit take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most audits take under 60 seconds to complete. Select your tools, enter your team size, and get results instantly.",
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
