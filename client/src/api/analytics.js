import axiosInstance from './axiosInstance'

export const getListingAnalytics = (listingId, days = 30) =>
  axiosInstance.get(`/api/analytics/${listingId}`, { params: { days } })

export const trackEvent = (listingId, eventType) =>
  axiosInstance.post('/api/analytics/event', {
    listing_id: listingId,
    event_type: eventType,
  }).catch(() => {})  // silent fail — never block the UI for tracking