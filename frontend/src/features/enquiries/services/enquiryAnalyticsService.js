
const STORAGE_KEY = 'bennyshairfort_mock_whatsapp_analytics'

/**
 * Records a WhatsApp click.
 *
 * This records an attempt to open WhatsApp, not a confirmed
 * message delivery, customer enquiry, or completed order.
 */

export function recordWhatsAppClick({ product, variant = null } = {}) {
  if (!product?.id || !product?.name) {
    return {
      success: false,
      reason: 'invalid_product',
    }
  }

  try {
    const existingEvents = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    const event = {
      id: crypto.randomUUID(),
      eventType: 'whatsapp_click',
      product: {
        id: product.id,
        slug: product.slug ?? null,
        name: product.name,
        category: product.category?.name ?? null,
      },
      variant: variant
        ? {
            id: variant.id ?? null,
            label: variant.label ?? null,
            attributes: variant.attributes ?? {},
          }
        : null,
      occurredAt: new Date().toISOString(),
    }

    const updatedEvents = [event, ...existingEvents]

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedEvents)
    )

    return {
      success: true,
      event,
    }
  } catch (error) {
    console.error('Could not record WhatsApp click:', error)

    return {
      success: false,
      reason: 'storage_error',
    }
  }
}

export function getWhatsAppClickEvents() {
  try {
    const events = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    return Array.isArray(events) ? events : []
  } catch (error) {
    console.error('Could not retrieve WhatsApp analytics:', error)
    return []
  }
}
