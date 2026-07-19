import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { registerUser } from '../api/auth'
import InputField from '../components/common/InputField'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // ── Helpers ────────────────────────────────────────────────────────────────
  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.full_name.trim() || form.full_name.trim().length < 2)
      errs.full_name = 'Full name must be at least 2 characters'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = 'Enter a valid email address'
    if (!form.phone.match(/^[6-9]\d{9}$/))
      errs.phone = 'Enter a valid 10-digit Indian mobile number'
    if (form.password.length < 8)
      errs.password = 'Password must be at least 8 characters'
    return errs
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setIsLoading(true)

    try {
      const res = await registerUser(form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setServerError(
        err.response?.data?.detail || 'Something went wrong. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Create your account
          </h1>
          <p className="text-sm text-gray-500">
            Get your business listed in under 10 minutes
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

          {/* Server error */}
          {serverError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <InputField
              label="Full name"
              id="full_name"
              value={form.full_name}
              onChange={set('full_name')}
              placeholder="Varun Kumar"
              error={errors.full_name}
              required
              autoComplete="name"
            />
            <InputField
              label="Email address"
              id="email"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="varun@example.com"
              error={errors.email}
              required
              autoComplete="email"
            />
            <InputField
              label="Mobile number"
              id="phone"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="9876543210"
              error={errors.phone}
              required
              autoComplete="tel"
            />
            <InputField
              label="Password"
              id="password"
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="Minimum 8 characters"
              error={errors.password}
              required
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-saffron-600 hover:bg-saffron-700
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-medium text-sm rounded-xl
                         transition-colors mt-1"
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-saffron-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}