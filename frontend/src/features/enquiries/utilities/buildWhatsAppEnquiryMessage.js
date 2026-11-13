
const STATUS_LABELS = {
  available: 'Available',
  sold_out: 'Sold out',
  reserved: 'Reserved',
  coming_soon: 'Coming soon',
}

function formatPrice(priceKobo) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(priceKobo / 100)
}

function getVariantDescription(variant) {
  if (!variant) return null

  if (variant.label?.trim()) {
    return variant.label.trim()
  }

  const attributes = Object.values(variant.attributes ?? {})
    .filter((value) => value != null && String(value).trim())
    .map(String)

  return attributes.length > 0
    ? attributes.join(' · ')
    : null
}

/**
 * Builds a customer enquiry message from catalogue data.
 *
 * This function does not open WhatsApp or send messages.
 * It only prepares the message text.
 */
export function buildWhatsAppEnquiryMessage({
  product,
  variant = null,
  businessName = "Benny'shairfort",
} = {}) {
  if (!product?.name) {
    throw new Error('A valid product is required to build an enquiry.')
  }

  const priceKobo = variant?.priceKobo ?? product.priceKobo
  const status = variant?.status ?? product.status
  const variantDescription = getVariantDescription(variant)

  const lines = [
    `Hello ${businessName},`,
    '',
    'I would like to make an enquiry about this product:',
    '',
    `Product: ${product.name}`,
  ]

  if (product.category?.name) {
    lines.push(`Category: ${product.category.name}`)
  }

  if (variantDescription) {
    lines.push(`Selected option: ${variantDescription}`)
  }

  if (priceKobo != null) {
    lines.push(`Listed price: ${formatPrice(priceKobo)}`)
  }

  if (status && STATUS_LABELS[status]) {
    lines.push(`Displayed availability: ${STATUS_LABELS[status]}`)
  }

  if (priceKobo == null || !status) {
    lines.push('')
    lines.push('Please confirm the current price and availability.')
  } else {
    lines.push('')
    lines.push('Please confirm the details and how I can proceed.')
  }

  lines.push('', 'Thank you.')

  return lines.join('\n')
}
