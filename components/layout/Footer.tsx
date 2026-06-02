export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-label text-on-surface-variant">
          StackAudit · Built for founders
        </p>
        <p className="font-mono text-label text-on-surface-variant">
          © {new Date().getFullYear()} StackAudit. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
