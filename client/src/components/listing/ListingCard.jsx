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
      bg-white border rounded-2xl p-5 flex flex-col gap-4 transition-shadow
      hover:shadow-md
      ${listing.is_active ? 'border-gray-200' : 'border-gray-100 opacity-70'}
    `}>
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-saffron-50 flex items-center
                        justify-center text-xl flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-sm">
            {listing.business_name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            {listing.city}, {listing.state}
          </p>
        </div>
        {/* Status badge */}
        <span className={`
          text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0
          ${listing.is_active
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
          }
        `}>
          {listing.is_active ? 'Live' : 'Inactive'}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {listing.description}
      </p>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>👁 {listing.views_total || 0} views</span>
        <span>📞 {listing.phone}</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-1 border-t border-gray-100">
        {/* View public page */}
        
          href={`/listing/${listing.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs font-medium text-saffron-600
                     py-1.5 rounded-lg hover:bg-saffron-50 transition-colors"
        >
          View listing ↗
        </a>

        {/* Edit */}
        <Link
          to={`/listing/edit/${listing._id}`}
          className="flex-1 text-center text-xs font-medium text-gray-600
                     py-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
        >
          Edit
        </Link>

        {/* Delete */}
        <button
          onClick={() => onDelete(listing._id, listing.business_name)}
          className="flex-1 text-center text-xs font-medium text-red-500
                     py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  )
}