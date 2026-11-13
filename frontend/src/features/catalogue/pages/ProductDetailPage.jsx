import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";

import { getProductBySlug } from "../data/products";
import ProductGallery from "../components/ProductGallery";
import { prepareWhatsAppEnquiry } from "../../enquiries/services/whatsappEnquiryService";
import WhatsAppEnquirySheet from "../../enquiries/components/WhatsAppEnquirySheet";
import { recordWhatsAppClick } from "../../enquiries/services/enquiryAnalyticsService";

const STATUS_LABELS = {
  available: "Available",
  sold_out: "Sold out",
  reserved: "Reserved",
  coming_soon: "Coming soon",
  hidden: "Hidden",
};

function formatPrice(priceKobo) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(priceKobo / 100);
}

function getVariantLabel(variant) {
  if (variant.label) return variant.label;

  return (
    Object.values(variant.attributes ?? {}).join(" · ") || "Product option"
  );
}

function NotFoundProduct() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 text-center">
      <p className="text-xs tracking-[0.3em] text-gold">PRODUCT NOT FOUND</p>

      <h1 className="mt-5 font-display text-4xl text-champagne">
        This style is unavailable.
      </h1>

      <p className="mt-4 text-sm text-champagne/50">
        The product may have been removed or the link may be incorrect.
      </p>

      <Link
        to="/catalogue"
        className="mt-9 inline-flex items-center gap-3 bg-gold px-6 py-4 text-xs font-semibold tracking-widest text-obsidian"
      >
        <ArrowLeft size={16} />
        RETURN TO CATALOGUE
      </Link>
    </section>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [enquiryNotice, setEnquiryNotice] = useState("");
  const [pendingEnquiry, setPendingEnquiry] = useState(null);

  if (!product || product.status === "hidden") {
    return <NotFoundProduct />;
  }

  const variants = product.variants ?? [];

  const selectedVariant =
    variants.find((variant) => variant.id === selectedVariantId) ??
    variants[0] ??
    null;

  const currentPrice = selectedVariant?.priceKobo ?? product.priceKobo;

  const currentStatus = selectedVariant?.status ?? product.status;

  const isSoldOut = currentStatus === "sold_out";
  const isReserved = currentStatus === "reserved";

  function handleEnquiry() {
    const result = prepareWhatsAppEnquiry({
      product,
      variant: selectedVariant,
    });

    if (!result.success) {
      setEnquiryNotice(result.message);
      return;
    }

    setEnquiryNotice("");
    setPendingEnquiry(result);
  }

  function handleConfirmEnquiry() {
    if (!pendingEnquiry?.url) return;

    // Record the customer's attempt to open WhatsApp.
    // Analytics failure must never block the enquiry.
    recordWhatsAppClick({
      product,
      variant: selectedVariant,
    });

    window.open(pendingEnquiry.url, "_blank", "noopener,noreferrer");

    setPendingEnquiry(null);
  }

  return (
    <main className="min-h-screen bg-obsidian">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-3 text-xs tracking-wider text-champagne/50 transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} />
          BACK TO CATALOGUE
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Product gallery */}
          <ProductGallery product={product} />

          {/* Product information */}
          <section className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.3em] text-gold">
              {product.category.name.toUpperCase()}
            </p>

            <h1 className="mt-5 font-display text-4xl leading-tight text-champagne md:text-6xl">
              {product.name}
              <span className="text-gold">.</span>
            </h1>

            <p className="mt-7 text-sm leading-8 text-champagne/60">
              {product.description}
            </p>

            <div className="my-9 border-y border-white/10 py-7">
              <p className="text-xs tracking-[0.2em] text-champagne/40">
                PRICE
              </p>

              <p className="mt-3 font-display text-3xl text-gold">
                {currentPrice != null
                  ? formatPrice(currentPrice)
                  : "Enquire for price"}
              </p>
            </div>

            {/* Variant selection */}
            {variants.length > 0 && (
              <div className="mb-8">
                <label
                  htmlFor="product-variant"
                  className="mb-3 block text-xs tracking-[0.2em] text-champagne/60"
                >
                  SELECT PRODUCT OPTION
                </label>

                <select
                  id="product-variant"
                  value={selectedVariant?.id ?? ""}
                  onChange={(event) => setSelectedVariantId(event.target.value)}
                  className="h-14 w-full border border-white/10 bg-[#171319] px-5 text-sm text-champagne outline-none focus:border-gold/60"
                >
                  {variants.map((variant) => (
                    <option
                      key={variant.id}
                      value={variant.id}
                      className="bg-[#171319]"
                    >
                      {getVariantLabel(variant)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Availability */}
            <div className="flex items-center gap-3">
              {currentStatus === "available" ? (
                <Check size={17} className="text-green-400" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-gold/70" />
              )}

              <span className="text-sm text-champagne/65">
                {STATUS_LABELS[currentStatus] ?? "Availability to be confirmed"}
              </span>
            </div>

            {/* Enquiry action */}
            <div className="mt-10">
              <button
                type="button"
                onClick={handleEnquiry}
                className={`flex min-h-14 w-full items-center justify-center gap-3 px-6 py-4 text-xs font-semibold tracking-[0.15em] transition-colors ${
                  isSoldOut || isReserved
                    ? "border border-white/15 text-champagne/60 hover:border-gold/50"
                    : "bg-gold text-obsidian hover:bg-champagne"
                }`}
              >
                {isSoldOut
                  ? "ASK ABOUT AVAILABILITY"
                  : isReserved
                    ? "MAKE AN ENQUIRY"
                    : "ENQUIRE ABOUT THIS STYLE"}

                <ArrowUpRight size={17} />
              </button>

              {enquiryNotice && (
                <p role="alert" className="mt-4 text-sm leading-6 text-gold">
                  {enquiryNotice}
                </p>
              )}
            </div>

            <p className="mt-6 text-xs leading-6 text-champagne/35">
              Product specifications, pricing and availability should be
              confirmed directly with Benny'shairfort before ordering.
            </p>
          </section>
        </div>
      </div>
      <WhatsAppEnquirySheet
        enquiry={pendingEnquiry}
        onClose={() => setPendingEnquiry(null)}
        onConfirm={handleConfirmEnquiry}
      />
    </main>
  );
}
