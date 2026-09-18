import { useState, useEffect, useCallback } from 'react'
import { getAdminUsers, suspendUser } from '../../api/admin'

const TIER_COLORS = {
  free:    'bg-gray-800 text-gray-400',
  basic:   'bg-blue-900 text-blue-300',
  premium: 'bg-amber-900 text-amber-300',
}

export default function AdminUsers() {
  const [users, setUsers]       = useState([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [query, setQuery]       = useState('')
  const [isLoading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdminUsers({ page, limit: 20, search: query || undefined })
      setUsers(res.data.data)
      setTotal(res.data.pagination.total)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [page, query])

  useEffect(() => { load() }, [load])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setQuery(search)
  }

  const handleSuspend = async (id, current) => {
    setActionId(id)
    try {
      await suspendUser(id, !current)
      await load()
    } catch (e) { console.error(e) }
    finally { setActionId(null) }
  }

  const totalPages = Math.max(1, Math.ceil(total / 20))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total accounts</p>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5
                     text-sm text-white placeholder:text-gray-600 outline-none
                     focus:border-saffron-600 focus:ring-1 focus:ring-saffron-600"
        />
        <button type="submit"
          className="px-5 py-2.5 bg-saffron-600 text-white text-sm font-medium
                     rounded-xl hover:bg-saffron-700 transition-colors">
          Search
        </button>
        {query && (
          <button type="button" onClick={() => { setQuery(''); setSearch(''); setPage(1) }}
            className="px-4 py-2.5 bg-gray-800 text-gray-400 text-sm rounded-xl
                       hover:bg-gray-700 transition-colors">
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
                <th className="text-left px-5 py-3.5 text-xs font-medium
                               text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium
                               text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium
                               text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium
                               text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="text-left px-4 py-3.5 text-xs font-medium
                               text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium
                               text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading
                ? [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-gray-800 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : users.map((u) => (
                    <tr key={u._id}
                      className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-saffron-900 flex
                                          items-center justify-center text-saffron-400
                                          text-xs font-bold flex-shrink-0">
                            {u.full_name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-400">
                        {u.email || u.phone}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                          ${TIER_COLORS[u.subscription_tier] || TIER_COLORS.free}`}>
                          {u.subscription_tier}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500 text-xs">
                        {new Date(u.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                          ${u.is_suspended
                            ? 'bg-red-900 text-red-300'
                            : 'bg-green-900 text-green-300'
                          }`}>
                          {u.is_suspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          disabled={actionId === u._id}
                          onClick={() => handleSuspend(u._id, u.is_suspended)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium
                            transition-colors disabled:opacity-50
                            ${u.is_suspended
                              ? 'bg-green-900 text-green-300 hover:bg-green-800'
                              : 'bg-red-900 text-red-300 hover:bg-red-800'
                            }`}>
                          {actionId === u._id
                            ? '...'
                            : u.is_suspended ? 'Restore' : 'Suspend'}
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-5 py-4
                          border-t border-gray-800">
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages} ({total} users)
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
    </div>
  )
}