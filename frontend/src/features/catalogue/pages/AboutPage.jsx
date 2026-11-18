
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Gem,
  Heart,
  Sparkles,
  Target,
} from 'lucide-react'

import { getBusinessSettings } from '../../admin/services/businessSettingsService'

const VALUE_ICONS = [Gem, Heart, Sparkles]

export default function AboutPage() {
  const settings = getBusinessSettings()
  const brandValues = settings.brandValues ?? []

  return (
    <main>
      {/* Page introduction */}
      <section className="border-b border-white/10 bg-[#171319]">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <p className="mb-5 text-xs tracking-[0.35em] text-gold">
            GET TO KNOW US
          </p>

          <h1 className="font-display text-4xl leading-tight text-champagne md:text-6xl">
            {settings.aboutHeadline}

            {settings.aboutHeadlineAccent && (
              <span className="mt-3 block italic text-gold">
                {settings.aboutHeadlineAccent}
              </span>
            )}
          </h1>

          {settings.aboutIntroduction && (
            <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-champagne/60 md:text-base">
              {settings.aboutIntroduction}
            </p>
          )}
        </div>
      </section>

      {/* Our story */}
      {settings.aboutStory && (
        <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-5 text-xs tracking-[0.3em] text-gold">
              OUR STORY
            </p>

            <h2 className="font-display text-3xl text-champagne md:text-4xl">
              The story behind the brand.
            </h2>

            <p className="mt-7 whitespace-pre-line text-sm leading-8 text-champagne/60 md:text-base">
              {settings.aboutStory}
            </p>
          </div>
        </section>
      )}

      {/* Our mission */}
      {settings.aboutMission && (
        <section className="border-y border-white/10 bg-[#171319]">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex h-12 w-12 items-center justify-center border border-gold/30 text-gold">
                <Target size={22} />
              </div>

              <p className="mb-4 text-xs tracking-[0.3em] text-gold">
                OUR MISSION
              </p>

              <p className="font-display text-2xl leading-relaxed text-champagne md:text-4xl">
                {settings.aboutMission}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Brand values */}
      {brandValues.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs tracking-[0.3em] text-gold">
              WHAT WE STAND FOR
            </p>

            <h2 className="font-display text-3xl text-champagne md:text-5xl">
              Our Brand Values
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {brandValues.map((value, index) => {
              const Icon = VALUE_ICONS[index % VALUE_ICONS.length]

              return (
                <article
                  key={value.id ?? index}
                  className="border border-white/10 bg-[#171319] p-7 md:p-9"
                >
                  <div className="mb-7 flex h-12 w-12 items-center justify-center border border-gold/30 text-gold">
                    <Icon size={21} />
                  </div>

                  <h3 className="font-display text-xl text-champagne">
                    {value.title}
                  </h3>

                  {value.description && (
                    <p className="mt-4 text-sm leading-7 text-champagne/50">
                      {value.description}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Contact invitation */}
      <section className="border-t border-white/10 bg-[#171319]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center md:py-24">
          <p className="mb-4 text-xs tracking-[0.3em] text-gold">
            YOUR NEXT LOOK STARTS HERE
          </p>

          <h2 className="font-display text-3xl text-champagne md:text-5xl">
            Find a style that feels like you.
          </h2>

          <Link
            to="/catalogue"
            className="mt-9 inline-flex items-center gap-3 bg-gold px-7 py-4 text-xs font-semibold tracking-widest text-obsidian transition-colors hover:bg-champagne"
          >
            EXPLORE THE CATALOGUE
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  )
}
