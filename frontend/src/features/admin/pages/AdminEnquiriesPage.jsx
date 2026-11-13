
import { useMemo, useState } from 'react'
import {
  ClipboardList,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  UserRound,
} from 'lucide-react'

import {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  ENQUIRY_STATUSES,
  ENQUIRY_SOURCES,
} from '../../enquiries/services/enquiryManagementService'

const STATUS_OPTIONS = [
  { value: ENQUIRY_STATUSES.NEW, label: 'New' },
  { value: ENQUIRY_STATUSES.CONTACTED, label: 'Contacted' },
  { value: ENQUIRY_STATUSES.ORDER_CONFIRMED, label: 'Order Confirmed' },
  { value: ENQUIRY_STATUSES.COMPLETED, label: 'Completed' },
  { value: ENQUIRY_STATUSES.CANCELLED, label: 'Cancelled' },
]

const SOURCE_OPTIONS = [
  { value: ENQUIRY_SOURCES.WHATSAPP, label: 'WhatsApp' },
  { value: ENQUIRY_SOURCES.PHONE, label: 'Phone' },
  { value: ENQUIRY_SOURCES.INSTAGRAM, label: 'Instagram' },
  { value: ENQUIRY_SOURCES.WALK_IN, label: 'Walk-in' },
  { value: ENQUIRY_SOURCES.OTHER, label: 'Other' },
]

const EMPTY_FORM = {
  customerName: '',
  customerPhone: '',
  source: ENQUIRY_SOURCES.WHATSAPP,
  notes: '',
}

function formatDate(timestamp) {
  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) return 'Unknown date'

  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function getStatusLabel(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status
}

function getSourceLabel(source) {
  return SOURCE_OPTIONS.find((item) => item.value === source)?.label ?? source
}

function MetricCard({ label, value, description }) {
  return (
    <article className="border border-white/10 bg-[#171319] p-6">
      <p className="text-xs tracking-wider text-champagne/45">{label}</p>
      <p className="mt-5 font-display text-4xl text-champagne">
        {value.toLocaleString('en-NG')}
      </p>
      <p className="mt-2 text-xs text-champagne/35">{description}</p>
    </article>
  )
}

