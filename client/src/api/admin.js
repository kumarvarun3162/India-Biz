import axiosInstance from './axiosInstance'

export const getAdminStats    = ()       => axiosInstance.get('/api/admin/stats')
export const getAdminUsers    = (params) => axiosInstance.get('/api/admin/users', { params })
export const getAdminListings = (params) => axiosInstance.get('/api/admin/listings', { params })
export const getAdminAnalytics = ()      => axiosInstance.get('/api/admin/analytics')
export const suspendUser      = (id, is_suspended) =>
  axiosInstance.patch(`/api/admin/users/${id}/suspend`, { is_suspended })
export const updateListingAdmin = (id, data) =>
  axiosInstance.patch(`/api/admin/listings/${id}`, data)
export const deleteListingAdmin = (id) =>
  axiosInstance.delete(`/api/admin/listings/${id}`)