import Link from "next/link"

export default function SocialProof() {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
      <div className="bg-surface-container border border-outline-variant p-8 md:p-12 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-2">
            Trusted by high-velocity engineering teams.
          </h2>
          <p className="text-on-surface-variant">
            Over 10,000 stacks audited. $2.4M in recurring annual savings.
          </p>
        </div>
        <Link 
          href="#" 
          className="text-primary hover:text-primary-fixed font-bold flex items-center whitespace-nowrap transition-colors"
        >
          Read Case Studies →
        </Link>
      </div>
    </section>
  )
}
