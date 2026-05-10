import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-mono text-label text-on-surface-variant">
          StackAudit · Built for founders ·{" "}
          <Link
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            credex.rocks
          </Link>
        </p>
      </div>
    </footer>
  )
}
