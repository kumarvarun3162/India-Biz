export default function StatCard({
  icon,
  label,
  value,
  sub,
  trend,       // "up" | "down" | null
  trendValue,  // e.g. "+12%"
  color = 'text-gray-900',
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && trendValue && (
          <span className={`
            text-xs font-medium px-2 py-0.5 rounded-full
            ${trend === 'up'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
            }
          `}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold mb-0.5 ${color}`}>
        {value?.toLocaleString('en-IN')}
      </div>
      <div className="text-sm text-gray-500">{label}</div>
      {sub && (
        <div className="text-xs text-gray-400 mt-1">{sub}</div>
      )}
    </div>
  )
}