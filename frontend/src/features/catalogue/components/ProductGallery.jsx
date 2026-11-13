
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react'

export default function ProductGallery({ product }) {
  const images = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : []

  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const hasImages = images.length > 0
  const activeImage = images[activeIndex]

  function showPrevious() {
    setActiveIndex((current) =>
      (current - 1 + images.length) % images.length,
    )
  }

  function showNext() {
    setActiveIndex((current) =>
      (current + 1) % images.length,
    )
  }

  useEffect(() => {
    if (!lightboxOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setLightboxOpen(false)
      }

      if (event.key === 'ArrowLeft') {
        showPrevious()
      }

      if (event.key === 'ArrowRight') {
        showNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxOpen, images.length])

  return (
    <>
      <section aria-label="Product images">
        <button
          type="button"
          onClick={() => hasImages && setLightboxOpen(true)}
          disabled={!hasImages}
          aria-label={hasImages ? 'Enlarge product image' : 'No product image available'}
          className="relative block aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#493448] via-[#241923] to-[#100D12] disabled:cursor-default"
        >
          {hasImages ? (
            <img
              src={activeImage}
              alt={`${product.name} - image ${activeIndex + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <ImageIcon size={42} className="text-gold/40" />

              <span className="font-display text-6xl italic text-gold/25">
                B.
              </span>

              <p className="text-[10px] tracking-[0.25em] text-champagne/30">
                PRODUCT PHOTOGRAPHY
              </p>
            </div>
          )}

          {product.badge && (
            <span className="absolute left-5 top-5 border border-gold/30 bg-obsidian/80 px-4 py-3 text-[10px] tracking-[0.2em] text-gold">
              {product.badge}
            </span>
          )}

          {hasImages && (
            <span className="absolute bottom-5 right-5 bg-obsidian/80 px-4 py-3 text-[10px] tracking-widest text-champagne">
              VIEW IMAGE
            </span>
          )}
        </button>

        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={activeIndex === index}
                className={`aspect-square overflow-hidden border transition-colors ${
                  activeIndex === index
                    ? 'border-gold'
                    : 'border-white/10 hover:border-gold/50'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} image viewer`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-5"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close image viewer"
            className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center border border-white/20 text-white hover:border-gold hover:text-gold"
          >
            <X size={23} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous image"
              className="absolute left-4 flex h-12 w-12 items-center justify-center border border-white/20 text-white hover:border-gold hover:text-gold md:left-10"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <img
            src={activeImage}
            alt={`${product.name} enlarged view`}
            className="max-h-[85vh] max-w-[85vw] object-contain"
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="absolute right-4 flex h-12 w-12 items-center justify-center border border-white/20 text-white hover:border-gold hover:text-gold md:right-10"
            >
              <ChevronRight size={24} />
            </button>
          )}

          <p className="absolute bottom-5 text-xs tracking-widest text-white/60">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  )
}
