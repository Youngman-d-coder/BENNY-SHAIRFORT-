
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

import ProductCard from '../components/ProductCard'
import { getFeaturedProducts } from '../data/products'

export default function FeaturedProductsSection() {
  const featuredProducts = getFeaturedProducts()

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-4 text-xs tracking-[0.35em] text-gold">
            THE BENNY'SHAIRFORT EDIT
          </p>

          <h2 className="font-display text-4xl text-champagne md:text-5xl">
            Featured <span className="italic text-gold">Pieces.</span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-champagne/60">
            Discover carefully selected styles that make
            every appearance unforgettable.
          </p>
        </div>

        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-champagne"
        >
          Explore catalogue
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs leading-6 text-champagne/40">
        Product names and descriptions shown are demonstration content.
        Actual products, prices and availability will come from Benita's catalogue.
      </p>
    </section>
  )
}
