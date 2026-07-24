import { useState, useEffect, useCallback } from 'react'
import { getMyListings, deleteListing as deleteListingApi } from '../api/listings'

/**
 * Hook for the Dashboard — loads the current user's listings
 * and exposes a delete function with optimistic UI removal.
 */
export function useMyListings() {
  const [listings, setListings]   = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getMyListings()
      setListings(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load listings')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const removeListing = async (id) => {
    // Optimistic removal — remove from UI immediately
    setListings((prev) => prev.filter((l) => l._id !== id))
    try {
      await deleteListingApi(id)
    } catch {
      // Rollback on failure
      load()
    }
  }

  return { listings, isLoading, error, reload: load, removeListing }
}

/**
 * Hook for the public listing page — loads a single listing by slug.
 */
export function useListingBySlug(slug) {
  const [listing, setListing]   = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)
    import('../api/listings')
      .then(({ getListingBySlug }) => getListingBySlug(slug))
      .then((res) => setListing(res.data.data))
      .catch((err) => setError(err.response?.data?.detail || 'Listing not found'))
      .finally(() => setIsLoading(false))
  }, [slug])

  return { listing, isLoading, error }
}