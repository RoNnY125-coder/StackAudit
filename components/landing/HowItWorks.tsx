export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Enter your tools",
      description: "Select which AI tools your team pays for and what plan you're on."
    },
    {
      number: "02",
      title: "Get your audit",
      description: "Our engine checks every plan against current pricing and flags where you're overpaying."
    },
    {
      number: "03",
      title: "Act on it",
      description: "Get a shareable report with exact recommendations and potential savings. No fluff."
    }
  ]

  return (
    <section className="max-w-7xl mx-auto border-t border-outline-variant pt-24 mt-24 px-4 lg:px-8 mb-24">
      <h2 className="sr-only">How StackAudit Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col">
            <span className="font-mono text-h1 text-primary font-bold mb-4">{step.number}</span>
            <h3 className="text-h3 text-on-surface font-bold mb-2">{step.title}</h3>
            <p className="text-on-surface-variant text-body">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
