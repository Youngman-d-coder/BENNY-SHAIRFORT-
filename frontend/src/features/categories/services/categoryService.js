
import { DEFAULT_CATEGORIES } from '../data/defaultCategories'
import { DEMO_PRODUCTS } from '../../catalogue/data/demoProducts'

const CATEGORY_STORAGE_KEY = 'bennyshairfort_mock_categories'
const PRODUCT_STORAGE_KEY = 'bennyshairfort_mock_products'

function createSlug(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function readProducts() {
  try {
    const stored = localStorage.getItem(PRODUCT_STORAGE_KEY)

    if (stored === null) {
      return structuredClone(DEMO_PRODUCTS)
    }

    const products = JSON.parse(stored)

    return Array.isArray(products)
      ? products
      : structuredClone(DEMO_PRODUCTS)
  } catch (error) {
    console.error('Could not load products:', error)
    return structuredClone(DEMO_PRODUCTS)
  }
}

function saveProducts(products) {
  try {
    localStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(products),
    )
    return true
  } catch (error) {
    console.error('Could not save products:', error)
    return false
  }
}

function saveCategories(categories) {
  try {
    localStorage.setItem(
      CATEGORY_STORAGE_KEY,
      JSON.stringify(categories),
    )
    return true
  } catch (error) {
    console.error('Could not save categories:', error)
    return false
  }
}

/**
 * Loads saved categories or initializes the default categories.
 * Also preserves categories belonging to existing products.
 */
function readCategories() {
  try {
    const stored = localStorage.getItem(CATEGORY_STORAGE_KEY)

    if (stored !== null) {
      const categories = JSON.parse(stored)

      if (Array.isArray(categories)) {
        return categories
      }
    }
  } catch (error) {
    console.error('Could not load categories:', error)
  }

  const categories = structuredClone(DEFAULT_CATEGORIES)
  const products = readProducts()

  for (const product of products) {
    const existing = product.category

    if (!existing?.name) continue

    const slug = createSlug(existing.slug || existing.name)

    if (!slug) continue

    if (categories.some((category) => category.slug === slug)) {
      continue
    }

    categories.push({
      id: existing.id || `category-${slug}`,
      name: existing.name.trim(),
      slug,
      description: '',
      isActive: true,
      isDemo: Boolean(product.isDemo),
      createdAt: null,
    })
  }

  saveCategories(categories)

  return categories
}

function isSlugTaken(slug, categories, excludedId = null) {
  return categories.some(
    (category) =>
      category.slug === slug && category.id !== excludedId,
  )
}

function categoryHasProducts(category, products) {
  return products.some(
    (product) =>
      product.category?.id === category.id ||
      product.category?.slug === category.slug,
  )
}

/**
 * Updates the embedded category information on existing products.
 * Supports both old products without category IDs and newer records.
 */
function synchronizeProducts(oldCategory, updatedCategory) {
  const products = readProducts()

  const updatedProducts = products.map((product) => {
    const belongsToCategory =
      product.category?.id === oldCategory.id ||
      product.category?.slug === oldCategory.slug

    if (!belongsToCategory) return product

    return {
      ...product,
      category: {
        id: updatedCategory.id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
      },
    }
  })

  return saveProducts(updatedProducts)
}

export function getCategories() {
  return structuredClone(readCategories())
}

export function getActiveCategories() {
  return getCategories().filter(
    (category) => category.isActive,
  )
}

export function getCategoryById(id) {
  return getCategories().find(
    (category) => category.id === id,
  ) ?? null
}

export function getCategoryBySlug(slug) {
  return getCategories().find(
    (category) => category.slug === slug,
  ) ?? null
}

export function getCategoryProductCount(categoryId) {
  const category = getCategoryById(categoryId)

  if (!category) return 0

  return readProducts().filter(
    (product) =>
      product.category?.id === category.id ||
      product.category?.slug === category.slug,
  ).length
}

export function createCategory(data = {}) {
  const categories = readCategories()

  const name = String(data.name ?? '').trim()
  const slug = createSlug(name)

  if (!name || !slug) {
    return {
      success: false,
      message: 'Enter a valid category name.',
    }
  }

  if (isSlugTaken(slug, categories)) {
    return {
      success: false,
      message: 'This category already exists.',
    }
  }

  const category = {
    id: crypto.randomUUID(),
    name,
    slug,
    description: String(data.description ?? '').trim(),
    isActive: true,
    isDemo: false,
    createdAt: new Date().toISOString(),
  }

  if (!saveCategories([category, ...categories])) {
    return {
      success: false,
      message: 'Could not save the category.',
    }
  }

  return {
    success: true,
    category: structuredClone(category),
  }
}

export function updateCategory(id, updates = {}) {
  const categories = readCategories()
  const index = categories.findIndex(
    (category) => category.id === id,
  )

  if (index === -1) {
    return {
      success: false,
      message: 'Category not found.',
    }
  }

  const existing = categories[index]
  const name = updates.name !== undefined
    ? String(updates.name).trim()
    : existing.name

  const slug = updates.name !== undefined
    ? createSlug(name)
    : existing.slug

  if (!name || !slug) {
    return {
      success: false,
      message: 'Enter a valid category name.',
    }
  }

  if (isSlugTaken(slug, categories, id)) {
    return {
      success: false,
      message: 'Another category already uses this name.',
    }
  }

  const updatedCategory = {
    ...existing,
    name,
    slug,
    description: updates.description !== undefined
      ? String(updates.description).trim()
      : existing.description,
    isActive: updates.isActive !== undefined
      ? Boolean(updates.isActive)
      : existing.isActive,
  }

  if (!synchronizeProducts(existing, updatedCategory)) {
    return {
      success: false,
      message: 'Could not update the products in this category.',
    }
  }

  const updatedCategories = [...categories]
  updatedCategories[index] = updatedCategory

  if (!saveCategories(updatedCategories)) {
    return {
      success: false,
      message: 'Could not save the category changes.',
    }
  }

  return {
    success: true,
    category: structuredClone(updatedCategory),
  }
}

export function deleteCategory(id) {
  const categories = readCategories()
  const category = categories.find(
    (item) => item.id === id,
  )

  if (!category) {
    return {
      success: false,
      message: 'Category not found.',
    }
  }

  if (categoryHasProducts(category, readProducts())) {
    return {
      success: false,
      message: "Reassign or remove this category's products before deleting it.",
    }
  }

  const updatedCategories = categories.filter(
    (item) => item.id !== id,
  )

  if (!saveCategories(updatedCategories)) {
    return {
      success: false,
      message: 'Could not delete the category.',
    }
  }

  return { success: true }
}
