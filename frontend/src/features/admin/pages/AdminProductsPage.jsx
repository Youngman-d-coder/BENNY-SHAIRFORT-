
import { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Package,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
} from 'lucide-react'

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  PRODUCT_STATUSES,
} from '../../catalogue/services/productService'

const STATUS_LABELS = {
  available: 'Available',
  sold_out: 'Sold out',
  reserved: 'Reserved',
  hidden: 'Hidden',
  coming_soon: 'Coming soon',
}

const STATUS_STYLES = {
  available: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  sold_out: 'border-red-500/30 bg-red-500/10 text-red-400',
  reserved: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  hidden: 'border-white/10 bg-white/5 text-white/40',
  coming_soon: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
}

const EMPTY_FORM = {
  name: '',
  categoryName: '',
  description: '',
  price: '',
  status: PRODUCT_STATUSES.AVAILABLE,
  isFeatured: false,
  isNewArrival: false,
}

function formatPrice(priceKobo) {
  if (priceKobo === null || priceKobo === undefined) {
    return 'Price not set'
  }

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(priceKobo / 100)
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState(() => getProducts())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [feedback, setFeedback] = useState('')

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category?.name?.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' ||
        product.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [products, search, statusFilter])

  const counts = useMemo(() => ({
    total: products.length,
    available: products.filter(
      (product) => product.status === PRODUCT_STATUSES.AVAILABLE,
    ).length,
    hidden: products.filter(
      (product) => product.status === PRODUCT_STATUSES.HIDDEN,
    ).length,
    soldOut: products.filter(
      (product) => product.status === PRODUCT_STATUSES.SOLD_OUT,
    ).length,
  }), [products])

  function refreshProducts() {
    setProducts(getProducts())
  }

  function openCreateForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFeedback('')
    setIsFormOpen(true)
  }

  function openEditForm(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      categoryName: product.category?.name ?? '',
      description: product.description ?? '',
      price: product.priceKobo !== null
        ? String(product.priceKobo / 100)
        : '',
      status: product.status ?? PRODUCT_STATUSES.AVAILABLE,
      isFeatured: Boolean(product.isFeatured),
      isNewArrival: Boolean(product.isNewArrival),
    })
    setFeedback('')
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setFeedback('')

    const priceKobo = form.price.trim() === ''
      ? null
      : Math.round(Number(form.price) * 100)

    if (
      priceKobo !== null &&
      (!Number.isSafeInteger(priceKobo) || priceKobo < 0)
    ) {
      setFeedback('Enter a valid non-negative price.')
      return
    }

    const data = {
      name: form.name.trim(),
      category: {
        name: form.categoryName.trim(),
      },
      description: form.description.trim(),
      priceKobo,
      status: form.status,
      isFeatured: form.isFeatured,
      isNewArrival: form.isNewArrival,
    }

    const result = editingId
      ? updateProduct(editingId, data)
      : createProduct(data)

    if (!result.success) {
      setFeedback(result.message)
      return
    }

    refreshProducts()
    closeForm()
    setFeedback(editingId ? 'Product updated successfully.' : 'Product created successfully.')
  }

  function handleDelete(product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    )

    if (!confirmed) return

    const result = deleteProduct(product.id)

    if (!result.success) {
      setFeedback(result.message)
      return
    }

    refreshProducts()
    setFeedback('Product deleted successfully.')
  }

  function toggleVisibility(product) {
    const nextStatus = product.status === PRODUCT_STATUSES.HIDDEN
      ? PRODUCT_STATUSES.AVAILABLE
      : PRODUCT_STATUSES.HIDDEN

    const result = updateProduct(product.id, {
      status: nextStatus,
    })

    if (!result.success) {
      setFeedback(result.message)
      return
    }

    refreshProducts()
    setFeedback(
      nextStatus === PRODUCT_STATUSES.HIDDEN
        ? 'Product hidden from the storefront.'
        : 'Product is now visible on the storefront.',
    )
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs tracking-[0.3em] text-gold">
            INVENTORY MANAGEMENT
          </p>
          <h1 className="mt-3 font-display text-3xl text-champagne md:text-4xl">
            Products<span className="text-gold">.</span>
          </h1>
          <p className="mt-3 text-sm text-white/45">
            Manage your catalogue, pricing and product availability.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-champagne"
        >
          <Plus size={17} />
          Add product
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total products', value: counts.total },
          { label: 'Available', value: counts.available },
          { label: 'Sold out', value: counts.soldOut },
          { label: 'Hidden', value: counts.hidden },
        ].map((item) => (
          <div
            key={item.label}
            className="border border-white/10 bg-[#171319] p-5"
          >
            <p className="text-xs text-white/45">{item.label}</p>
            <p className="mt-3 font-display text-3xl text-champagne">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {feedback && (
        <div
          role="status"
          className="flex items-center justify-between gap-4 border border-gold/20 bg-gold/5 px-5 py-3 text-sm text-gold"
        >
          {feedback}
          <button
            type="button"
            onClick={() => setFeedback('')}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products or categories..."
            aria-label="Search products"
            className="h-12 w-full border border-white/10 bg-[#171319] pl-11 pr-4 text-sm text-champagne outline-none focus:border-gold/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by product status"
          className="h-12 border border-white/10 bg-[#171319] px-4 text-sm text-champagne outline-none focus:border-gold/50"
        >
          <option value="all">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden border border-white/10 bg-[#171319]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-medium text-champagne">
            Product inventory
          </h2>
          <span className="text-xs text-white/40">
            {filteredProducts.length} products
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package size={30} className="mx-auto text-gold/60" />
            <p className="mt-4 text-sm text-champagne">
              No products found.
            </p>
            <p className="mt-2 text-xs text-white/40">
              Try another search or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-white/10 text-[10px] uppercase tracking-wider text-white/40">
                <tr>
                  <th className="px-5 py-4 font-medium">Product</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Price</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-5">
                      <div className="font-medium text-champagne">
                        {product.name}
                      </div>
                      <div className="mt-1 text-xs text-white/35">
                        {product.isDemo ? 'Demonstration product' : 'Custom product'}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-sm text-white/55">
                      {product.category?.name || 'Uncategorised'}
                    </td>
                    <td className="px-5 py-5 text-sm text-champagne">
                      {formatPrice(product.priceKobo)}
                    </td>
                    <td className="px-5 py-5">
                      <span className={`inline-flex border px-3 py-1 text-[10px] tracking-wide ${STATUS_STYLES[product.status] ?? STATUS_STYLES.hidden}`}>
                        {STATUS_LABELS[product.status] ?? 'Unspecified'}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          className="p-2 text-white/45 transition-colors hover:text-gold"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleVisibility(product)}
                          title={product.status === PRODUCT_STATUSES.HIDDEN ? 'Show product' : 'Hide product'}
                          aria-label={product.status === PRODUCT_STATUSES.HIDDEN ? `Show ${product.name}` : `Hide ${product.name}`}
                          className="p-2 text-white/45 transition-colors hover:text-gold"
                        >
                          {product.status === PRODUCT_STATUSES.HIDDEN
                            ? <Eye size={16} />
                            : <EyeOff size={16} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          className="p-2 text-white/45 transition-colors hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 py-10">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
            className="my-auto w-full max-w-2xl border border-white/10 bg-[#171319] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-[10px] tracking-[0.25em] text-gold">
                  INVENTORY
                </p>
                <h2
                  id="product-form-title"
                  className="mt-2 font-display text-2xl text-champagne"
                >
                  {editingId ? 'Edit product' : 'Add product'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close product form"
                className="text-white/45 hover:text-champagne"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-xs text-white/55">
                  Product name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="e.g. Signature Straight"
                  className="h-12 w-full border border-white/10 bg-black/20 px-4 text-sm text-champagne outline-none focus:border-gold/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/55">
                  Category *
                </label>
                <input
                  required
                  value={form.categoryName}
                  onChange={(event) => updateField('categoryName', event.target.value)}
                  placeholder="e.g. Bone Straight"
                  className="h-12 w-full border border-white/10 bg-black/20 px-4 text-sm text-champagne outline-none focus:border-gold/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-white/55">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  placeholder="Describe this product..."
                  className="w-full border border-white/10 bg-black/20 p-4 text-sm text-champagne outline-none focus:border-gold/50"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-white/55">
                    Price (NGN)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    placeholder="Leave blank if unconfirmed"
                    className="h-12 w-full border border-white/10 bg-black/20 px-4 text-sm text-champagne outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs text-white/55">
                    Availability
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) => updateField('status', event.target.value)}
                    className="h-12 w-full border border-white/10 bg-[#171319] px-4 text-sm text-champagne outline-none focus:border-gold/50"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-5">
                <label className="flex items-center gap-3 text-sm text-champagne/70">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) => updateField('isFeatured', event.target.checked)}
                    className="accent-[#C5A15B]"
                  />
                  Feature this product
                </label>

                <label className="flex items-center gap-3 text-sm text-champagne/70">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(event) => updateField('isNewArrival', event.target.checked)}
                    className="accent-[#C5A15B]"
                  />
                  Mark as a new arrival
                </label>
              </div>

              <p className="text-xs leading-6 text-white/35">
                Product images, variations and additional specifications
                will be added in a later inventory-management step.
              </p>

              {feedback && (
                <p role="alert" className="text-sm text-red-400">
                  {feedback}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="border border-white/15 px-5 py-3 text-xs text-champagne/65 hover:border-white/30"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-gold px-6 py-3 text-xs font-semibold tracking-wider text-obsidian hover:bg-champagne"
                >
                  {editingId ? 'SAVE CHANGES' : 'CREATE PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
