import Link from "next/link"

export default function CTABlock() {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 my-8">
      <div>
        <h3 className="font-bold text-on-surface mb-1">Need help executing these changes?</h3>
        <p className="text-on-surface-variant text-sm">
          Our certified engineers implement with zero downtime.
        </p>
      </div>
      <Link 
        href="#" 
        className="shrink-0 bg-primary text-on-primary hover:bg-primary-fixed-dim px-6 py-2 rounded text-label font-bold transition-colors whitespace-nowrap text-center w-full sm:w-auto"
      >
        Book Free Consultation →
      </Link>
    </div>
  )
}
