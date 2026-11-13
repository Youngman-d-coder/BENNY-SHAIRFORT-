
import { Link } from 'react-router-dom'

export default function HeroSection({
  videoSrc = '',
  posterSrc = '',
}) {
  return (
    <section className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-midnight md:min-h-[760px]">
      {/* Background media */}
      {videoSrc && (
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          src={videoSrc}
          poster={posterSrc || undefined}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}

      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian/80 via-transparent to-obsidian/20" />

      {/* Hero content */}
      <div className="mx-auto w-full max-w-7xl px-6 py-28">
        <div className="max-w-3xl">
          <p className="mb-6 text-xs font-medium tracking-[0.4em] text-gold md:text-sm">
            REGAL BEAUTY. TIMELESS CONFIDENCE.
          </p>

          <h1 className="font-display text-5xl leading-[1.12] text-champagne sm:text-6xl md:text-7xl lg:text-8xl">
            Discover
            <span className="block italic text-gold">
              Your Crown.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-champagne/70 md:text-lg">
            Exquisite hair. Exceptional elegance.
            Discover a collection designed to complement
            your beauty, confidence and individuality.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/catalogue"
              className="inline-flex min-h-14 items-center justify-center bg-gold px-8 text-sm font-semibold tracking-wider text-obsidian transition-colors hover:bg-champagne"
            >
              EXPLORE COLLECTION
            </Link>

            <Link
              to="/contact"
              className="inline-flex min-h-14 items-center justify-center border border-champagne/40 px-8 text-sm font-medium tracking-wider text-champagne transition-colors hover:border-gold hover:text-gold"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 hidden text-xs tracking-[0.3em] text-champagne/40 md:block">
        BENNY'SHAIRFORT
      </div>
    </section>
  )
}
