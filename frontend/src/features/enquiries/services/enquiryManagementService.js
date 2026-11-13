
const STORAGE_KEY = 'bennyshairfort_mock_enquiries'

export const ENQUIRY_STATUSES = {
  NEW: 'new',
  CONTACTED: 'contacted',
  ORDER_CONFIRMED: 'order_confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const ENQUIRY_SOURCES = {
  WHATSAPP: 'whatsapp',
  PHONE: 'phone',
  INSTAGRAM: 'instagram',
  WALK_IN: 'walk_in',
  OTHER: 'other',
}

const VALID_STATUSES = Object.values(ENQUIRY_STATUSES)
const VALID_SOURCES = Object.values(ENQUIRY_SOURCES)

function readEnquiries() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) return []

    const enquiries = JSON.parse(stored)

    return Array.isArray(enquiries) ? enquiries : []
  } catch (error) {
    console.error('Could not load enquiries:', error)
    return []
  }
}

function writeEnquiries(enquiries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries))
    return true
  } catch (error) {
    console.error('Could not save enquiries:', error)
    return false
  }
}

function createProductSnapshot(product) {
  if (!product?.id || !product?.name) return null

  return {
    id: product.id,
    name: product.name,
    slug: product.slug ?? null,
    category: product.category?.name ?? null,
  }
}

function createVariantSnapshot(variant) {
  if (!variant) return null

  return {
    id: variant.id ?? null,
    label: variant.label ?? null,
    attributes: variant.attributes ?? {},
  }
}

export function getEnquiries() {
  return readEnquiries().sort(
    (a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)
  )
}

export function getEnquiryById(id) {
  return readEnquiries().find((enquiry) => enquiry.id === id) ?? null
}

export function createEnquiry({
  customerName = '',
  customerPhone = '',
  product = null,
  variant = null,
  source = ENQUIRY_SOURCES.WHATSAPP,
  status = ENQUIRY_STATUSES.NEW,
  notes = '',
  receivedAt = new Date().toISOString(),
} = {}) {
  const name = String(customerName).trim()
  const phone = String(customerPhone).trim()

  if (!name && !phone) {
    return {
      success: false,
      reason: 'missing_customer_details',
      message: 'Provide a customer name or contact number.',
    }
  }

  if (!VALID_SOURCES.includes(source)) {
    return {
      success: false,
      reason: 'invalid_source',
      message: 'Select a valid enquiry source.',
    }
  }

  if (!VALID_STATUSES.includes(status)) {
    return {
      success: false,
      reason: 'invalid_status',
      message: 'Select a valid enquiry status.',
    }
  }

  const enquiries = readEnquiries()
  const now = new Date().toISOString()

  const enquiry = {
    id: crypto.randomUUID(),
    customerName: name,
    customerPhone: phone,
    product: createProductSnapshot(product),
    variant: createVariantSnapshot(variant),
    source,
    status,
    notes: String(notes).trim(),
    receivedAt,
    createdAt: now,
    updatedAt: now,
  }

  if (!writeEnquiries([enquiry, ...enquiries])) {
    return {
      success: false,
      reason: 'storage_error',
      message: 'The enquiry could not be saved.',
    }
  }

  return {
    success: true,
    enquiry,
  }
}

export function updateEnquiry(id, updates = {}) {
  const enquiries = readEnquiries()
  const index = enquiries.findIndex((item) => item.id === id)

  if (index === -1) {
    return {
      success: false,
      reason: 'not_found',
      message: 'Enquiry not found.',
    }
  }

  if (
    updates.status !== undefined &&
    !VALID_STATUSES.includes(updates.status)
  ) {
    return {
      success: false,
      reason: 'invalid_status',
      message: 'Select a valid enquiry status.',
    }
  }

  const updatedEnquiry = {
    ...enquiries[index],
    ...(updates.customerName !== undefined && {
      customerName: String(updates.customerName).trim(),
    }),
    ...(updates.customerPhone !== undefined && {
      customerPhone: String(updates.customerPhone).trim(),
    }),
    ...(updates.status !== undefined && {
      status: updates.status,
    }),
    ...(updates.notes !== undefined && {
      notes: String(updates.notes).trim(),
    }),
    updatedAt: new Date().toISOString(),
  }

  if (!updatedEnquiry.customerName && !updatedEnquiry.customerPhone) {
    return {
      success: false,
      reason: 'missing_customer_details',
      message: 'An enquiry must have a customer name or contact number.',
    }
  }

  enquiries[index] = updatedEnquiry

  if (!writeEnquiries(enquiries)) {
    return {
      success: false,
      reason: 'storage_error',
      message: 'The enquiry could not be updated.',
    }
  }

  return {
    success: true,
    enquiry: updatedEnquiry,
  }
}

export function deleteEnquiry(id) {
  const enquiries = readEnquiries()
  const updatedEnquiries = enquiries.filter((item) => item.id !== id)

  if (updatedEnquiries.length === enquiries.length) {
    return {
      success: false,
      reason: 'not_found',
      message: 'Enquiry not found.',
    }
  }

  if (!writeEnquiries(updatedEnquiries)) {
    return {
      success: false,
      reason: 'storage_error',
      message: 'The enquiry could not be deleted.',
    }
  }

  return { success: true }
}
