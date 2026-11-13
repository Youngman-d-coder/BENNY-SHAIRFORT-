
import { Link } from 'react-router-dom'
import { ArrowUpRight, Gem, Heart, Sparkles } from 'lucide-react'

const values = [
  {
    icon: Gem,
    title: 'Exceptional Elegance',
    description: 'Discover styles that bring sophistication to every look.',
  },
  {
    icon: Heart,
    title: 'Personal Expression',
    description: 'Your hair should reflect your personality and confidence.',
  },
  {
    icon: Sparkles,
    title: 'Beauty Without Limits',
    description: 'Explore possibilities and find a style that feels like you.',
  },
]

export default function BrandStorySection() {
  return (
    <section className="border-y border-white/10 bg-[#171319]">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">

        <div>
          <p className="mb-5 text-xs tracking-[0.35em] text-gold">
            THE BENNY'SHAIRFORT EXPERIENCE
          </p>

          <h2 className="font-display text-4xl leading-tight text-champagne md:text-6xl">
            Beauty is an expression.
            <span className="mt-2 block italic text-gold">
              Make yours unforgettable.
            </span>
          </h2>

          <p className="mt-7 max-w-lg text-sm leading-8 text-champagne/60">
            At Benny'shairfort, we believe that the right hairstyle
            does more than complete your appearance. It expresses
            your individuality, elevates your confidence and lets
            you show up as your most authentic self.
          </p>

          <Link
            to="/about"
            className="mt-9 inline-flex items-center gap-3 border-b border-gold/50 pb-2 text-sm text-gold transition-colors hover:text-champagne"
          >
            Discover our story
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="space-y-8">
          {values.map((value, index) => {
            const Icon = value.icon

            return (
              <div
                key={value.title}
                className="flex gap-5 border-b border-white/10 pb-8 last:border-0"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold/30 text-gold">
                  <Icon size={21} />
                </div>

                <div>
                  <p className="mb-2 text-xs tracking-widest text-gold/60">
                    0{index + 1}
                  </p>

                  <h3 className="font-display text-xl text-champagne">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-champagne/50">
                    {value.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
