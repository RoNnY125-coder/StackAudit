import { createLogger } from "@/lib/logger"

const log = createLogger("proReport")

interface ProReportModalProps {
  isOpen: boolean
  onClose: () => void
  slug?: string
}

export default function ProReportModal({ isOpen, onClose, slug }: ProReportModalProps) {
  if (!isOpen) return null

  const handleContinue = () => {
    log.info("clicked", { slug })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface-container border border-outline-variant rounded-xl w-full max-w-md overflow-hidden relative shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
        >
          ✕
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Get Your Full PDF Report — $9</h2>
          <p className="text-on-surface-variant mb-6">Take your audit results offline with a professional report.</p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span className="text-on-surface">Printable one-page summary</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span className="text-on-surface">Send to your CFO or board</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span className="text-on-surface">Includes all recommendations with sources</span>
            </li>
          </ul>

          <a 
            href="#"
            onClick={handleContinue}
            data-stripe-product="pro-report"
            className="block w-full bg-primary text-on-primary text-center font-bold py-3 rounded hover:bg-primary-fixed-dim transition-colors mb-4"
          >
            Continue to Payment →
          </a>
          
          <p className="text-center text-xs text-on-surface-variant">
            Powered by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
