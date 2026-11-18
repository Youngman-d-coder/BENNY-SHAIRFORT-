import {
  Package,
  CheckCircle2,
  Clock3,
  XCircle,
  EyeOff,
  Sparkles,
  Layers,
} from "lucide-react";

import {
  getProducts,
  PRODUCT_STATUSES,
} from "../../catalogue/services/productService";

import { getActiveCategories } from "../../categories/services/categoryService";

function MetricCard({ icon: Icon, label, value, description }) {
  return (
    <article className="border border-white/10 bg-[#171319] p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs tracking-wider text-champagne/45">
          {label}
        </span>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold/20 bg-gold/5 text-gold">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-6 font-display text-4xl text-champagne">
        {value.toLocaleString("en-NG")}
      </p>

      <p className="mt-2 text-xs text-champagne/35">{description}</p>
    </article>
  );
}

export default function AdminDashboardPage() {
  const products = getProducts();
  const categories = getActiveCategories();

  const metrics = [
    {
      label: "TOTAL PRODUCTS",
      value: products.length,
      description: "All catalogue products",
      icon: Package,
    },
    {
      label: "AVAILABLE",
      value: products.filter(
        (product) => product.status === PRODUCT_STATUSES.AVAILABLE,
      ).length,
      description: "Ready for customer enquiries",
      icon: CheckCircle2,
    },
    {
      label: "RESERVED",
      value: products.filter(
        (product) => product.status === PRODUCT_STATUSES.RESERVED,
      ).length,
      description: "Currently reserved",
      icon: Clock3,
    },
    {
      label: "SOLD OUT",
      value: products.filter(
        (product) => product.status === PRODUCT_STATUSES.SOLD_OUT,
      ).length,
      description: "No longer available",
      icon: XCircle,
    },
    {
      label: "COMING SOON",
      value: products.filter(
        (product) => product.status === PRODUCT_STATUSES.COMING_SOON,
      ).length,
      description: "Upcoming catalogue styles",
      icon: Sparkles,
    },
    {
      label: "HIDDEN",
      value: products.filter(
        (product) => product.status === PRODUCT_STATUSES.HIDDEN,
      ).length,
      description: "Not displayed publicly",
      icon: EyeOff,
    },
    {
      label: "ACTIVE CATEGORIES",
      value: categories.length,
      description: "Categories visible in the catalogue",
      icon: Layers,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl">
      <div>
        <p className="mb-3 text-xs tracking-[0.3em] text-gold">
          BUSINESS OVERVIEW
        </p>

        <h1 className="font-display text-3xl text-champagne md:text-4xl">
          Dashboard
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-champagne/45">
          An overview of your products and catalogue organisation.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            description={metric.description}
          />
        ))}
      </div>

      <div className="mt-10 border border-gold/15 bg-gold/5 p-6">
        <h2 className="font-display text-xl text-champagne">
          Keep your catalogue up to date
        </h2>

        <p className="mt-3 text-sm leading-7 text-champagne/55">
          Review product prices, descriptions and availability regularly. Keep
          your categories organised so customers can easily discover the styles
          they are looking for.
        </p>
      </div>
    </section>
  );
}
