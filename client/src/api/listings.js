import axiosInstance from './axiosInstance'

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories = () =>
  axiosInstance.get('/api/listings/categories')

// ── Public ────────────────────────────────────────────────────────────────────
export const getListings = (params = {}) =>
  axiosInstance.get('/api/listings', { params })

export const getListingBySlug = (slug) =>
  axiosInstance.get(`/api/listings/${slug}`)

// ── Authenticated ─────────────────────────────────────────────────────────────
export const getMyListings = () =>
  axiosInstance.get('/api/listings/mine')

export const createListing = (data) =>
  axiosInstance.post('/api/listings', data)

export const updateListing = (id, data) =>
  axiosInstance.put(`/api/listings/${id}`, data)

export const deleteListing = (id) =>
  axiosInstance.delete(`/api/listings/${id}`)