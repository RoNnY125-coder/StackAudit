import Link from "next/link"

export default function Hero() {
  return (
    <section className="text-center max-w-4xl mx-auto mt-[160px] px-4">
      <p className="font-mono text-primary-container text-xs uppercase mb-4 tracking-widest">
        free for founders
      </p>
      <p className="text-xl md:text-2xl font-bold tracking-tighter text-on-surface mb-2">
        You're probably overpaying for AI tools.
      </p>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-6">
        AI Spend Audit for Startups — Free, Instant, No Login
      </h1>
      <p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-10">
        Enter your subscriptions and get an instant breakdown — free, no login required.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          href="/audit" 
          className="bg-primary-container text-on-primary-container font-bold px-6 py-3 rounded hover:brightness-110 transition-all active:scale-[0.98]"
        >
          Audit My Stack →
        </Link>
        <Link 
          href="/audit/sample" 
          className="bg-surface-container text-on-surface hover:bg-surface-container-high px-6 py-3 rounded border border-outline-variant transition-all"
        >
          See a sample audit
        </Link>
      </div>
    </section>
  )
}
