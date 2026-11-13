
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const STATUS_LABELS = {
  available: 'Available',
  sold_out: 'Sold out',
  reserved: 'Reserved',
  coming_soon: 'Coming soon',
  hidden: 'Hidden',
}

function formatPrice(priceKobo) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(priceKobo / 100)
}

function getPriceLabel(product) {
  if (product.priceKobo != null) {
    return formatPrice(product.priceKobo)
  }

  const variantPrices = (product.variants ?? [])
    .map((variant) => variant.priceKobo)
    .filter((price) => Number.isInteger(price) && price >= 0)

  if (variantPrices.length > 0) {
    return `From ${formatPrice(Math.min(...variantPrices))}`
  }

  return 'Enquire for price'
}

function getAvailabilityLabel(status) {
  if (!status) return 'Availability on request'

  return STATUS_LABELS[status] ?? 'Availability on request'
}

export default function ProductCard({ product }) {
  return (
    <article className="group">
      <Link
        to={`/product/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#493448] via-[#241923] to-[#100D12]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-5xl italic text-gold/20">
                B.
              </span>
            </div>
          )}

          {product.badge && (
            <span className="absolute left-4 top-4 border border-gold/30 bg-obsidian/80 px-3 py-2 text-[10px] tracking-[0.2em] text-gold">
              {product.badge}
            </span>
          )}

          <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center bg-gold text-obsidian transition-transform duration-300 group-hover:scale-110">
            <ArrowUpRight size={20} />
          </span>
        </div>

        <div className="pt-5">
          <p className="text-[10px] tracking-[0.25em] text-gold/70">
            {product.category.name.toUpperCase()}
          </p>

          <h3 className="mt-2 font-display text-xl text-champagne transition-colors group-hover:text-gold">
            {product.name}
          </h3>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm text-champagne/60">
              {getPriceLabel(product)}
            </span>

            <span className="text-xs text-gold">
              {getAvailabilityLabel(product.status)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
