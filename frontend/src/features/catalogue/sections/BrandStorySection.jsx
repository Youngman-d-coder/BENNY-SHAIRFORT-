import { Link } from "react-router-dom";
import { ArrowUpRight, Gem, Heart, Sparkles } from "lucide-react";

import { getBusinessSettings } from "../../admin/services/businessSettingsService";

const VALUE_ICONS = [Gem, Heart, Sparkles];

export default function BrandStorySection() {
  const settings = getBusinessSettings();

  const brandValues = settings.brandValues ?? [];

  return (
    <section className="border-y border-white/10 bg-[#171319]">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
        <div>
          <p className="mb-5 text-xs tracking-[0.35em] text-gold">
            THE BENNY'SHAIRFORT EXPERIENCE
          </p>

          <h2 className="font-display text-4xl leading-tight text-champagne md:text-6xl">
            {settings.aboutHeadline}
            {settings.aboutHeadlineAccent && (
              <span className="mt-2 block italic text-gold">
                {settings.aboutHeadlineAccent}
              </span>
            )}
          </h2>

          {settings.aboutIntroduction && (
            <p className="mt-7 max-w-lg text-sm leading-8 text-champagne/60">
              {settings.aboutIntroduction}
            </p>
          )}

          <Link
            to="/about"
            className="mt-9 inline-flex items-center gap-3 border-b border-gold/50 pb-2 text-sm text-gold transition-colors hover:text-champagne"
          >
            Discover our story
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="space-y-8">
          {brandValues.map((value, index) => {
            const Icon = VALUE_ICONS[index % VALUE_ICONS.length];

            return (
              <div
                key={value.id ?? index}
                className="flex gap-5 border-b border-white/10 pb-8 last:border-0"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold/30 text-gold">
                  <Icon size={21} />
                </div>

                <div>
                  <p className="mb-2 text-xs tracking-widest text-gold/60">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="font-display text-xl text-champagne">
                    {value.title}
                  </h3>

                  {value.description && (
                    <p className="mt-2 text-sm leading-7 text-champagne/50">
                      {value.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
