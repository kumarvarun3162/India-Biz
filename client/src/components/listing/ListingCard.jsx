import { Link } from 'react-router-dom'

const CATEGORY_ICONS = {
  restaurant: '🍽️', grocery: '🛒', mechanic: '🔧',
  salon: '✂️', medical: '💊', tailor: '🧵',
  electronics: '📱', tutor: '📚', hardware: '🏗️', other: '🏪',
}

export default function ListingCard({ listing, onDelete }) {
  const icon = CATEGORY_ICONS[listing.category] || '🏪'

  return (
    <div className={`
      bg-white rounded-2xl border overflow-hidden transition-shadow
      hover:shadow-md active:scale-[0.99]
      ${listing.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}
    `}>
      {/* Top */}
      <div className="p-4 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-navy-50 border border-navy-100
                        flex items-center justify-center text-xl flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">
            {listing.business_name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            📍 {listing.city}, {listing.state}
          </p>
        </div>
        <span className={`
          flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full
          ${listing.is_active
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'}
        `}>
          {listing.is_active ? 'Live' : 'Inactive'}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed px-4 pb-3
                    line-clamp-2">
        {listing.description}
      </p>

      {/* Stats + analytics link */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50
                      border-t border-gray-100 text-xs text-gray-500">
        <span>👁 {listing.views_total || 0}</span>
        <span className="text-gray-200">·</span>
        <span>📞 {listing.phone}</span>
        <Link to={`/analytics/${listing._id}`}
          className="ml-auto text-navy-600 font-medium text-xs
                     hover:underline min-h-0">
          Analytics →
        </Link>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 border-t border-gray-100">
        <a href={`/listing/${listing.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center py-3 text-xs font-medium
                     text-navy-600 hover:bg-navy-50 transition-colors min-h-0
                     gap-1">
          View ↗
        </a>
        <Link to={`/listing/edit/${listing._id}`}
          className="flex items-center justify-center py-3 text-xs font-medium
                     text-gray-600 hover:bg-gray-50 transition-colors
                     border-x border-gray-100 min-h-0">
          Edit
        </Link>
        <button onClick={() => onDelete(listing._id, listing.business_name)}
          className="flex items-center justify-center py-3 text-xs font-medium
                     text-red-400 hover:bg-red-50 transition-colors min-h-0">
          Delete
        </button>
      </div>
    </div>
  )
}