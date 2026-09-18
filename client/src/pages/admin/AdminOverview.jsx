import { useState, useEffect } from 'react'
import { getAdminStats } from '../../api/admin'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const StatCard = ({ label, value, sub, color = 'text-white', icon }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
    <div className="flex items-start justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
    <div className="text-sm text-gray-400">{label}</div>
    {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
  </div>
)

export default function AdminOverview() {
  const [data, setData]         = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getAdminStats()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <div className="w-8 h-8 border-2 border-saffron-600 border-t-transparent
                      rounded-full animate-spin" />
    </div>
  )

  const { stats, growth, recent_signups } = data

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Total Users"
          value={stats.total_users}
          sub={`+${stats.new_users_this_week} this week`}
          color="text-blue-400" />
        <StatCard icon="🏪" label="Total Listings"
          value={stats.total_listings}
          sub={`+${stats.new_listings_this_week} this week`}
          color="text-saffron-400" />
        <StatCard icon="✅" label="Active Listings"
          value={stats.active_listings}
          sub={`${stats.inactive_listings} inactive`}
          color="text-green-400" />
        <StatCard icon="👁" label="Total Views"
          value={stats.total_views_all_time.toLocaleString('en-IN')}
          sub="All time across all listings"
          color="text-purple-400" />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="⭐" label="Featured Listings"
          value={stats.featured_listings} color="text-amber-400" />
        <StatCard icon="📅" label="New Users (7d)"
          value={stats.new_users_this_week} color="text-cyan-400" />
        <StatCard icon="🆕" label="New Listings (7d)"
          value={stats.new_listings_this_week} color="text-pink-400" />
        <StatCard icon="📊" label="Avg Views/Listing"
          value={stats.total_listings
            ? Math.round(stats.total_views_all_time / stats.total_listings)
            : 0}
          color="text-orange-400" />
      </div>

      {/* Growth chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-base font-semibold text-white mb-5">
          Growth — last 30 days
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={growth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              interval={4}
            />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: '#111827', border: '1px solid #374151',
                borderRadius: '12px', fontSize: '12px', color: '#f9fafb'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
            <Line type="monotone" dataKey="users"
              stroke="#60a5fa" strokeWidth={2} dot={false} name="New Users" />
            <Line type="monotone" dataKey="listings"
              stroke="#f97316" strokeWidth={2} dot={false} name="New Listings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent signups */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">
          Recent signups
        </h2>
        <div className="flex flex-col divide-y divide-gray-800">
          {recent_signups.map((u) => (
            <div key={u._id}
              className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center
                                justify-center text-white text-xs font-bold">
                  {u.full_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{u.full_name}</div>
                  <div className="text-xs text-gray-500">{u.email || u.phone}</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                  ${u.subscription_tier === 'premium'
                    ? 'bg-amber-900 text-amber-300'
                    : 'bg-gray-800 text-gray-400'
                  }`}>
                  {u.subscription_tier}
                </span>
                <div className="text-xs text-gray-600 mt-0.5">
                  {new Date(u.created_at).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}