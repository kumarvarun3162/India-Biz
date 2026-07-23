import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategorySelector from '../components/listing/CategorySelector'
import BusinessHoursBuilder from '../components/listing/BusinessHoursBuilder'
import InputField from '../components/common/InputField'
import { createListing } from '../api/listings'

// ── Template data (matches backend category_templates.py) ────────────────────
const TEMPLATES = {
  restaurant:  { desc: 'Authentic home-style meals served fresh daily. We specialize in [cuisine type] cuisine with recipes passed down through generations.', hours: defaultHours('08:00','22:00') },
  grocery:     { desc: 'Your one-stop neighbourhood kirana store stocking fresh groceries, daily essentials, and household items.', hours: defaultHours('07:00','21:00') },
  mechanic:    { desc: 'Full-service automobile repair and maintenance workshop. Specializing in engine overhaul, AC service, denting & painting.', hours: defaultHours('09:00','19:00') },
  salon:       { desc: 'Professional beauty and grooming services for men and women. Haircuts, colouring, facials, threading, and bridal makeup.', hours: defaultHours('10:00','20:00') },
  medical:     { desc: 'Licensed pharmacy stocking prescription medicines, OTC drugs, and healthcare products. Registered pharmacist on duty.', hours: defaultHours('08:00','22:00') },
  tailor:      { desc: 'Expert tailoring and stitching services for all occasions. Custom measurements, quick delivery. Alterations also accepted.', hours: defaultHours('09:30','20:00') },
  electronics: { desc: 'Authorised repair centre for smartphones and laptops. Screen replacement, battery replacement, data recovery. 30-day warranty.', hours: defaultHours('10:00','20:00') },
  tutor:       { desc: 'Professional coaching for [subjects/board exams]. Small batch sizes for personalised attention. Demo class free.', hours: defaultHours('06:00','20:00') },
  hardware:    { desc: 'Complete hardware and building materials store. Paints, pipes, electrical items, power tools, cement, and tiles.', hours: defaultHours('08:00','20:00') },
  other:       { desc: 'Tell customers what your business does, what makes you unique, and why they should choose you.', hours: defaultHours('09:00','18:00') },
}

function defaultHours(open, close) {
  const day = { open, close, closed: false }
  return { mon: day, tue: day, wed: day, thu: day, fri: day, sat: day, sun: { ...day, closed: true } }
}

const DEFAULT_FORM = {
  business_name: '',
  category:      '',
  description:   '',
  address:       '',
  city:          '',
  state:         '',
  pincode:       '',
  phone:         '',
  whatsapp:      '',
  email:         '',
  website:       '',
  hours:         defaultHours('09:00', '18:00'),
}

