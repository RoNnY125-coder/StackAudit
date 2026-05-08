export default function AIAnalysis({ text }: { text: string }) {
  return (
    <div className="my-8">
      <h3 className="font-mono text-label text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className="text-lg leading-none">✦</span> AI Analysis
      </h3>
      <div className="bg-surface-container border-l-[3px] border-outline p-4 rounded-r">
        <p className="text-on-surface leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
