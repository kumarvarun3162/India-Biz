import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getListings } from '../api/listings'

const CATS = [
  { slug: '',            label: 'All'          },
  { slug: 'restaurant',  label: '🍽️ Restaurants' },
  { slug: 'grocery',     label: '🛒 Kirana'      },
  { slug: 'mechanic',    label: '🔧 Garages'     },
  { slug: 'salon',       label: '✂️ Salons'       },
  { slug: 'medical',     label: '💊 Medical'      },
  { slug: 'tailor',      label: '🧵 Tailors'      },
  { slug: 'electronics', label: '📱 Electronics'  },
  { slug: 'tutor',       label: '📚 Coaching'     },
  { slug: 'hardware',    label: '🏗️ Hardware'     },
  { slug: 'other',       label: '🏪 Other'        },
]

const CAT_ICONS = {
  restaurant:'🍽️', grocery:'🛒', mechanic:'🔧', salon:'✂️',
  medical:'💊', tailor:'🧵', electronics:'📱', tutor:'📚',
  hardware:'🏗️', other:'🏪',
}

export default function Browse() {
  const [searchParams] = useSearchParams()
  const [listings, setListings]   = useState([])
  const [isLoading, setLoading]   = useState(true)
  const [search, setSearch]       = useState('')
  const [city, setCity]           = useState('')
  const [activeQuery, setQuery]   = useState({ search: '', city: '' })
  const [category, setCategory]   = useState(searchParams.get('category') || '')
  const [page, setPage]           = useState(1)
  const [totalPages, setTotal]    = useState(1)
  const [totalCount, setCount]    = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (activeQuery.search) params.search   = activeQuery.search
      if (activeQuery.city)   params.city     = activeQuery.city
      if (category)           params.category = category
      const res = await getListings(params)
      setListings(res.data.data || [])
      setTotal(res.data.pagination?.total_pages || 1)
      setCount(res.data.pagination?.total || 0)
    } catch { setListings([]) }
    finally { setLoading(false) }
  }, [page, category, activeQuery])

  useEffect(() => { load() }, [load])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setQuery({ search, city })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
        <div className="max-w-5xl mx-auto px-4 pt-4 pb-0">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Browse businesses
              </h1>
              {totalCount > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {totalCount} businesses listed
                </p>
              )}
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search businesses…"
              className="flex-1 h-10 px-4 bg-gray-50 border border-gray-200
                         rounded-full text-sm outline-none focus:border-navy-400
                         focus:ring-2 focus:ring-navy-100 transition-all"
            />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City…"
              className="w-24 h-10 px-3 bg-gray-50 border border-gray-200
                         rounded-full text-sm outline-none focus:border-navy-400
                         focus:ring-2 focus:ring-navy-100 transition-all
                         hidden sm:block"
            />
            <button type="submit"
              className="h-10 px-5 bg-navy-600 text-white text-sm font-medium
                         rounded-full hover:bg-navy-700 transition-colors
                         flex-shrink-0 min-h-0">
              Search
            </button>
          </form>

          {/* Mobile city input — separate row */}
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Filter by city (e.g. Ambala)…"
            className="sm:hidden w-full h-9 px-4 mb-3 bg-gray-50 border
                       border-gray-200 rounded-full text-sm outline-none
                       focus:border-navy-400"
          />

          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-3
                          scrollbar-none -mx-4 px-4">
            {CATS.map((c) => (
              <button
                key={c.slug}
                onClick={() => { setCategory(c.slug); setPage(1) }}
                className={`
                  flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium
                  transition-all border min-h-0
                  ${category === c.slug
                    ? 'bg-navy-600 text-white border-navy-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-navy-300'
                  }
                `}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-5xl mx-auto px-4 py-5">

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1,2,3,4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border
                                      border-gray-100 animate-pulse flex gap-3">
                <div className="w-11 h-11 bg-gray-100 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && listings.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-800 mb-1">No listings found</h3>
            <p className="text-sm text-gray-400 mb-5">
              Try a different search term or city
            </p>
            <Link to="/register"
              className="text-navy-600 text-sm font-medium hover:underline min-h-0">
              Be the first to list here →
            </Link>
          </div>
        )}

        {/* Listing cards — vertical on mobile, grid on tablet+ */}
        {!isLoading && listings.length > 0 && (
          <>
            <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2
                            lg:grid-cols-3">
              {listings.map((l) => (
                <Link key={l._id} to={`/listing/${l.slug}`}
                  className="bg-white border border-gray-100 rounded-2xl
                             hover:shadow-md active:scale-[0.99] transition-all
                             overflow-hidden group">
                  <div className="p-4 flex gap-3 items-start">
                    <div className="w-11 h-11 rounded-xl bg-navy-50 border
                                    border-navy-100 flex items-center justify-center
                                    text-xl flex-shrink-0">
                      {CAT_ICONS[l.category] || '🏪'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900
                                     group-hover:text-navy-600 transition-colors
                                     truncate">
                        {l.business_name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        📍 {l.city}, {l.state}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed
                                    line-clamp-2">
                        {l.description}
                      </p>
                    </div>
                    <span className="text-gray-300 text-lg flex-shrink-0
                                     group-hover:text-navy-400 transition-colors">
                      ›
                    </span>
                  </div>
                  <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100
                                  flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white
                                     border border-gray-200 text-gray-500
                                     capitalize">
                      {l.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {l.phone}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-5 py-2.5 text-sm border border-gray-200
                             rounded-full disabled:opacity-40 hover:bg-gray-50
                             transition-colors min-h-0 text-gray-600">
                  ← Prev
                </button>
                <span className="px-4 py-2.5 text-sm text-gray-500">
                  {page} / {totalPages}
                </span>
                <button disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-5 py-2.5 text-sm border border-gray-200
                             rounded-full disabled:opacity-40 hover:bg-gray-50
                             transition-colors min-h-0 text-gray-600">
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