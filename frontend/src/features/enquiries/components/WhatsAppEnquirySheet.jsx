
import { ArrowUpRight, MessageCircle, X } from 'lucide-react'

export default function WhatsAppEnquirySheet({
  enquiry,
  onClose,
  onConfirm,
}) {
  if (!enquiry) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-sheet-title"
        className="w-full max-w-xl border border-gold/20 bg-[#171319] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 flex h-11 w-11 items-center justify-center border border-gold/20 bg-gold/5 text-gold">
              <MessageCircle size={21} />
            </div>

            <p className="text-xs tracking-[0.25em] text-gold">
              CUSTOMER ENQUIRY
            </p>

            <h2
              id="enquiry-sheet-title"
              className="mt-3 font-display text-2xl text-champagne"
            >
              Ready to connect?
            </h2>

            <p className="mt-2 text-sm leading-6 text-champagne/50">
              Review your message before continuing to WhatsApp.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close enquiry preview"
            className="p-2 text-champagne/50 transition-colors hover:text-gold"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-7 border border-white/10 bg-obsidian p-5">
          <p className="mb-3 text-xs tracking-widest text-champagne/40">
            MESSAGE PREVIEW
          </p>

          <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-champagne/80">
            {enquiry.message}
          </pre>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-white/15 px-5 py-4 text-xs font-semibold tracking-widest text-champagne/70 transition-colors hover:border-gold/50 hover:text-champagne"
          >
            GO BACK
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-3 bg-gold px-5 py-4 text-xs font-semibold tracking-widest text-obsidian transition-colors hover:bg-champagne"
          >
            CONTINUE TO WHATSAPP
            <ArrowUpRight size={17} />
          </button>
        </div>
      </section>
    </div>
  )
}
