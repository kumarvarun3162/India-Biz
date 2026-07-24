import { useParams, Link } from 'react-router-dom'
import { useListingBySlug } from '../hooks/useListing'

const CATEGORY_ICONS = {
  restaurant: '🍽️', grocery: '🛒', mechanic: '🔧',
  salon: '✂️', medical: '💊', tailor: '🧵',
  electronics: '📱', tutor: '📚', hardware: '🏗️', other: '🏪',
}

const DAYS = ['mon','tue','wed','thu','fri','sat','sun']
const DAY_LABELS = { mon:'Monday', tue:'Tuesday', wed:'Wednesday',
  thu:'Thursday', fri:'Friday', sat:'Saturday', sun:'Sunday' }

export default function PublicListing() {
  const { slug } = useParams()
  const { listing, isLoading, error } = useListingBySlug(slug)

  if (isLoading) return (
    <div className="max-w-3xl mx-auto px-4 py-16 flex justify-center">
      <div className="w-8 h-8 border-2 border-saffron-600 border-t-transparent
                      rounded-full animate-spin" />
    </div>
  )

  if (error || !listing) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🏚️</div>
      <h1 className="text-xl font-semibold text-gray-800 mb-2">Listing not found</h1>
      <p className="text-gray-400 text-sm mb-6">
        This listing may have been removed or the link is incorrect.
      </p>
      <Link to="/" className="text-saffron-600 text-sm font-medium hover:underline">
        ← Back to home
      </Link>
    </div>
  )

  const icon     = CATEGORY_ICONS[listing.category] || '🏪'
  const today    = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
  const todayHrs = listing.hours?.[today]

  const handleWhatsApp = () => {
    const num  = listing.whatsapp || listing.phone
    const text = encodeURIComponent(`Hi, I found your listing on India Biz Listing. I'd like to know more about ${listing.business_name}.`)
    window.open(`https://wa.me/91${num}?text=${text}`, '_blank')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Hero card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8
                      shadow-sm mb-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-saffron-50 flex items-center
                          justify-center text-3xl flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {listing.business_name}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5 capitalize">
              {listing.category?.replace('-', ' ')}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              📍 {listing.address}, {listing.city} — {listing.pincode}
            </p>
          </div>
        </div>

        {/* Today's hours badge */}
        {todayHrs && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs
            font-medium mb-5 ${todayHrs.closed
              ? 'bg-red-50 text-red-600'
              : 'bg-green-50 text-green-700'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${todayHrs.closed ? 'bg-red-400' : 'bg-green-400'}`} />
            {todayHrs.closed ? 'Closed today' : `Open today: ${todayHrs.open} – ${todayHrs.close}`}
          </div>
        )}

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          {listing.description}
        </p>

        {/* CTA buttons */}
        <div className="flex gap-3 flex-wrap">
          
            href={`tel:${listing.phone}`}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2
                       py-3 bg-saffron-600 text-white text-sm font-semibold
                       rounded-xl hover:bg-saffron-700 transition-colors"
          >
            📞 Call now
          </a>

          {(listing.whatsapp || listing.phone) && (
            <button
              onClick={handleWhatsApp}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2
                         py-3 bg-green-500 text-white text-sm font-semibold
                         rounded-xl hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp
            </button>
          )}

          {listing.website && (
            
              href={listing.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3
                         border border-gray-200 text-gray-700 text-sm font-medium
                         rounded-xl hover:bg-gray-50 transition-colors"
            >
              🌐 Website
            </a>
          )}
        </div>
      </div>

      {/* Contact details */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase
                       tracking-wide text-gray-400">Contact</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-400 w-5">📞</span>
            <a href={`tel:${listing.phone}`} className="text-gray-700 hover:text-saffron-600">
              {listing.phone}
            </a>
          </div>
          {listing.email && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400 w-5">✉️</span>
              <a href={`mailto:${listing.email}`} className="text-gray-700 hover:text-saffron-600">
                {listing.email}
              </a>
            </div>
          )}
          {listing.website && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400 w-5">🌐</span>
              <a href={listing.website} target="_blank" rel="noopener noreferrer"
                 className="text-gray-700 hover:text-saffron-600 truncate">
                {listing.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer breadcrumb */}
      <p className="text-center text-xs text-gray-300 mt-8">
        Listed on{' '}
        <Link to="/" className="text-saffron-600 hover:underline">
          India Biz Listing
        </Link>
        {' '}· {listing.views_total} views
      </p>
    </div>
  )
}