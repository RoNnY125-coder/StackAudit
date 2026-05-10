export default function Ticker() {
  const tools = [
    "Cursor", "GitHub Copilot", "Claude", "ChatGPT",
    "Gemini", "Windsurf", "OpenAI API", "Anthropic API",
    "Datadog", "Notion", "Linear", "PagerDuty", "Vercel", "AWS"
  ]

  // Double array for infinite scroll
  const marqueeItems = [...tools, ...tools, ...tools]

  return (
    <div className="w-full bg-surface-container-lowest border-y border-outline-variant py-4 overflow-hidden mt-24">
      <div className="ticker-track">
        {marqueeItems.map((tool, index) => (
          <span 
            key={index} 
            className="px-8 opacity-60 font-mono text-label text-on-surface-variant uppercase tracking-widest whitespace-nowrap"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  )
}
