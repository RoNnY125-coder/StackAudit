import Link from "next/link"

// TODO: replace with real Supabase count query post-launch
export default function SocialProof() {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 mb-24">
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-outline-variant">
          <div className="px-6 py-5 text-center">
            <p className="text-2xl font-bold text-on-surface">843</p>
            <p className="text-sm text-on-surface-variant">audits run</p>
          </div>
          <div className="px-6 py-5 text-center">
            <p className="text-2xl font-bold text-primary">$1,240/mo</p>
            <p className="text-sm text-on-surface-variant">avg saving found</p>
          </div>
          <div className="px-6 py-5 text-center">
            <p className="text-2xl font-bold text-on-surface">12 min ago</p>
            <p className="text-sm text-on-surface-variant">last audit</p>
          </div>
        </div>
        <div className="border-t border-outline-variant px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-on-surface-variant text-sm">
            Trusted by founders optimizing their AI spend.
          </p>
          <Link
            href="/audit"
            className="text-primary hover:text-primary-fixed font-bold text-sm transition-colors whitespace-nowrap"
          >
            Run your audit →
          </Link>
        </div>
      </div>
    </section>
  )
}
