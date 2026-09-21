import { useState, useEffect, useCallback } from 'react'
import { getListingAnalytics } from '../api/analytics'

export function useAnalytics(listingId, initialDays = 30) {
  const [data, setData]         = useState(null)
  const [days, setDays]         = useState(initialDays)
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState(null)

  const load = useCallback(async () => {
    if (!listingId) return
    setLoading(true)
    setError(null)
    try {
      const res = await getListingAnalytics(listingId, days)
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [listingId, days])

  useEffect(() => { load() }, [load])

  return { data, isLoading, error, days, setDays, reload: load }
}