function EnquiryStatus({ status, onChange }) {
  return (
    <select
      value={status}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Enquiry status"
      className="border border-white/15 bg-[#171319] px-3 py-2 text-xs text-champagne outline-none focus:border-gold"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function CreateEnquiryForm({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const result = createEnquiry(form)

    if (!result.success) {
      setError(result.message || 'Could not create enquiry.')
      return
    }

    onCreated()
  }

  const inputClass =
    'w-full border border-white/10 bg-obsidian px-4 py-3 text-sm text-champagne outline-none placeholder:text-champagne/25 focus:border-gold/50'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-enquiry-title"
        className="my-auto w-full max-w-xl border border-gold/20 bg-[#171319] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] text-gold">
              CUSTOMER MANAGEMENT
            </p>

            <h2
              id="create-enquiry-title"
              className="mt-3 font-display text-2xl text-champagne"
            >
              Register an Enquiry
            </h2>

            <p className="mt-2 text-sm leading-6 text-champagne/45">
              Record an enquiry Benita has actually received.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-champagne/50 hover:text-gold"
          >
            CLOSE
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-xs text-champagne/60">
              Customer name
            </label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-champagne/60">
              Contact number
            </label>
            <input
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleChange}
              placeholder="Enter customer phone number"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs text-champagne/60">
              Enquiry source
            </label>
            <select
              name="source"
              value={form.source}
              onChange={handleChange}
              className={inputClass}
            >
              {SOURCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs text-champagne/60">
              Internal notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Add details about the customer's enquiry..."
              className={inputClass}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/15 px-5 py-3 text-xs tracking-wider text-champagne/70 hover:border-gold/50"
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 bg-gold px-5 py-3 text-xs font-semibold tracking-wider text-obsidian hover:bg-champagne"
            >
              <Plus size={15} />
              SAVE ENQUIRY
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState(getEnquiries)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [notesDraft, setNotesDraft] = useState({})

  function refreshEnquiries() {
    setEnquiries(getEnquiries())
  }

  function handleStatusChange(id, status) {
    const result = updateEnquiry(id, { status })

    if (result.success) {
      refreshEnquiries()
    }
  }

  function handleNotesSave(enquiry) {
    const result = updateEnquiry(enquiry.id, {
      notes: notesDraft[enquiry.id] ?? enquiry.notes,
    })

    if (result.success) {
      refreshEnquiries()
      setExpandedId(null)
    }
  }

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase()

    return enquiries.filter((enquiry) => {
      const matchesStatus =
        statusFilter === 'all' || enquiry.status === statusFilter

      const matchesSearch =
        !query ||
        [
          enquiry.customerName,
          enquiry.customerPhone,
          enquiry.product?.name,
        ].some((value) => String(value ?? '').toLowerCase().includes(query))

      return matchesStatus && matchesSearch
    })
  }, [enquiries, search, statusFilter])

  const metrics = useMemo(() => ({
    total: enquiries.length,
    new: enquiries.filter(
      (item) => item.status === ENQUIRY_STATUSES.NEW
    ).length,
    active: enquiries.filter(
      (item) =>
        item.status === ENQUIRY_STATUSES.CONTACTED ||
        item.status === ENQUIRY_STATUSES.ORDER_CONFIRMED
    ).length,
    completed: enquiries.filter(
      (item) => item.status === ENQUIRY_STATUSES.COMPLETED
    ).length,
  }), [enquiries])

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-3 text-xs tracking-[0.3em] text-gold">
            CUSTOMER RELATIONSHIPS
          </p>

          <h1 className="font-display text-3xl text-champagne md:text-4xl">
            Enquiries
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-champagne/45">
            Keep track of customer conversations and follow each enquiry
            through to completion.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-3 bg-gold px-5 py-3 text-xs font-semibold tracking-wider text-obsidian transition-colors hover:bg-champagne"
        >
          <Plus size={16} />
          NEW ENQUIRY
        </button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="TOTAL ENQUIRIES"
          value={metrics.total}
          description="Manually registered records"
        />

        <MetricCard
          label="NEW ENQUIRIES"
          value={metrics.new}
          description="Awaiting first contact"
        />

        <MetricCard
          label="ACTIVE ENQUIRIES"
          value={metrics.active}
          description="Contacted or order confirmed"
        />

        <MetricCard
          label="COMPLETED"
          value={metrics.completed}
          description="Successfully completed"
        />
      </div>

      <section className="mt-10 border border-white/10 bg-[#171319]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div>
            <h2 className="font-display text-xl text-champagne">
              Customer Records
            </h2>
            <p className="mt-1 text-xs text-champagne/35">
              {filteredEnquiries.length} matching records
            </p>
          </div>

          <button
            type="button"
            onClick={refreshEnquiries}
            className="inline-flex items-center gap-2 text-xs text-champagne/50 hover:text-gold"
          >
            <RefreshCw size={14} />
            REFRESH
          </button>
        </div>

        <div className="grid gap-3 border-b border-white/10 p-5 sm:grid-cols-[1fr_220px] sm:p-6">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-champagne/35"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, phone or product..."
              className="w-full border border-white/10 bg-obsidian py-3 pl-11 pr-4 text-sm text-champagne outline-none placeholder:text-champagne/25 focus:border-gold/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter enquiries by status"
            className="border border-white/10 bg-obsidian px-4 py-3 text-sm text-champagne outline-none focus:border-gold/50"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {filteredEnquiries.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center border border-gold/20 bg-gold/5 text-gold">
              <ClipboardList size={23} />
            </div>

            <h3 className="mt-5 font-display text-xl text-champagne">
              {enquiries.length === 0
                ? 'No enquiries recorded yet'
                : 'No matching enquiries'}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-champagne/40">
              {enquiries.length === 0
                ? 'When a customer makes an enquiry, register it here to keep track of the conversation.'
                : 'Try another search term or change the status filter.'}
            </p>

            {enquiries.length === 0 && (
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="mt-6 text-xs font-semibold tracking-wider text-gold hover:text-champagne"
              >
                REGISTER YOUR FIRST ENQUIRY
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredEnquiries.map((enquiry) => (
              <article key={enquiry.id} className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/20 bg-gold/5 text-gold">
                      <UserRound size={19} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-champagne">
                        {enquiry.customerName || 'Unnamed customer'}
                      </h3>

                      <p className="mt-1 text-xs text-champagne/45">
                        {enquiry.customerPhone || 'No contact number'}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-champagne/35">
                        <span>{getSourceLabel(enquiry.source)}</span>
                        <span>{formatDate(enquiry.receivedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <EnquiryStatus
                    status={enquiry.status}
                    onChange={(status) =>
                      handleStatusChange(enquiry.id, status)
                    }
                  />
                </div>

                <div className="mt-5 border-t border-white/5 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-champagne/50">
                      <span className="text-champagne/30">Product: </span>
                      {enquiry.product?.name || 'Not linked'}
                      {enquiry.variant?.label
                        ? ` · ${enquiry.variant.label}`
                        : ''}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setExpandedId(
                          expandedId === enquiry.id ? null : enquiry.id
                        )
                        setNotesDraft((current) => ({
                          ...current,
                          [enquiry.id]: enquiry.notes ?? '',
                        }))
                      }}
                      className="text-xs text-gold hover:text-champagne"
                    >
                      {expandedId === enquiry.id
                        ? 'CLOSE DETAILS'
                        : 'VIEW DETAILS'}
                    </button>
                  </div>

                  {expandedId === enquiry.id && (
                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="mb-2 block text-xs text-champagne/50">
                          Internal notes
                        </label>

                        <textarea
                          rows={3}
                          value={notesDraft[enquiry.id] ?? ''}
                          onChange={(event) =>
                            setNotesDraft((current) => ({
                              ...current,
                              [enquiry.id]: event.target.value,
                            }))
                          }
                          placeholder="Record follow-up details..."
                          className="w-full border border-white/10 bg-obsidian p-4 text-sm text-champagne outline-none placeholder:text-champagne/25 focus:border-gold/50"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[11px] text-champagne/30">
                          Last updated: {formatDate(enquiry.updatedAt)}
                        </p>

                        <button
                          type="button"
                          onClick={() => handleNotesSave(enquiry)}
                          className="bg-gold px-4 py-2 text-xs font-semibold text-obsidian hover:bg-champagne"
                        >
                          SAVE NOTES
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 flex items-start gap-3 border border-gold/15 bg-gold/5 p-5">
        <MessageCircle size={17} className="mt-0.5 shrink-0 text-gold" />
        <p className="text-xs leading-6 text-champagne/55">
          Enquiry records are manually registered and stored temporarily
          in this browser. WhatsApp clicks are tracked separately and
          are not automatically treated as received enquiries.
        </p>
      </div>

      {showCreateForm && (
        <CreateEnquiryForm
          onClose={() => setShowCreateForm(false)}
          onCreated={() => {
            refreshEnquiries()
            setShowCreateForm(false)
          }}
        />
      )}
    </section>
  )
}
