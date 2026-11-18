import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, ArrowUpRight } from "lucide-react";

import ProductCard from "../components/ProductCard";
import { getProducts } from "../data/products";
import { getActiveCategories } from "../../categories/services/categoryService";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured first" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

export default function CataloguePage() {
  const [products] = useState(() => getProducts());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "all";

  const categories = useMemo(() => getActiveCategories(), []);

  const activeCategorySlugs = useMemo(
    () => new Set(categories.map((category) => category.slug)),
    [categories],
  );

  const visibleProducts = useMemo(
    () =>
      products.filter((product) =>
        activeCategorySlugs.has(product.category?.slug),
      ),
    [products, activeCategorySlugs],
  );

  function selectCategory(slug) {
    const nextParams = new URLSearchParams(searchParams);

    if (slug === "all") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", slug);
    }

    setSearchParams(nextParams, { replace: true });
  }

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const results = visibleProducts.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return [...results].sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      return Number(b.isFeatured) - Number(a.isFeatured);
    });
  }, [visibleProducts, searchQuery, selectedCategory, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedCategory !== "all";

  function clearFilters() {
    setSearchQuery("");
    setSortBy("featured");
    selectCategory("all");
  }

  return (
    <main className="min-h-screen bg-obsidian">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(73,52,72,0.35),_transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="mb-5 text-xs tracking-[0.35em] text-gold">
            THE BENNY'SHAIRFORT COLLECTION
          </p>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <h1 className="max-w-3xl font-display text-5xl leading-tight text-champagne md:text-7xl">
                Find your
                <span className="block italic text-gold">signature look.</span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-8 text-champagne/55 md:text-base">
                Explore styles that complement your beauty, express your
                individuality and complete your crown.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex w-fit items-center gap-3 border border-gold/40 px-5 py-4 text-xs tracking-widest text-gold transition-colors hover:bg-gold hover:text-obsidian"
            >
              NEED ASSISTANCE?
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] tracking-[0.3em] text-gold/70">
              EXPLORE THE COLLECTION
            </p>

            <h2 className="font-display text-3xl text-champagne md:text-4xl">
              The Catalogue<span className="text-gold">.</span>
            </h2>
          </div>

          <p className="text-sm text-champagne/45">
            {filteredProducts.length} of {visibleProducts.length} styles
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-champagne/40"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search styles or categories..."
              aria-label="Search catalogue"
              className="h-14 w-full border border-white/10 bg-[#171319] pl-14 pr-5 text-sm text-champagne outline-none transition-colors placeholder:text-champagne/30 focus:border-gold/60"
            />
          </div>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort products"
            className="h-14 border border-white/10 bg-[#171319] px-5 text-sm text-champagne outline-none focus:border-gold/60"
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#171319]"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => selectCategory("all")}
            aria-pressed={selectedCategory === "all"}
            className={`border px-5 py-3 text-xs tracking-wider transition-colors ${
              selectedCategory === "all"
                ? "border-gold bg-gold text-obsidian"
                : "border-white/10 text-champagne/60 hover:border-gold/50 hover:text-gold"
            }`}
          >
            ALL STYLES
          </button>

          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => selectCategory(category.slug)}
              aria-pressed={selectedCategory === category.slug}
              className={`border px-5 py-3 text-xs tracking-wider transition-colors ${
                selectedCategory === category.slug
                  ? "border-gold bg-gold text-obsidian"
                  : "border-white/10 text-champagne/60 hover:border-gold/50 hover:text-gold"
              }`}
            >
              {category.name.toUpperCase()}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-xs text-champagne/45">
              Your selected filters are active.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 text-xs text-gold hover:text-champagne"
            >
              <X size={14} />
              Clear filters
            </button>
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-16 border border-white/10 bg-[#171319] px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 text-gold">
              <Search size={25} />
            </div>

            <h3 className="mt-7 font-display text-2xl text-champagne">
              No styles found.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-champagne/50">
              We couldn't find any styles matching your search. Try another name
              or explore a different category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-7 bg-gold px-6 py-4 text-xs font-semibold tracking-widest text-obsidian transition-colors hover:bg-champagne"
            >
              VIEW ALL STYLES
            </button>
          </div>
        )}

        <p className="mt-16 border-t border-white/10 pt-7 text-center text-xs leading-6 text-champagne/35">
          The styles currently displayed are demonstration content. Confirmed
          products, specifications, pricing and availability will be published
          through Benny'shairfort.
        </p>
      </section>
    </main>
  );
}
