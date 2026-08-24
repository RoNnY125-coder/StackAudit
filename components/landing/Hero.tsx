import Link from "next/link"

export default function Hero() {
  return (
    <section className="text-center max-w-4xl mx-auto mt-[120px] md:mt-[160px] px-4">
      <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 border border-primary/20 shadow-sm">
        Free for founders & dev teams
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-6 leading-[1.1]">
        Stop overpaying for <br className="hidden md:block" />
        <span className="text-primary relative">
          AI tools
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 rounded-full"></span>
        </span>
      </h1>

      <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
        The average startup wastes <strong className="text-on-surface">$800+/mo</strong> on redundant subscriptions. 
        Audit your stack instantly and discover exactly what to cut, downgrade, or consolidate.
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
        <Link
          href="/audit"
          className="w-full sm:w-auto bg-primary text-on-primary font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
        >
          Audit My Stack
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </Link>
        <Link
          href="/audit/sample"
          className="w-full sm:w-auto bg-surface text-on-surface hover:bg-surface-container-high px-8 py-4 rounded-xl border-2 border-outline-variant transition-all font-medium text-center"
        >
          See a sample audit
        </Link>
      </div>
    </section>
  )
}
