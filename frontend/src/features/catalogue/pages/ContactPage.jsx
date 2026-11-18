import { Link } from "react-router-dom";
import { useMemo } from "react";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { getBusinessSettings } from "../../admin/services/businessSettingsService";

function normalisePhone(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function getValidWebUrl(value) {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

function ContactLink({ icon: Icon, title, value, href, description }) {
  if (!value || !href) return null;

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-5 border border-white/10 bg-[#171319] p-6 transition-colors hover:border-gold/50"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold/20 bg-gold/5 text-gold">
        <Icon size={21} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs tracking-[0.2em] text-gold">
          {title}
        </span>

        <span className="mt-2 block break-words text-base text-champagne">
          {value}
        </span>

        {description && (
          <span className="mt-2 block text-xs text-champagne/40">
            {description}
          </span>
        )}
      </span>

      <ArrowUpRight
        size={18}
        className="shrink-0 text-champagne/30 transition-colors group-hover:text-gold"
      />
    </a>
  );
}

export default function ContactPage() {
  const settings = useMemo(() => getBusinessSettings(), []);

  const whatsappNumber = normalisePhone(settings.whatsappNumber);
  const phoneNumber = normalisePhone(settings.phoneNumber);

  const whatsappUrl = /^\d{7,15}$/.test(whatsappNumber)
    ? `https://wa.me/${whatsappNumber}`
    : null;

  const phoneUrl = /^\d{7,15}$/.test(phoneNumber)
    ? `tel:+${phoneNumber}`
    : null;

  const email = String(settings.email ?? "").trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const instagramUrl = getValidWebUrl(settings.instagramUrl);
  const tiktokUrl = getValidWebUrl(settings.tiktokUrl);

  const openingHours = Object.entries(settings.openingHours ?? {}).filter(
    ([, hours]) => String(hours ?? "").trim(),
  );

  const hasContactMethods =
    whatsappUrl || phoneUrl || emailIsValid || instagramUrl || tiktokUrl;

  return (
    <main className="min-h-screen bg-obsidian">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(73,52,72,0.35),_transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="mb-5 text-xs tracking-[0.35em] text-gold">
            WE WOULD LOVE TO HEAR FROM YOU
          </p>

          <h1 className="max-w-3xl font-display text-5xl leading-tight text-champagne md:text-7xl">
            Let's start a
            <span className="block italic text-gold">conversation.</span>
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-8 text-champagne/55 md:text-base">
            Have a question about a style or need assistance? Reach out through
            any of our available contact channels.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 text-xs tracking-[0.3em] text-gold">
              GET IN TOUCH
            </p>

            <h2 className="mb-8 font-display text-3xl text-champagne md:text-4xl">
              Contact {settings.businessName || "Benny'shairfort"}.
            </h2>

            {hasContactMethods ? (
              <div className="grid gap-4">
                <ContactLink
                  icon={MessageCircle}
                  title="WHATSAPP"
                  value={settings.whatsappNumber}
                  href={whatsappUrl}
                  description="Start a conversation on WhatsApp."
                />

                <ContactLink
                  icon={Phone}
                  title="PHONE"
                  value={settings.phoneNumber}
                  href={phoneUrl}
                  description="Call the business directly."
                />

                <ContactLink
                  icon={Mail}
                  title="EMAIL"
                  value={emailIsValid ? email : ""}
                  href={emailIsValid ? `mailto:${email}` : null}
                  description="Send us an email."
                />

                <ContactLink
                  icon={ArrowUpRight}
                  title="INSTAGRAM"
                  value={instagramUrl ? "Visit our Instagram profile" : ""}
                  href={instagramUrl}
                />

                <ContactLink
                  icon={ArrowUpRight}
                  title="TIKTOK"
                  value={tiktokUrl ? "Visit our TikTok profile" : ""}
                  href={tiktokUrl}
                />
              </div>
            ) : (
              <div className="border border-white/10 bg-[#171319] px-6 py-12">
                <MessageCircle size={30} className="mb-5 text-gold" />

                <h3 className="font-display text-2xl text-champagne">
                  Contact details coming soon.
                </h3>

                <p className="mt-3 max-w-md text-sm leading-7 text-champagne/50">
                  Our contact channels are currently being updated. Please check
                  back soon.
                </p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {settings.address?.trim() && (
              <div className="border border-white/10 bg-[#171319] p-7">
                <MapPin size={22} className="mb-5 text-gold" />

                <h3 className="font-display text-xl text-champagne">
                  Our Location
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-champagne/55">
                  {settings.address}
                </p>
              </div>
            )}

            {openingHours.length > 0 && (
              <div className="border border-white/10 bg-[#171319] p-7">
                <Clock size={22} className="mb-5 text-gold" />

                <h3 className="font-display text-xl text-champagne">
                  Opening Hours
                </h3>

                <div className="mt-5 space-y-4">
                  {openingHours.map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex justify-between gap-4 border-b border-white/5 pb-3"
                    >
                      <span className="text-sm capitalize text-champagne/50">
                        {day}
                      </span>

                      <span className="text-right text-sm text-champagne">
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-gold/20 bg-gold/5 p-7">
              <p className="text-xs tracking-[0.25em] text-gold">
                NEED HELP CHOOSING?
              </p>

              <h3 className="mt-4 font-display text-2xl text-champagne">
                Find your signature look.
              </h3>

              <p className="mt-3 text-sm leading-7 text-champagne/50">
                Explore the catalogue and discover the styles available in our
                collection.
              </p>

              <Link
                to="/catalogue"
                className="mt-6 inline-flex items-center gap-2 text-xs tracking-widest text-gold transition-colors hover:text-champagne"
              >
                EXPLORE CATALOGUE
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
