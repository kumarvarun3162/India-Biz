import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useMyListings } from '../hooks/useListing'
import ListingCard from '../components/listing/ListingCard'

const TIER_STYLES = {
  free:    'bg-gray-100 text-gray-600',
  basic:   'bg-blue-100 text-blue-700',
  premium: 'bg-amber-100 text-amber-700',
}

export default function Dashboard() {
  const { user } = useAuth()
  const { listings, isLoading, error, removeListing } = useMyListings()
  const [deleteModal, setDeleteModal] = useState(null)

  const handleDeleteClick   = (id, name) => setDeleteModal({ id, name })
  const handleDeleteConfirm = async () => {
    if (!deleteModal) return
    await removeListing(deleteModal.id)
    setDeleteModal(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {listings.length > 0
              ? `You have ${listings.length} listing${listings.length !== 1 ? 's' : ''}`
              : 'Manage your business listings from here'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
            ${TIER_STYLES[user?.subscription_tier] || TIER_STYLES.free}
          `}>
            {user?.subscription_tier || 'free'} plan
          </span>
          <Link to="/listing/create"
            className="px-4 py-2 bg-saffron-600 text-white text-sm font-medium
                       rounded-xl hover:bg-saffron-700 transition-colors">
            + New listing
          </Link>
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n}
              className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
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
        <div className="px-4 py-3 bg-red-50 border border-red-200
                        rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && listings.length === 0 && (
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
          <Link to="/listing/create"
            className="px-6 py-2.5 bg-saffron-600 text-white text-sm
                       font-medium rounded-xl hover:bg-saffron-700 transition-colors">
            Create your first listing
          </Link>
        </div>
      )}

      {/* Listings grid */}
      {!isLoading && !error && listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((l) => (
            <ListingCard
              key={l._id}
              listing={l}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm
                        flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Delete listing?</h3>
            <p className="text-sm text-gray-500 mb-6">
              <strong>{deleteModal.name}</strong> will be permanently deleted
              and removed from search results. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600
                           border border-gray-200 rounded-xl hover:bg-gray-50
                           transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 text-sm font-medium text-white
                           bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}