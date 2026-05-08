export default function ShareBar({ slug }: { slug: string }) {
  return (
    <div className="bg-surface border border-outline-variant/50 rounded-xl p-2 flex items-center justify-between my-8">
      <div className="px-2 font-mono text-code text-on-surface-variant truncate">
        stackaudit.com/r/{slug}
      </div>
      <div className="flex gap-2 shrink-0">
        <button className="border border-outline-variant text-on-surface hover:bg-surface-container rounded px-4 py-2 text-label transition-colors">
          Copy link
        </button>
        <button className="border border-outline-variant text-on-surface hover:bg-surface-container rounded px-4 py-2 text-label transition-colors">
          Share on X
        </button>
      </div>
    </div>
  )
}
