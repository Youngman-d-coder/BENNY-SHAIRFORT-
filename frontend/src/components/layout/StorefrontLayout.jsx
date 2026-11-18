import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowUpRight, Menu, X, MessageCircle } from "lucide-react";

const navigation = [
  { label: "Home", to: "/" },
  { label: "Catalogue", to: "/catalogue" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function StorefrontNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `text-sm transition-colors duration-200 ${
      isActive ? "text-gold" : "text-champagne/65 hover:text-gold"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-obsidian/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex flex-col">
          <span className="font-display text-2xl italic text-gold transition-colors group-hover:text-champagne">
            Benny'shairfort.
          </span>
          <span className="mt-0.5 text-[9px] tracking-[0.35em] text-champagne/40">
            REGAL BEAUTY
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={navClass}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-gold px-5 py-3 text-xs font-semibold tracking-wider text-obsidian transition-colors hover:bg-champagne"
          >
            MAKE AN ENQUIRY
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center border border-white/10 text-champagne transition-colors hover:border-gold hover:text-gold md:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-obsidian px-6 py-7 md:hidden"
        >
          <div className="flex flex-col gap-6">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `font-display text-2xl ${
                    isActive ? "text-gold" : "text-champagne/70"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-3 bg-gold px-5 py-4 text-sm font-semibold text-obsidian"
            >
              MAKE AN ENQUIRY
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function StorefrontFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#100D12]">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-block font-display text-3xl italic text-gold"
            >
              Benny'shairfort.
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-8 text-champagne/50">
              Your beauty. Your expression. Your crown. Discover exquisite hair
              and timeless elegance with Benny'shairfort.
            </p>

            <p className="mt-6 text-[10px] tracking-[0.3em] text-gold/70">
              REGAL BEAUTY. TIMELESS CONFIDENCE.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-champagne">
              EXPLORE
            </h3>

            <div className="flex flex-col gap-4 text-sm text-champagne/50">
              <Link className="hover:text-gold" to="/">
                Home
              </Link>
              <Link className="hover:text-gold" to="/catalogue">
                Catalogue
              </Link>
              <Link className="hover:text-gold" to="/about">
                Our Story
              </Link>
              <Link className="hover:text-gold" to="/contact">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold tracking-[0.2em] text-champagne">
              GET IN TOUCH
            </h3>

            <div className="flex flex-col gap-4 text-sm text-champagne/50">
              <Link
                className="flex items-center gap-3 hover:text-gold"
                to="/contact"
              >
                <MessageCircle size={16} />
                Make an enquiry
              </Link>

              <Link
                className="flex items-center gap-3 hover:text-gold"
                to="/contact"
              >
                <ArrowUpRight size={16} />
                Social enquiries
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-center">
          <p className="text-xs text-champagne/40">
            © {new Date().getFullYear()} Benny'shairfort. All rights reserved.
          </p>

          <div className="flex flex-col gap-2 sm:items-end">
            <p className="text-[10px] tracking-[0.2em] text-gold/60">
              REGAL BEAUTY. TIMELESS CONFIDENCE.
            </p>

            <div className="text-xs leading-relaxed text-champagne/35 sm:text-right">
              <span className="block">Crafted with care and precision by</span>

              <span className="block font-medium tracking-wide text-champagne/65 transition-colors hover:text-gold">
                That Young Man
              </span>

              <span className="block text-[10px] tracking-wider text-champagne/35">
                Digital Solutions &amp; Software Engineering
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function StorefrontLayout() {
  return (
    <div className="min-h-screen bg-obsidian text-champagne">
      <StorefrontNavbar />

      <main>
        <Outlet />
      </main>

      <StorefrontFooter />
    </div>
  );
}
