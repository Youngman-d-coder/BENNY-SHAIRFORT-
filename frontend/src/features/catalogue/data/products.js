
/**
 * Backward-compatible catalogue data access.
 *
 * Product records are managed by productService.
 * This file preserves existing imports while the
 * storefront is migrated to the shared data source.
 */

import {
  getPublicProducts,
  getFeaturedProducts as getSharedFeaturedProducts,
  getProductBySlug as getSharedProductBySlug,
} from '../services/productService'

export function getProducts() {
  return getPublicProducts()
}

export function getFeaturedProducts() {
  return getSharedFeaturedProducts()
}

export function getProductBySlug(slug) {
  const product = getSharedProductBySlug(slug)

  if (!product || product.status === 'hidden') {
    return null
  }

  return product
}
