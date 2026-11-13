
import { getWhatsAppClickEvents } from '../../enquiries/services/enquiryAnalyticsService'

function isToday(timestamp) {
  const eventDate = new Date(timestamp)
  const today = new Date()

  return (
    eventDate.getFullYear() === today.getFullYear() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getDate() === today.getDate()
  )
}

export function getDashboardAnalytics() {
  const events = getWhatsAppClickEvents()

  const todayEvents = events.filter((event) =>
    isToday(event.occurredAt)
  )

  const productCounts = new Map()

  for (const event of events) {
    const productId = event.product?.id

    if (!productId) continue

    const existing = productCounts.get(productId)

    if (existing) {
      existing.clicks += 1
    } else {
      productCounts.set(productId, {
        id: productId,
        name: event.product.name,
        category: event.product.category,
        clicks: 1,
      })
    }
  }

  const mostEnquiredProducts = Array.from(productCounts.values())
    .sort((a, b) => b.clicks - a.clicks)

  const recentActivity = [...events]
    .sort(
      (a, b) =>
        new Date(b.occurredAt) - new Date(a.occurredAt)
    )
    .slice(0, 10)

  return {
    totalWhatsAppClicks: events.length,
    todayWhatsAppClicks: todayEvents.length,
    mostEnquiredProducts,
    recentActivity,
  }
}
