import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useListingBySlug } from '../hooks/useListing'
import { trackEvent } from '../api/analytics'

const CAT_ICONS = {
  restaurant:'🍽️', grocery:'🛒', mechanic:'🔧', salon:'✂️',
  medical:'💊', tailor:'🧵', electronics:'📱', tutor:'📚',
  hardware:'🏗️', other:'🏪',
}

const DAYS     = ['mon','tue','wed','thu','fri','sat','sun']
const DAY_FULL = {
  mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday',
  fri:'Friday', sat:'Saturday', sun:'Sunday',
}

export default function PublicListing() {
  const { slug } = useParams()
  const { listing, isLoading, error } = useListingBySlug(slug)
  const [lightbox, setLightbox] = useState(null)

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-9 h-9 border-2 border-navy-600 border-t-transparent
                      rounded-full animate-spin" />
    </div>
  )

  if (error || !listing) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center
                    text-center px-4">
      <div>
        <div className="text-5xl mb-4">🏚️</div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Listing not found
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          This listing may have been removed or the link is incorrect.
        </p>
        <Link to="/browse"
          className="text-navy-600 text-sm font-medium hover:underline min-h-0">
          ← Browse all businesses
        </Link>
      </div>
    </div>
  )

  const icon     = CAT_ICONS[listing.category] || '🏪'
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const today    = DAYS[todayIdx]
  const todayHrs = listing.hours?.[today]

  const handleCall = () => {
    if (listing._id) trackEvent(listing._id, 'phone')
  }

  const handleWhatsApp = () => {
    if (listing._id) trackEvent(listing._id, 'whatsapp')
    const num  = listing.whatsapp || listing.phone
    const text = encodeURIComponent(
      `Hi, I found your listing on India-Biz. ` +
      `I'd like to know more about ${listing.business_name}.`
    )
    window.open(`https://wa.me/91${num}?text=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Cover ── */}
      <div className="bg-navy-600 h-32 sm:h-44 flex items-center
                      justify-center text-6xl sm:text-7xl relative">
        {listing.images?.length > 0 ? (
          <img src={listing.images[0]} alt={listing.business_name}
            className="w-full h-full object-cover absolute inset-0" />
        ) : (
          <span className="relative z-10">{icon}</span>
        )}
        <div className="absolute inset-0 bg-navy-900/30" />
      </div>

      {/* ── Main card ── */}
      <div className="max-w-2xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm
                        -mt-6 relative z-10 p-5 mb-4">

          {/* Business name + category */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-navy-50 border border-navy-100
                            flex items-center justify-center text-2xl flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {listing.business_name}
              </h1>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">
                {listing.category?.replace('-', ' ')}
              </p>
            </div>
          </div>

          {/* Location */}
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-3">
            <span>📍</span>
            <span>{listing.address}, {listing.city} — {listing.pincode}</span>
          </p>

          {/* Today's hours badge */}
          {todayHrs && (
            <div className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
              text-xs font-medium mb-4
              ${todayHrs.closed
                ? 'bg-red-50 text-red-600'
                : 'bg-green-50 text-green-700'}
            `}>
              <span className={`w-1.5 h-1.5 rounded-full
                ${todayHrs.closed ? 'bg-red-400' : 'bg-green-500'}`} />
              {todayHrs.closed
                ? 'Closed today'
                : `Open today · ${todayHrs.open} – ${todayHrs.close}`}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            {listing.description}
          </p>

          {/* CTA buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${listing.phone}`} onClick={handleCall}
              className="flex items-center justify-center gap-2 py-3.5
                         bg-navy-600 hover:bg-navy-700 text-white text-sm
                         font-semibold rounded-2xl transition-colors min-h-0">
              📞 Call now
            </a>
            {(listing.whatsapp || listing.phone) && (
              <button onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-3.5
                           bg-[#25d366] hover:bg-[#1fb855] text-white text-sm
                           font-semibold rounded-2xl transition-colors min-h-0">
                💬 WhatsApp
              </button>
            )}
            {listing.website && (
              <a href={listing.website} target="_blank" rel="noopener noreferrer"
                className="col-span-2 flex items-center justify-center gap-2
                           py-3 border border-gray-200 text-gray-600 text-sm
                           font-medium rounded-2xl hover:bg-gray-50
                           transition-colors min-h-0">
                🌐 Visit website
              </a>
            )}
          </div>
        </div>

        {/* ── Offers ── */}
        {listing.offers && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50
                          border border-amber-200 rounded-2xl p-4 mb-4">
            <p className="text-sm font-semibold text-amber-800 mb-2">
              🎁 Offers &amp; Schemes
            </p>
            <p className="text-sm text-amber-700 leading-relaxed whitespace-pre-line">
              {listing.offers}
            </p>
          </div>
        )}

        {/* ── Photos ── */}
        {listing.images?.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase
                          tracking-wider mb-3">
              Photos
            </p>
            <div className="grid grid-cols-3 gap-2">
              {listing.images.map((url, i) => (
                <button key={i} onClick={() => setLightbox(i)}
                  className="aspect-square rounded-xl overflow-hidden
                             hover:opacity-90 transition-opacity min-h-0">
                  <img src={url}
                    alt={`${listing.business_name} ${i + 1}`}
                    className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Contact ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase
                        tracking-wider mb-3">
            Contact
          </p>
          <div className="flex flex-col gap-2.5">
            <a href={`tel:${listing.phone}`}
              className="flex items-center gap-3 text-sm text-gray-700
                         hover:text-navy-600 transition-colors min-h-0">
              <span className="w-7 h-7 bg-navy-50 rounded-full flex items-center
                               justify-center text-navy-600 text-sm flex-shrink-0">
                📞
              </span>
              {listing.phone}
            </a>
            {listing.email && (
              <a href={`mailto:${listing.email}`}
                className="flex items-center gap-3 text-sm text-gray-700
                           hover:text-navy-600 transition-colors min-h-0">
                <span className="w-7 h-7 bg-navy-50 rounded-full flex items-center
                                 justify-center text-navy-600 text-sm flex-shrink-0">
                  ✉️
                </span>
                {listing.email}
              </a>
            )}
            {listing.website && (
              <a href={listing.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-700
                           hover:text-navy-600 transition-colors min-h-0 truncate">
                <span className="w-7 h-7 bg-navy-50 rounded-full flex items-center
                                 justify-center text-navy-600 text-sm flex-shrink-0">
                  🌐
                </span>
                <span className="truncate">{listing.website}</span>
              </a>
            )}
          </div>
        </div>

        {/* ── Hours ── */}
        {listing.hours && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase
                          tracking-wider mb-3">
              Business hours
            </p>
            <div className="flex flex-col divide-y divide-gray-50">
              {DAYS.map((d) => {
                const h       = listing.hours[d]
                const isToday = d === today
                return (
                  <div key={d}
                    className={`flex justify-between items-center py-2.5 text-sm
                      ${isToday
                        ? 'font-semibold text-navy-700'
                        : 'text-gray-500'
                      }`}>
                    <span className="flex items-center gap-2">
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full
                                         bg-navy-500 flex-shrink-0" />
                      )}
                      {DAY_FULL[d]}
                    </span>
                    {h?.closed
                      ? <span className="text-red-400 text-xs">Closed</span>
                      : <span>{h?.open} – {h?.close}</span>
                    }
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="text-center text-xs text-gray-300 pb-8">
          Listed on{' '}
          <Link to="/" className="text-navy-400 hover:underline min-h-0">
            India-Biz
          </Link>
          {' '}· {listing.views_total || 0} views
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && listing.images?.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center
                        justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 text-white
                       rounded-full flex items-center justify-center text-xl
                       hover:bg-white/20 transition-colors min-h-0">
            ×
          </button>
          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}
              className="absolute left-4 w-10 h-10 bg-white/10 text-white
                         rounded-full flex items-center justify-center text-2xl
                         hover:bg-white/20 transition-colors min-h-0">
              ‹
            </button>
          )}
          <img src={listing.images[lightbox]}
            alt={`Photo ${lightbox + 1}`}
            className="max-h-[85vh] max-w-full object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()} />
          {lightbox < listing.images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}
              className="absolute right-4 w-10 h-10 bg-white/10 text-white
                         rounded-full flex items-center justify-center text-2xl
                         hover:bg-white/20 transition-colors min-h-0">
              ›
            </button>
          )}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white
                          text-xs bg-white/10 px-3 py-1 rounded-full">
            {lightbox + 1} / {listing.images.length}
          </div>
        </div>
      )}
    </div>
  )
}