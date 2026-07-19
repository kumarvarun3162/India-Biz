import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { loginUser } from '../api/auth'
import InputField from '../components/common/InputField'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  // If the user was redirected here from a protected page, send them back after login
  const from = location.state?.from?.pathname || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = 'Enter a valid email address'
    if (!form.password)
      errs.password = 'Password is required'
    return errs
  }

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
      const res = await loginUser(form)
      login(res.data.access_token, res.data.user)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(
        err.response?.data?.detail || 'Incorrect email or password'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to manage your listings
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

          {serverError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              label="Password"
              id="password"
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="Your password"
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-saffron-600 hover:bg-saffron-700
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-medium text-sm rounded-xl
                         transition-colors mt-1"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-saffron-600 font-medium hover:underline">
            Get started free
          </Link>
        </p>
      </div>
    </div>
  )
}