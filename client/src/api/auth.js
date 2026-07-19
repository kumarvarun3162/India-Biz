import axiosInstance from './axiosInstance'

export const registerUser = (data) =>
  axiosInstance.post('/api/auth/register', data)

export const loginUser = (data) =>
  axiosInstance.post('/api/auth/login', data)

export const getMe = () =>
  axiosInstance.get('/api/auth/me')