
import { useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  Clock3,
  MessageCircle,
  Package,
  RefreshCw,
} from 'lucide-react'

import { getDashboardAnalytics } from '../services/dashboardAnalyticsService'

function formatDate(timestamp) {
  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function MetricCard({ icon: Icon, label, value, description }) {
  return (
    <article className="border border-white/10 bg-[#171319] p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-wider text-champagne/45">
          {label}
        </span>

        <div className="flex h-10 w-10 items-center justify-center border border-gold/20 bg-gold/5 text-gold">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-6 font-display text-4xl text-champagne">
        {value.toLocaleString('en-NG')}
      </p>

      <p className="mt-2 text-xs text-champagne/35">
        {description}
      </p>
    </article>
  )
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center border border-gold/20 bg-gold/5 text-gold">
        <Activity size={23} />
      </div>

      <p className="mt-5 text-sm text-champagne/70">
        {message}
      </p>

      <p className="mt-2 text-xs text-champagne/35">
        Activity will appear here as customers interact with your store.
      </p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(getDashboardAnalytics)

  function handleRefresh() {
    setAnalytics(getDashboardAnalytics())
  }

  return (
    <section className="mx-auto max-w-7xl">
      {/* Page heading */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-3 text-xs tracking-[0.3em] text-gold">
            BUSINESS OVERVIEW
          </p>

          <h1 className="font-display text-3xl text-champagne md:text-4xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-champagne/45">
            Monitor customer interest and understand which products
            are attracting attention.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-3 border border-white/15 px-5 py-3 text-xs tracking-wider text-champagne/70 transition-colors hover:border-gold/50 hover:text-gold"
        >
          <RefreshCw size={15} />
          REFRESH DATA
        </button>
      </div>

      {/* Metrics */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={MessageCircle}
          label="TOTAL WHATSAPP CLICKS"
          value={analytics.totalWhatsAppClicks}
          description="Recorded attempts to open WhatsApp"
        />

        <MetricCard
          icon={Clock3}
          label="TODAY'S WHATSAPP CLICKS"
          value={analytics.todayWhatsAppClicks}
          description="Recorded clicks today"
        />

        <MetricCard
          icon={Package}
          label="PRODUCTS WITH INTEREST"
          value={analytics.mostEnquiredProducts.length}
          description="Distinct products with recorded clicks"
        />
      </div>

      {/* Product ranking */}
      <section className="mt-10 border border-white/10 bg-[#171319]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="font-display text-xl text-champagne">
              Most Enquired Products
            </h2>

            <p className="mt-1 text-xs text-champagne/35">
              Ranked by recorded WhatsApp clicks
            </p>
          </div>

          <ArrowUpRight size={19} className="text-gold" />
        </div>

        {analytics.mostEnquiredProducts.length === 0 ? (
          <EmptyState message="No product interest recorded yet." />
        ) : (
          <div className="divide-y divide-white/5">
            {analytics.mostEnquiredProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 px-6 py-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-gold/20 text-sm text-gold">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm text-champagne">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-champagne/35">
                      {product.category || 'Uncategorised'}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-display text-xl text-gold">
                    {product.clicks}
                  </p>

                  <p className="text-[10px] tracking-wider text-champagne/35">
                    CLICKS
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent activity */}
      <section className="mt-8 border border-white/10 bg-[#171319]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="font-display text-xl text-champagne">
            Recent Activity
          </h2>

          <p className="mt-1 text-xs text-champagne/35">
            Latest recorded customer interactions
          </p>
        </div>

        {analytics.recentActivity.length === 0 ? (
          <EmptyState message="No recent activity to display." />
        ) : (
          <div className="divide-y divide-white/5">
            {analytics.recentActivity.map((event) => (
              <article
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-green-400/20 bg-green-400/5 text-green-400">
                    <MessageCircle size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm text-champagne">
                      {event.product?.name || 'Unknown product'}
                    </p>

                    <p className="mt-1 text-xs text-champagne/35">
                      WhatsApp click
                      {event.variant?.label
                        ? ` · ${event.variant.label}`
                        : ''}
                    </p>
                  </div>
                </div>

                <time className="text-xs text-champagne/40">
                  {formatDate(event.occurredAt)}
                </time>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Analytics disclaimer */}
      <div className="mt-8 flex items-start gap-3 border border-gold/15 bg-gold/5 p-5">
        <Activity size={17} className="mt-0.5 shrink-0 text-gold" />

        <p className="text-xs leading-6 text-champagne/55">
          Analytics currently use temporary browser storage.
          WhatsApp clicks represent attempts to open WhatsApp;
          they do not confirm that a message was sent, an order
          was placed or a sale was completed.
        </p>
      </div>
    </section>
  )
}
