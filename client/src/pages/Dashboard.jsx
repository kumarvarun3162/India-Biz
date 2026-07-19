import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const TIER_STYLES = {
  free:    'bg-gray-100 text-gray-600',
  basic:   'bg-blue-100 text-blue-700',
  premium: 'bg-amber-100 text-amber-700',
}

const QUICK_ACTIONS = [
  { label: 'Create listing',  to: '/listing/create', primary: true },
  { label: 'Subscription',    to: '/subscription',   primary: false },
  { label: 'Settings',        to: '/settings',       primary: false },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Welcome header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your business listings from here
          </p>
        </div>

        {/* Subscription badge */}
        <span className={`
          px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
          ${TIER_STYLES[user?.subscription_tier] || TIER_STYLES.free}
        `}>
          {user?.subscription_tier || 'free'} plan
        </span>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap mb-10">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${a.primary
                ? 'bg-saffron-600 text-white hover:bg-saffron-700'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {a.label}
          </Link>
        ))}
      </div>

      {/* Empty listings state */}
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl
                      flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 bg-saffron-50 rounded-2xl flex items-center
                        justify-center mb-4 text-2xl">
          🏪
        </div>
        <h2 className="font-semibold text-gray-800 mb-1">No listings yet</h2>
        <p className="text-sm text-gray-400 mb-5 max-w-xs">
          Create your first listing and get found by customers searching Google
        </p>
        <Link
          to="/listing/create"
          className="px-6 py-2.5 bg-saffron-600 text-white text-sm
                     font-medium rounded-xl hover:bg-saffron-700 transition-colors"
        >
          Create your first listing
        </Link>
      </div>
    </div>
  )
}