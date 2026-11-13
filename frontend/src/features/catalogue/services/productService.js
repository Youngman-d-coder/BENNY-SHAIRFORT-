
import { DEMO_PRODUCTS } from '../data/demoProducts'

export const PRODUCT_STATUSES = {
  AVAILABLE: 'available',
  SOLD_OUT: 'sold_out',
  RESERVED: 'reserved',
  HIDDEN: 'hidden',
  COMING_SOON: 'coming_soon',
}

const VALID_STATUSES = Object.values(PRODUCT_STATUSES)
const STORAGE_KEY = 'bennyshairfort_mock_products'

function clone(value) {
  return structuredClone(value)
}

function createSlug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function readProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored === null) {
      return clone(DEMO_PRODUCTS)
    }

    const products = JSON.parse(stored)

    return Array.isArray(products) ? products : clone(DEMO_PRODUCTS)
  } catch (error) {
    console.error('Could not load products:', error)
    return clone(DEMO_PRODUCTS)
  }
}

function writeProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    return true
  } catch (error) {
    console.error('Could not save products:', error)
    return false
  }
}

function validateProduct(product) {
  if (!String(product.name ?? '').trim()) {
    return 'Product name is required.'
  }

  if (
    !product.category?.name?.trim() ||
    !product.category?.slug?.trim()
  ) {
    return 'A valid product category is required.'
  }

  if (!product.slug?.trim()) {
    return 'A product URL slug is required.'
  }

  if (
    product.status !== null &&
    !VALID_STATUSES.includes(product.status)
  ) {
    return 'Select a valid product status.'
  }

  for (const field of ['priceKobo', 'compareAtPriceKobo']) {
    const value = product[field]

    if (
      value !== null &&
      value !== undefined &&
      (!Number.isSafeInteger(value) || value < 0)
    ) {
      return 'Product prices must be non-negative integer values in kobo.'
    }
  }

  if (!Array.isArray(product.variants)) {
    return 'Product variations must be an array.'
  }

  return null
}

function isSlugTaken(slug, products, excludedId = null) {
  return products.some(
    (product) =>
      product.slug === slug && product.id !== excludedId,
  )
}

/**
 * Returns every product, including hidden products.
 * Intended for administrative use.
 */
export function getProducts() {
  return clone(readProducts())
}

/**
 * Returns products intended for public storefront display.
 */
export function getPublicProducts() {
  return getProducts().filter(
    (product) => product.status !== PRODUCT_STATUSES.HIDDEN,
  )
}

export function getProductById(id) {
  return getProducts().find((product) => product.id === id) ?? null
}

export function getProductBySlug(slug) {
  return getProducts().find((product) => product.slug === slug) ?? null
}

export function getFeaturedProducts() {
  return getPublicProducts().filter(
    (product) => product.isFeatured,
  )
}

export function createProduct(data = {}) {
  const products = readProducts()

  const name = String(data.name ?? '').trim()
  const slug = createSlug(data.slug || name)

  if (!slug) {
    return {
      success: false,
      message: 'A valid product name is required.',
    }
  }

  if (isSlugTaken(slug, products)) {
    return {
      success: false,
      message: 'A product with this URL slug already exists.',
    }
  }

  const product = {
    id: crypto.randomUUID(),
    slug,
    name,
    category: {
      name: String(data.category?.name ?? '').trim(),
      slug: createSlug(
        data.category?.slug || data.category?.name || '',
      ),
    },
    badge: String(data.badge ?? '').trim(),
    description: String(data.description ?? '').trim(),
    image: data.image ?? null,
    priceKobo: data.priceKobo ?? null,
    compareAtPriceKobo: data.compareAtPriceKobo ?? null,
    status: data.status ?? PRODUCT_STATUSES.AVAILABLE,
    variants: clone(data.variants ?? []),
    isFeatured: Boolean(data.isFeatured),
    isNewArrival: Boolean(data.isNewArrival),
    isDemo: false,
  }

  const validationError = validateProduct(product)

  if (validationError) {
    return {
      success: false,
      message: validationError,
    }
  }

  if (!writeProducts([product, ...products])) {
    return {
      success: false,
      message: 'The product could not be saved.',
    }
  }

  return {
    success: true,
    product: clone(product),
  }
}

export function updateProduct(id, updates = {}) {
  const products = readProducts()
  const index = products.findIndex((product) => product.id === id)

  if (index === -1) {
    return {
      success: false,
      message: 'Product not found.',
    }
  }

  const existing = products[index]

  const updatedProduct = {
    ...existing,
    ...updates,
    category: updates.category
      ? {
          ...existing.category,
          ...updates.category,
        }
      : existing.category,
    variants: updates.variants !== undefined
      ? clone(updates.variants)
      : existing.variants,
  }

  if (updates.name !== undefined) {
    updatedProduct.name = String(updates.name).trim()
  }

  if (updates.slug !== undefined) {
    updatedProduct.slug = createSlug(updates.slug)
  }

  if (isSlugTaken(updatedProduct.slug, products, id)) {
    return {
      success: false,
      message: 'A product with this URL slug already exists.',
    }
  }

  const validationError = validateProduct(updatedProduct)

  if (validationError) {
    return {
      success: false,
      message: validationError,
    }
  }

  products[index] = updatedProduct

  if (!writeProducts(products)) {
    return {
      success: false,
      message: 'The product could not be updated.',
    }
  }

  return {
    success: true,
    product: clone(updatedProduct),
  }
}

export function deleteProduct(id) {
  const products = readProducts()
  const updatedProducts = products.filter(
    (product) => product.id !== id,
  )

  if (updatedProducts.length === products.length) {
    return {
      success: false,
      message: 'Product not found.',
    }
  }

  if (!writeProducts(updatedProducts)) {
    return {
      success: false,
      message: 'The product could not be deleted.',
    }
  }

  return { success: true }
}
