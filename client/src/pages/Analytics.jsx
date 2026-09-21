import { useParams, Link } from 'react-router-dom'
import { useAnalytics } from '../hooks/useAnalytics'
import StatCard from '../components/analytics/StatCard'
import ViewsChart from '../components/analytics/ViewsChart'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts'

const COLORS = [
  '#B84D18','#f97316','#3b82f6','#22c55e',
  '#a855f7','#ec4899','#14b8a6','#eab308',
]

export default function Analytics() {
  const { id } = useParams()
  const { data, isLoading, error, days, setDays } = useAnalytics(id)

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-saffron-600 border-t-transparent
                      rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-4xl mb-3">⚠️</div>
      <h2 className="font-semibold text-gray-800 mb-1">Could not load analytics</h2>
      <p className="text-sm text-gray-400 mb-6">{error}</p>
      <Link to="/dashboard"
        className="text-saffron-600 text-sm font-medium hover:underline">
        ← Back to dashboard
      </Link>
    </div>
  )

  const {
    listing_name, total_views, total_whatsapp,
    total_phone, best_day, best_day_views,
    days_tracked, daily,
  } = data

  // City-level data doesn't exist yet — show placeholder
  // (Phase 8 map integration will add this)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <Link to="/dashboard"
            className="text-sm text-gray-400 hover:text-gray-600
                       transition-colors mb-2 inline-block">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            {listing_name}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Analytics · last {days} days
            {days_tracked > 0 && ` · ${days_tracked} days with data`}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="👁"
          label="Total views"
          value={total_views}
          sub={`last ${days} days`}
          color="text-saffron-600"
        />
        <StatCard
          icon="💬"
          label="WhatsApp clicks"
          value={total_whatsapp}
          sub="people tapped WhatsApp"
          color="text-green-600"
        />
        <StatCard
          icon="📞"
          label="Call clicks"
          value={total_phone}
          sub="people tapped call"
          color="text-blue-600"
        />
        <StatCard
          icon="🏆"
          label="Best day"
          value={best_day_views}
          sub={best_day
            ? new Date(best_day).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short'
              })
            : 'No data yet'
          }
          color="text-purple-600"
        />
      </div>

      {/* Views chart */}
      <div className="mb-6">
        <ViewsChart
          data={daily}
          days={days}
          onDaysChange={setDays}
        />
      </div>

      {/* Engagement breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Engagement rate */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Engagement</h2>
          {total_views === 0 ? (
            <p className="text-sm text-gray-400">
              No views yet — share your listing link to start getting traffic
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {/* WhatsApp rate */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">WhatsApp rate</span>
                  <span className="font-medium text-gray-800">
                    {total_views > 0
                      ? `${((total_whatsapp / total_views) * 100).toFixed(1)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{
                      width: total_views > 0
                        ? `${Math.min(100, (total_whatsapp / total_views) * 100)}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
              {/* Call rate */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Call rate</span>
                  <span className="font-medium text-gray-800">
                    {total_views > 0
                      ? `${((total_phone / total_views) * 100).toFixed(1)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{
                      width: total_views > 0
                        ? `${Math.min(100, (total_phone / total_views) * 100)}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
              {/* Total engagement */}
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Total engagement</span>
                  <span className="font-medium text-gray-800">
                    {total_views > 0
                      ? `${(((total_whatsapp + total_phone) / total_views) * 100).toFixed(1)}%`
                      : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-saffron-500 rounded-full transition-all"
                    style={{
                      width: total_views > 0
                        ? `${Math.min(100, ((total_whatsapp + total_phone) / total_views) * 100)}%`
                        : '0%'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Summary</h2>
          <div className="flex flex-col divide-y divide-gray-50">
            {[
              {
                label: 'Daily average views',
                value: days_tracked > 0
                  ? (total_views / days_tracked).toFixed(1)
                  : '0',
              },
              {
                label: 'Total clicks (WhatsApp + Calls)',
                value: total_whatsapp + total_phone,
              },
              {
                label: 'Days with data',
                value: `${days_tracked} / ${days}`,
              },
              {
                label: 'Best single day views',
                value: best_day_views,
              },
            ].map((row) => (
              <div key={row.label}
                className="flex justify-between items-center py-2.5">
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tip box */}
      <div className="bg-saffron-50 border border-saffron-200 rounded-2xl
                      px-6 py-4">
        <p className="text-sm text-saffron-800 font-medium mb-1">
          💡 How to get more views
        </p>
        <p className="text-sm text-saffron-700 leading-relaxed">
          Share your listing link on WhatsApp groups, add it to your
          visiting card, and ask satisfied customers to share it.
          Listings with photos get <strong>3x more clicks</strong> than
          those without.
        </p>
      </div>
    </div>
  )
}