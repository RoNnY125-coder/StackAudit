export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect Securely",
      description: "Grant read-only access to SSO or expense platforms."
    },
    {
      number: "02",
      title: "Instant Analysis",
      description: "Cross-reference tools vs redundancy database + pricing."
    },
    {
      number: "03",
      title: "Take Action",
      description: "Receive prioritized downgrades, consolidations."
    }
  ]

  return (
    <section className="max-w-7xl mx-auto border-t border-outline-variant pt-24 mt-24 px-4 lg:px-8 mb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col">
            <span className="font-mono text-h1 text-surface-bright font-bold mb-4">{step.number}</span>
            <h3 className="text-h3 text-on-surface font-bold mb-2">{step.title}</h3>
            <p className="text-on-surface-variant text-body">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
