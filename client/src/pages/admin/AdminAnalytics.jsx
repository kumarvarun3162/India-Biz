import { useState, useEffect } from 'react'
import { getAdminAnalytics } from '../../api/admin'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const CAT_ICONS = {
  restaurant:'🍽️', grocery:'🛒', mechanic:'🔧', salon:'✂️',
  medical:'💊', tailor:'🧵', electronics:'📱', tutor:'📚',
  hardware:'🏗️', other:'🏪',
}

const COLORS = [
  '#f97316','#60a5fa','#34d399','#a78bfa',
  '#f472b6','#facc15','#fb923c','#38bdf8','#4ade80','#c084fc'
]

export default function AdminAnalytics() {
  const [data, setData]         = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getAdminAnalytics()
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

  const { top_listings, category_breakdown } = data

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Performance data across all listings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top listings */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">
            🏆 Top 10 listings by views
          </h2>
          <div className="flex flex-col gap-3">
            {top_listings.map((l, i) => (
              <div key={l._id} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-4 flex-shrink-0
                                 font-mono">
                  {i + 1}
                </span>
                <span className="text-base flex-shrink-0">
                  {CAT_ICONS[l.category] || '🏪'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">
                    {l.business_name}
                  </div>
                  <div className="text-xs text-gray-500">{l.city}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-saffron-400">
                    {l.views_total.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-gray-600">views</div>
                </div>
              </div>
            ))}
            {top_listings.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-8">
                No listings yet
              </p>
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">
            📊 Listings by category
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={category_breakdown.map(c => ({
                name:  c._id.charAt(0).toUpperCase() + c._id.slice(1),
                count: c.count,
              }))}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: '#111827', border: '1px solid #374151',
                  borderRadius: '10px', fontSize: '12px', color: '#f9fafb'
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {category_breakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}