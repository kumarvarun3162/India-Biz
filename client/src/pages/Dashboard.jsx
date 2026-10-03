import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useMyListings } from '../hooks/useListing'
import ListingCard from '../components/listing/ListingCard'

const TIER_BADGE = {
  free:    'bg-gray-100 text-gray-500',
  basic:   'bg-blue-100 text-blue-700',
  premium: 'bg-amber-100 text-amber-700',
}

const QUICK_ACTIONS = [
  { label: '+ New listing', to: '/listing/create', primary: true  },
  { label: 'Browse',        to: '/browse',         primary: false },
  { label: 'Settings',      to: '/settings',       primary: false },
]

export default function Dashboard() {
  const { user }  = useAuth()
  const { listings, isLoading, error, removeListing } = useMyListings()
  const [deleteModal, setDeleteModal] = useState(null)

  const handleDeleteClick   = (id, name) => setDeleteModal({ id, name })
  const handleDeleteConfirm = async () => {
    if (!deleteModal) return
    await removeListing(deleteModal.id)
    setDeleteModal(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header card ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-5xl mx-auto flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Welcome back, {user?.full_name?.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isLoading
                ? 'Loading your listings…'
                : listings.length > 0
                  ? `${listings.length} listing${listings.length !== 1 ? 's' : ''} active`
                  : 'No listings yet — create your first one'}
            </p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase
            tracking-wide self-start ${TIER_BADGE[user?.subscription_tier] || TIER_BADGE.free}`}>
            {user?.subscription_tier || 'free'} plan
          </span>
        </div>

        {/* Quick action chips */}
        <div className="max-w-5xl mx-auto mt-4 flex gap-2 overflow-x-auto
                        pb-1 -mb-1 scrollbar-none">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.to} to={a.to}
              className={`flex-shrink-0 text-sm font-medium px-4 py-2 rounded-full
                         transition-colors min-h-0
                         ${a.primary
                           ? 'bg-navy-600 text-white hover:bg-navy-700'
                           : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                         }`}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 animate-pulse
                                      border border-gray-100">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4
                          py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && listings.length === 0 && (
          <div className="bg-white border-2 border-dashed border-gray-200
                          rounded-3xl flex flex-col items-center justify-center
                          py-16 px-6 text-center">
            <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center
                            justify-center text-3xl mb-4">🏪</div>
            <h2 className="font-semibold text-gray-800 text-base mb-1">
              No listings yet
            </h2>
            <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
              Create your first listing and get found by customers
              searching on Google
            </p>
            <Link to="/listing/create"
              className="bg-navy-600 text-white text-sm font-medium
                         px-7 py-3 rounded-full hover:bg-navy-700
                         transition-colors min-h-0">
              Create your first listing
            </Link>
          </div>
        )}

        {/* Listings list */}
        {!isLoading && !error && listings.length > 0 && (
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
            {listings.map((l) => (
              <ListingCard
                key={l._id}
                listing={l}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex
                        items-end sm:items-center justify-center z-50 px-4 pb-4 sm:pb-0">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-gray-900 mb-2 text-base">
              Delete listing?
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              <strong className="text-gray-800">{deleteModal.name}</strong> will
              be permanently removed. This cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={handleDeleteConfirm}
                className="w-full py-3 bg-red-500 text-white text-sm font-medium
                           rounded-2xl hover:bg-red-600 transition-colors min-h-0">
                Yes, delete
              </button>
              <button onClick={() => setDeleteModal(null)}
                className="w-full py-3 bg-gray-100 text-gray-700 text-sm font-medium
                           rounded-2xl hover:bg-gray-200 transition-colors min-h-0">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}