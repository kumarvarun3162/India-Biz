import { useState, useEffect, useCallback } from 'react'
import { getAdminListings, updateListingAdmin, deleteListingAdmin } from '../../api/admin'

const CAT_ICONS = {
  restaurant:'🍽️', grocery:'🛒', mechanic:'🔧', salon:'✂️',
  medical:'💊', tailor:'🧵', electronics:'📱', tutor:'📚',
  hardware:'🏗️', other:'🏪',
}

export default function AdminListings() {
  const [listings, setListings] = useState([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [query, setQuery]       = useState('')
  const [isLoading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminListings({ page, limit: 20, search: query || undefined })
      setListings(res.data.data)
      setTotal(res.data.pagination.total)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [page, query])

  useEffect(() => { load() }, [load])

  const handleSearch = (e) => {
    e.preventDefault(); setPage(1); setQuery(search)
  }

  const handleToggle = async (id, field, current) => {
    setActionId(id + field)
    try {
      await updateListingAdmin(id, { [field]: !current })
      setListings(prev => prev.map(l =>
        l._id === id ? { ...l, [field]: !current } : l
      ))
    } catch (e) { console.error(e) }
    finally { setActionId(null) }
  }

  const handleDelete = async () => {
    if (!deleteModal) return
    try {
      await deleteListingAdmin(deleteModal.id)
      setListings(prev => prev.filter(l => l._id !== deleteModal.id))
      setTotal(t => t - 1)
    } catch (e) { console.error(e) }
    finally { setDeleteModal(null) }
  }

  const totalPages = Math.max(1, Math.ceil(total / 20))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Listings</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total listings</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by business name or city..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4
                     py-2.5 text-sm text-white placeholder:text-gray-600
                     outline-none focus:border-saffron-600"
        />
        <button type="submit"
          className="px-5 py-2.5 bg-saffron-600 text-white text-sm font-medium
                     rounded-xl hover:bg-saffron-700 transition-colors">
          Search
        </button>
        {query && (
          <button type="button"
            onClick={() => { setQuery(''); setSearch(''); setPage(1) }}
            className="px-4 py-2.5 bg-gray-800 text-gray-400 text-sm
                       rounded-xl hover:bg-gray-700 transition-colors">
            Clear
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Business', 'Owner', 'Category', 'City', 'Views',
                  'Status', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-medium
                                         text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading
                ? [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 bg-gray-800 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : listings.map(l => (
                    <tr key={l._id}
                      className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {CAT_ICONS[l.category] || '🏪'}
                          </span>
                          <div>
                            <div className="font-medium text-white text-xs
                                            max-w-[140px] truncate">
                              {l.business_name}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5">
                              {l.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs text-gray-300">{l.owner_name}</div>
                        <div className="text-xs text-gray-600 truncate max-w-[110px]">
                          {l.owner_email}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-xs capitalize">
                        {l.category}
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-xs">{l.city}</td>
                      <td className="px-4 py-4 text-gray-400 text-xs">
                        👁 {l.views_total}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          disabled={actionId === l._id + 'is_active'}
                          onClick={() => handleToggle(l._id, 'is_active', l.is_active)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium
                            transition-colors disabled:opacity-50
                            ${l.is_active
                              ? 'bg-green-900 text-green-300 hover:bg-green-800'
                              : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                            }`}>
                          {l.is_active ? 'Live' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          disabled={actionId === l._id + 'is_featured'}
                          onClick={() => handleToggle(l._id, 'is_featured', l.is_featured)}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium
                            transition-colors disabled:opacity-50
                            ${l.is_featured
                              ? 'bg-amber-900 text-amber-300 hover:bg-amber-800'
                              : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                            }`}>
                          {l.is_featured ? '⭐ Yes' : 'No'}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/listing/${l.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-saffron-500 hover:text-saffron-400
                                       transition-colors"
                          >
                            View ↗
                          </a>
                          <button
                            onClick={() => setDeleteModal({
                              id: l._id, name: l.business_name
                            })}
                            className="text-xs text-red-500 hover:text-red-400
                                       transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center px-5 py-4
                          border-t border-gray-800">
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-xs bg-gray-800 text-gray-400 rounded-lg
                           disabled:opacity-40 hover:bg-gray-700 transition-colors">
                ← Prev
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-xs bg-gray-800 text-gray-400 rounded-lg
                           disabled:opacity-40 hover:bg-gray-700 transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex
                        items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6
                          max-w-sm w-full shadow-2xl">
            <h3 className="font-semibold text-white mb-2">Delete listing?</h3>
            <p className="text-sm text-gray-400 mb-6">
              <strong className="text-white">{deleteModal.name}</strong> will be
              permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 text-sm text-gray-400 border border-gray-700
                           rounded-xl hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 text-sm font-medium text-white
                           bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}