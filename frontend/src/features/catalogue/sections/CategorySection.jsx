
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

import { getActiveCategories } from '../../categories/services/categoryService'

const CATEGORY_STYLES = [
  'from-[#493448] to-[#171319]',
  'from-[#39252F] to-[#171319]',
  'from-[#302632] to-[#171319]',
  'from-[#44322D] to-[#171319]',
  'from-[#332B37] to-[#171319]',
  'from-[#3C2930] to-[#171319]',
]

export default function CategorySection() {
  const categories = getActiveCategories()

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

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/catalogue?category=${encodeURIComponent(category.slug)}`}
              className={`group relative flex min-h-52 flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-br ${
                CATEGORY_STYLES[index % CATEGORY_STYLES.length]
              } p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs tracking-[0.25em] text-gold/70">
                  {String(index + 1).padStart(2, '0')}
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
                  {category.description || 'Explore styles in this collection.'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="border border-white/10 bg-[#171319] px-6 py-12 text-center text-sm text-champagne/50">
          Our collections are being updated. Please check back soon.
        </p>
      )}
    </section>
  )
}
