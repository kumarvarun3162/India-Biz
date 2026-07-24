import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InputField from '../components/common/InputField'
import BusinessHoursBuilder from '../components/listing/BusinessHoursBuilder'
import { getListingBySlug, updateListing } from '../api/listings'

export default function EditListing() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm]               = useState(null)
  const [errors, setErrors]           = useState({})
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading]     = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  // Load the listing on mount
  useEffect(() => {
    if (!id) return
    // We fetch by id via the slug endpoint isn't right —
    // get user's listings and find by _id
    import('../api/listings')
      .then(({ getMyListings }) => getMyListings())
      .then((res) => {
        const found = res.data.data.find((l) => l._id === id)
        if (!found) navigate('/dashboard')
        else setForm(found)
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setIsLoading(false))
  }, [id])

  const validate = () => {
    const e = {}
    if (!form.business_name?.trim()) e.business_name = 'Business name is required'
    if (!form.city?.trim())          e.city          = 'City is required'
    if (!/^\d{6}$/.test(form.pincode))      e.pincode = 'Enter a valid 6-digit pincode'
    if (!/^[6-9]\d{9}$/.test(form.phone))  e.phone   = 'Enter a valid 10-digit number'
    return e
  }

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
        whatsapp:      form.whatsapp || null,
        email:         form.email    || null,
        website:       form.website  || null,
        hours:         form.hours,
        is_active:     form.is_active,
      })
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Update failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-saffron-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!form) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Edit listing</h1>
        <p className="text-sm text-gray-500">
          Changes are live immediately after saving
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {serverError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <InputField label="Business name" id="business_name"
              value={form.business_name} onChange={set('business_name')}
              error={errors.business_name} required />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea rows={4} value={form.description}
                onChange={set('description')}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
                  text-sm text-gray-900 outline-none resize-none
                  focus:ring-2 focus:ring-saffron-600 focus:border-saffron-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="City" id="city" value={form.city}
                onChange={set('city')} error={errors.city} required />
              <InputField label="State" id="state" value={form.state}
                onChange={set('state')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Pincode" id="pincode" value={form.pincode}
                onChange={set('pincode')} error={errors.pincode} required />
              <InputField label="Phone" id="phone" value={form.phone}
                onChange={set('phone')} error={errors.phone} required />
            </div>

            <InputField label="Address" id="address" value={form.address}
              onChange={set('address')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="WhatsApp" id="whatsapp"
                value={form.whatsapp || ''} onChange={set('whatsapp')} />
              <InputField label="Email" id="email" type="email"
                value={form.email || ''} onChange={set('email')} />
            </div>

            <InputField label="Website" id="website"
              value={form.website || ''} onChange={set('website')} />

            {/* Active toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only peer"
                  checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />
                <div className="w-10 h-6 bg-gray-200 rounded-full peer
                  peer-checked:bg-saffron-600 transition-colors" />
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full
                  shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Listing is {form.is_active ? 'active (visible to customers)' : 'inactive (hidden)'}
              </span>
            </label>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Business hours</p>
              <BusinessHoursBuilder
                hours={form.hours}
                onChange={(h) => setForm((p) => ({ ...p, hours: h }))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5 justify-end">
          <button type="button" onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 text-sm text-gray-600 border border-gray-200
                       rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-saffron-600
                       rounded-xl hover:bg-saffron-700 disabled:opacity-60
                       disabled:cursor-not-allowed transition-colors">
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}