export default function CreateListing() {
  const navigate = useNavigate()
  const [step, setStep]           = useState(1)   // 1 | 2 | 3
  const [form, setForm]           = useState(DEFAULT_FORM)
  const [errors, setErrors]       = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Field updater ──────────────────────────────────────────────────────────
  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  // ── Category select — auto-fill description + hours ────────────────────────
  const handleCategorySelect = (slug) => {
    const tpl = TEMPLATES[slug] || TEMPLATES.other
    setForm((p) => ({
      ...p,
      category:    slug,
      description: tpl.desc,
      hours:       tpl.hours,
    }))
  }

  // ── Step 1 validation ──────────────────────────────────────────────────────
  const validateStep1 = () => {
    if (!form.category) return { category: 'Please select a business category' }
    return {}
  }

  // ── Step 2 validation ──────────────────────────────────────────────────────
  const validateStep2 = () => {
    const e = {}
    if (!form.business_name.trim()) e.business_name = 'Business name is required'
    if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters'
    if (!form.address.trim())  e.address  = 'Address is required'
    if (!form.city.trim())     e.city     = 'City is required'
    if (!form.state.trim())    e.state    = 'State is required'
    if (!/^\d{6}$/.test(form.pincode))     e.pincode = 'Enter a valid 6-digit pincode'
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone   = 'Enter a valid 10-digit mobile number'
    return e
  }

  const goNext = () => {
    const e = step === 1 ? validateStep1() : validateStep2()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setStep((s) => s + 1)
  }

  // ── Final submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setIsSubmitting(true)
    try {
      await createListing(form)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Something went wrong. Please try again.')
      setStep(2)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Step indicator ─────────────────────────────────────────────────────────
  const steps = ['Category', 'Details', 'Hours']

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Create your listing
        </h1>
        <p className="text-sm text-gray-500">
          Get your business found on Google in under 10 minutes
        </p>
      </div>

      {/* Step pills */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, i) => {
          const n = i + 1
          const done    = step > n
          const current = step === n
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`
                flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium
                transition-all
                ${current ? 'bg-saffron-600 text-white'
                  : done   ? 'bg-green-100 text-green-700'
                  :          'bg-gray-100 text-gray-400'}
              `}>
                <span className="text-xs">{done ? '✓' : n}</span>
                {label}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px w-6 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {serverError && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {serverError}
          </div>
        )}

        {/* ── STEP 1 — Category ── */}
        {step === 1 && (
          <div>
            <h2 className="font-medium text-gray-800 mb-1">
              What type of business is this?
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              We'll auto-fill a professional description based on your choice
            </p>
            <CategorySelector
              selected={form.category}
              onSelect={handleCategorySelect}
            />
            {errors.category && (
              <p className="text-sm text-red-500 mt-3">{errors.category}</p>
            )}
            {form.category && (
              <div className="mt-5 px-4 py-3 bg-saffron-50 border border-saffron-200 rounded-xl text-sm text-saffron-700">
                ✨ Template auto-filled for <strong>{form.category}</strong> — you can edit it in the next step
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2 — Business details ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="font-medium text-gray-800 -mb-2">Business information</h2>
            <InputField label="Business name" id="business_name"
              value={form.business_name} onChange={set('business_name')}
              placeholder="e.g. Varun Hardware Store"
              error={errors.business_name} required />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={set('description')}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-900
                  placeholder:text-gray-400 outline-none resize-none transition-all
                  focus:ring-2 focus:ring-saffron-600 focus:border-saffron-600
                  ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="City" id="city" value={form.city}
                onChange={set('city')} placeholder="Ambala"
                error={errors.city} required />
              <InputField label="State" id="state" value={form.state}
                onChange={set('state')} placeholder="Haryana"
                error={errors.state} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Pincode" id="pincode" value={form.pincode}
                onChange={set('pincode')} placeholder="133001"
                error={errors.pincode} required />
              <InputField label="Phone number" id="phone" type="tel"
                value={form.phone} onChange={set('phone')}
                placeholder="9876543210" error={errors.phone} required />
            </div>

            <InputField label="Full address" id="address" value={form.address}
              onChange={set('address')}
              placeholder="Shop 12, Main Bazar, Near Bus Stand"
              error={errors.address} required />

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-4 font-medium">
                Optional contact details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="WhatsApp number" id="whatsapp"
                  value={form.whatsapp} onChange={set('whatsapp')}
                  placeholder="9876543210 (optional)" />
                <InputField label="Email" id="email" type="email"
                  value={form.email} onChange={set('email')}
                  placeholder="shop@example.com (optional)" />
              </div>
              <div className="mt-4">
                <InputField label="Website URL" id="website"
                  value={form.website} onChange={set('website')}
                  placeholder="https://yourwebsite.com (optional)" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Hours ── */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h2 className="font-medium text-gray-800 mb-1">Business hours</h2>
            <p className="text-sm text-gray-400 mb-5">
              Hours are pre-filled based on your category — adjust as needed
            </p>
            <BusinessHoursBuilder
              hours={form.hours}
              onChange={(h) => setForm((p) => ({ ...p, hours: h }))}
            />
          </form>
        )}

        {/* ── Navigation buttons ── */}
        <div className={`flex mt-8 gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 text-sm font-medium text-gray-600
                         border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="px-6 py-2.5 text-sm font-medium text-white bg-saffron-600
                         rounded-xl hover:bg-saffron-700 transition-colors"
            >
              Continue →
            </button>
          ) : (
            <button
              type="submit"
              form=""
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-saffron-600
                         rounded-xl hover:bg-saffron-700 disabled:opacity-60
                         disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Publishing…' : 'Publish listing ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}