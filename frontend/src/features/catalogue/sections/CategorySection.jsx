
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const categories = [
  {
    id: 'bone-straight',
    name: 'Bone Straight',
    description: 'Sleek. Smooth. Timeless.',
    number: '01',
    style: 'from-[#493448] to-[#171319]',
  },
  {
    id: 'body-wave',
    name: 'Body Wave',
    description: 'Soft waves. Effortless elegance.',
    number: '02',
    style: 'from-[#39252F] to-[#171319]',
  },
  {
    id: 'deep-wave',
    name: 'Deep Wave',
    description: 'Defined waves. Bold beauty.',
    number: '03',
    style: 'from-[#302632] to-[#171319]',
  },
  {
    id: 'curly-hair',
    name: 'Curly Hair',
    description: 'Texture with personality.',
    number: '04',
    style: 'from-[#44322D] to-[#171319]',
  },
  {
    id: 'closures',
    name: 'Closures',
    description: 'The perfect finishing touch.',
    number: '05',
    style: 'from-[#332B37] to-[#171319]',
  },
  {
    id: 'frontals',
    name: 'Frontals',
    description: 'Versatility meets elegance.',
    number: '06',
    style: 'from-[#3C2930] to-[#171319]',
  },
]

export default function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-4 text-xs tracking-[0.35em] text-gold">
            EXPLORE OUR COLLECTIONS
          </p>

          <h2 className="font-display text-4xl text-champagne md:text-5xl">
            Find Your <span className="italic text-gold">Signature.</span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-champagne/60">
            Discover styles that complement your beauty,
            personality and individual expression.
          </p>
        </div>

        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-champagne"
        >
          View all collections
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/catalogue?category=${category.id}`}
            className={`group relative flex min-h-52 flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-br ${category.style} p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50`}
          >
            <div className="flex items-start justify-between">
              <span className="text-xs tracking-[0.25em] text-gold/70">
                {category.number}
              </span>

              <ArrowUpRight
                size={19}
                className="text-champagne/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold"
              />
            </div>

            <div>
              <h3 className="font-display text-2xl text-champagne md:text-3xl">
                {category.name}
              </h3>

              <p className="mt-2 text-sm text-champagne/50">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
