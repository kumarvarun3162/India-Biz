const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
]

export default function BusinessHoursBuilder({ hours, onChange }) {
  const updateDay = (day, field, value) => {
    onChange({
      ...hours,
      [day]: { ...hours[day], [field]: value },
    })
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
      {DAYS.map(({ key, label }) => {
        const day = hours[key] || { open: '09:00', close: '18:00', closed: false }
        return (
          <div key={key} className="flex items-center gap-4 px-4 py-3 bg-white">
            {/* Day label */}
            <span className="text-sm text-gray-700 w-24 flex-shrink-0 font-medium">
              {label}
            </span>

            {/* Closed toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={day.closed}
                onChange={(e) => updateDay(key, 'closed', e.target.checked)}
                className="w-4 h-4 accent-saffron-600"
              />
              <span className="text-xs text-gray-500">Closed</span>
            </label>

            {/* Time inputs */}
            {!day.closed && (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="time"
                  value={day.open}
                  onChange={(e) => updateDay(key, 'open', e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1
                             focus:outline-none focus:ring-2 focus:ring-saffron-600
                             text-gray-700 flex-1 min-w-0"
                />
                <span className="text-xs text-gray-400 flex-shrink-0">to</span>
                <input
                  type="time"
                  value={day.close}
                  onChange={(e) => updateDay(key, 'close', e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1
                             focus:outline-none focus:ring-2 focus:ring-saffron-600
                             text-gray-700 flex-1 min-w-0"
                />
              </div>
            )}

            {day.closed && (
              <span className="text-xs text-gray-400 italic">Closed all day</span>
            )}
          </div>
        )
      })}
    </div>
  )
}