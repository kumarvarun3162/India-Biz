import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getListings } from '../api/listings'

const CATEGORIES = [
  { slug: '', label: 'All' },
  { slug: 'restaurant', label: '🍽️ Restaurants' },
  { slug: 'grocery', label: '🛒 Kirana' },
  { slug: 'mechanic', label: '🔧 Garages' },
  { slug: 'salon', label: '✂️ Salons' },
  { slug: 'medical', label: '💊 Medical' },
  { slug: 'tailor', label: '🧵 Tailors' },
  { slug: 'electronics', label: '📱 Electronics' },
  { slug: 'tutor', label: '📚 Coaching' },
  { slug: 'hardware', label: '🏗️ Hardware' },
  { slug: 'other', label: '🏪 Other' },
]

const CATEGORY_ICONS = {
  restaurant:'🍽️', grocery:'🛒', mechanic:'🔧', salon:'✂️',
  medical:'💊', tailor:'🧵', electronics:'📱', tutor:'📚',
  hardware:'🏗️', other:'🏪',
}

export default function Browse() {
  const [listings, setListings]     = useState([])
  const [isLoading, setIsLoading]   = useState(true)
  const [search, setSearch]         = useState('')
  const [city, setCity]             = useState('')
  const [category, setCategory]     = useState('')
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]           = useState(0)

  const load = async () => {
    setIsLoading(true)
    try {
      const params = { page, limit: 12 }
      if (search)   params.search   = search
      if (city)     params.city     = city
      if (category) params.category = category

      const res = await getListings(params)
      setListings(res.data.data || [])
      setTotalPages(res.data.pagination?.total_pages || 1)
      setTotal(res.data.pagination?.total || 0)
    } catch {
      setListings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { load() }, [page, category])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    load()
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Search header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Browse local businesses
          </h1>
          <p className="text-sm text-gray-400 mb-5">
            {total > 0 ? `${total} businesses listed` : 'Find businesses near you'}
          </p>

          {/* Search + city filter */}
          <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search businesses..."
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-gray-300
                         text-sm outline-none focus:ring-2 focus:ring-saffron-600
                         focus:border-saffron-600 bg-white"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g. Ambala)"
              className="w-48 px-4 py-2.5 rounded-xl border border-gray-300 text-sm
                         outline-none focus:ring-2 focus:ring-saffron-600
                         focus:border-saffron-600 bg-white"
            />
            <button type="submit"
              className="px-6 py-2.5 bg-saffron-600 text-white text-sm font-medium
                         rounded-xl hover:bg-saffron-700 transition-colors">
              Search
            </button>
          </form>
        </div>

        {/* Category tabs */}
        <div className="max-w-5xl mx-auto px-4 pb-0 overflow-x-auto">
          <div className="flex gap-2 pb-0 min-w-max">
            {CATEGORIES.map((c) => (
              <button key={c.slug}
                onClick={() => { setCategory(c.slug); setPage(1) }}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2
                  transition-colors ${category === c.slug
                    ? 'border-saffron-600 text-saffron-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && listings.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-semibold text-gray-800 mb-1">No listings found</h3>
            <p className="text-sm text-gray-400 mb-6">
              Try a different search or city
            </p>
            <Link to="/register"
              className="text-saffron-600 text-sm font-medium hover:underline">
              Be the first to list your business here →
            </Link>
          </div>
        )}

        {/* Listings grid */}
        {!isLoading && listings.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {listings.map((l) => (
                <Link key={l._id} to={`/listing/${l.slug}`}
                  className="bg-white border border-gray-200 rounded-2xl p-5
                             hover:shadow-md hover:border-saffron-200 transition-all
                             flex flex-col gap-3 group">

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-saffron-50 flex items-center
                                    justify-center text-xl flex-shrink-0 group-hover:bg-saffron-100
                                    transition-colors">
                      {CATEGORY_ICONS[l.category] || '🏪'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate text-sm
                                     group-hover:text-saffron-600 transition-colors">
                        {l.business_name}
                      </h3>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        📍 {l.city}, {l.state}
                      </p>
                    </div>
                    {l.is_featured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5
                                       rounded-full font-medium flex-shrink-0">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {l.description}
                  </p>

                  <div className="flex items-center justify-between pt-2
                                  border-t border-gray-50 text-xs text-gray-400">
                    <span className="capitalize">{l.category?.replace('-', ' ')}</span>
                    <span>📞 {l.phone}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl
                             disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  ← Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-500">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl
                             disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}