import axios from 'axios'

// ── Instance ──────────────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,   // 30s — Render free tier can take 20s to wake up
})

// ── Request interceptor — attach JWT to every outgoing call ───────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ibl_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Auth pages where a 401 should NOT cause a redirect ────────────────────────
const AUTH_PATHS = ['/login', '/register']

const isAuthPage = () =>
  AUTH_PATHS.some((p) => window.location.pathname.startsWith(p))

// ── Response interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  // Any 2xx — pass through unchanged
  (response) => response,

  (error) => {
    const status = error.response?.status

    // 401 — token expired or invalid
    if (status === 401) {
      localStorage.removeItem('ibl_token')

      // Don't redirect if the user is already on login or register
      // (prevents redirect loop when login itself returns 401 on bad password)
      if (!isAuthPage()) {
        window.location.href = '/login'
      }
    }

    // 403 — user exists but doesn't have permission (e.g. not admin)
    // Don't redirect — let the component handle it
    if (status === 403) {
      console.warn('Access denied — insufficient permissions')
    }

    // Network error — Render free tier sleeping or no internet
    if (!error.response) {
      console.warn(
        'Network error — server may be waking up (Render free tier). ' +
        'Retrying is handled per-component.'
      )
    }

    return Promise.reject(error)
  }
)

export default axiosInstance