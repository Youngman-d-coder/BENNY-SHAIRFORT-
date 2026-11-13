
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'

export default function EnquiryCTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="relative overflow-hidden border border-gold/20 bg-gradient-to-br from-[#493448] via-[#241923] to-[#100D12] px-7 py-16 text-center md:px-16 md:py-24">

        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-gold/10" />
        <div className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full border border-gold/10" />

        <p className="mb-5 text-xs tracking-[0.35em] text-gold">
          YOUR NEXT LOOK STARTS HERE
        </p>

        <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight text-champagne md:text-6xl">
          Ready to discover your
          <span className="block italic text-gold">perfect crown?</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-champagne/60">
          Explore our collection or speak with us to find a style
          that matches your taste and preferences.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            to="/catalogue"
            className="inline-flex min-h-14 items-center gap-3 bg-gold px-7 text-sm font-semibold tracking-wider text-obsidian transition-colors hover:bg-champagne"
          >
            EXPLORE COLLECTION
            <ArrowRight size={17} />
          </Link>

          <Link
            to="/contact"
            className="inline-flex min-h-14 items-center gap-3 border border-champagne/30 px-7 text-sm text-champagne transition-colors hover:border-gold hover:text-gold"
          >
            <MessageCircle size={17} />
            MAKE AN ENQUIRY
          </Link>
        </div>

      </div>
    </section>
  )
}
