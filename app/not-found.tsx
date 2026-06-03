import Link from "next/link"
import TopBar from "@/components/layout/TopBar"

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main
        className="max-w-[480px] mx-auto px-4 pt-40 pb-16 text-center"
        id="main-content"
      >
        <p className="font-mono text-primary text-xs uppercase tracking-widest mb-4">
          404
        </p>
        <h1 className="text-4xl font-bold text-on-surface tracking-tight mb-4">
          Page not found
        </h1>
        <p className="text-on-surface-variant mb-10">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/"
            className="bg-primary-container text-on-primary-container font-bold px-6 py-3 rounded hover:brightness-110 transition-all"
          >
            Go home
          </Link>
          <Link
            href="/audit"
            className="bg-surface-container text-on-surface border border-outline-variant font-bold px-6 py-3 rounded hover:bg-surface-container-high transition-all"
          >
            Run an audit
          </Link>
        </div>
      </main>
    </div>
  )
}
