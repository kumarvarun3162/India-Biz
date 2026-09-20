import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InputField from '../components/common/InputField'
import BusinessHoursBuilder from '../components/listing/BusinessHoursBuilder'
import ImageUploader from '../components/listing/ImageUploader'
import OffersEditor from '../components/listing/OffersEditor'
import { getMyListings, updateListing } from '../api/listings'

export default function EditListing() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const [form, setForm]                 = useState(null)
  const [errors, setErrors]             = useState({})
  const [serverError, setServerError]   = useState('')
  const [isLoading, setIsLoading]       = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  // ── Load listing on mount ─────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return
    getMyListings()
      .then((res) => {
        const found = res.data.data?.find((l) => l._id === id)
        if (!found) {
          navigate('/dashboard')
          return
        }
        // Convert images array — backend stores URLs as strings,
        // ImageUploader expects {url, public_id} objects
        const images = (found.images || []).map((url) =>
          typeof url === 'string' ? { url, public_id: null } : url
        )
        setForm({ ...found, images })
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setIsLoading(false))
  }, [id])

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.business_name?.trim())        e.business_name = 'Business name is required'
    if (!form.city?.trim())                 e.city          = 'City is required'
    if (!form.state?.trim())                e.state         = 'State is required'
    if (!/^\d{6}$/.test(form.pincode))      e.pincode       = 'Enter a valid 6-digit pincode'
    if (!/^[6-9]\d{9}$/.test(form.phone))  e.phone         = 'Enter a valid 10-digit number'
    return e
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setServerError('')
    setIsSubmitting(true)

    try {
      await updateListing(id, {
        business_name: form.business_name,
        description:   form.description,
        address:       form.address,
        city:          form.city,
        state:         form.state,
        pincode:       form.pincode,
        phone:         form.phone,
        whatsapp:      form.whatsapp  || null,
        email:         form.email     || null,
        website:       form.website   || null,
        hours:         form.hours,
        is_active:     form.is_active,
        offers:        form.offers    || null,
        images:        form.images.map((img) => img.url),
      })
      navigate('/dashboard')
    } catch (err) {
      setServerError(
        err.response?.data?.detail || 'Update failed. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-saffron-600 border-t-transparent
                      rounded-full animate-spin" />
    </div>
  )

  if (!form) return null

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Edit listing
        </h1>
        <p className="text-sm text-gray-500">
          Changes go live immediately after saving
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {serverError && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200
                          rounded-xl text-sm text-red-600">
            {serverError}
          </div>
        )}

        {/* ── Section 1 — Basic info ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6
                        sm:p-8 shadow-sm mb-5">
          <h2 className="font-medium text-gray-800 mb-5">Business information</h2>
          <div className="flex flex-col gap-5">

            <InputField
              label="Business name" id="business_name" required
              value={form.business_name} onChange={set('business_name')}
              error={errors.business_name}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description || ''}
                onChange={set('description')}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
                           text-sm text-gray-900 outline-none resize-none
                           focus:ring-2 focus:ring-saffron-600
                           focus:border-saffron-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="City" id="city" required
                value={form.city} onChange={set('city')}
                error={errors.city}
              />
              <InputField
                label="State" id="state" required
                value={form.state} onChange={set('state')}
                error={errors.state}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Pincode" id="pincode" required
                value={form.pincode} onChange={set('pincode')}
                error={errors.pincode}
              />
              <InputField
                label="Phone" id="phone" type="tel" required
                value={form.phone} onChange={set('phone')}
                error={errors.phone}
              />
            </div>

            <InputField
              label="Address" id="address"
              value={form.address || ''} onChange={set('address')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="WhatsApp" id="whatsapp"
                value={form.whatsapp || ''} onChange={set('whatsapp')}
                placeholder="9876543210 (optional)"
              />
              <InputField
                label="Email" id="email" type="email"
                value={form.email || ''} onChange={set('email')}
                placeholder="shop@example.com (optional)"
              />
            </div>

            <InputField
              label="Website" id="website"
              value={form.website || ''} onChange={set('website')}
              placeholder="https://yourwebsite.com (optional)"
            />

            {/* Active toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.is_active ?? true}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, is_active: e.target.checked }))
                  }
                />
                <div className="w-10 h-6 bg-gray-200 rounded-full
                                peer-checked:bg-saffron-600 transition-colors" />
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full
                                shadow transition-transform
                                peer-checked:translate-x-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Listing is{' '}
                {form.is_active
                  ? 'active — visible to customers'
                  : 'inactive — hidden from search'}
              </span>
            </label>
          </div>
        </div>

        {/* ── Section 2 — Business hours ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6
                        sm:p-8 shadow-sm mb-5">
          <h2 className="font-medium text-gray-800 mb-5">Business hours</h2>
          <BusinessHoursBuilder
            hours={form.hours}
            onChange={(h) => setForm((p) => ({ ...p, hours: h }))}
          />
        </div>

        {/* ── Section 3 — Photos ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6
                        sm:p-8 shadow-sm mb-5">
          <h2 className="font-medium text-gray-800 mb-1">Shop photos</h2>
          <p className="text-sm text-gray-400 mb-5">
            Up to 6 photos. First photo is your cover image.
            Removing a photo deletes it from storage permanently.
          </p>
          <ImageUploader
            images={form.images}
            onChange={(imgs) => setForm((p) => ({ ...p, images: imgs }))}
          />
        </div>

        {/* ── Section 4 — Offers ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6
                        sm:p-8 shadow-sm mb-5">
          <OffersEditor
            value={form.offers}
            onChange={(v) => setForm((p) => ({ ...p, offers: v }))}
          />
        </div>

        {/* ── Action buttons ── */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200
                       rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-saffron-600
                       rounded-xl hover:bg-saffron-700 disabled:opacity-60
                       disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}