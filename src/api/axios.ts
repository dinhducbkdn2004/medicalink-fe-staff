import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// Base API configuration
const API_BASE_URL = (import.meta.env['VITE_API_BASE_URL'] as string) || 'https://medicalink-be.onrender.com'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 - Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })
          
          const { accessToken } = response.data as { accessToken: string }
          localStorage.setItem('accessToken', accessToken)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return await api(originalRequest)
        }
      } catch {
        // Refresh failed, redirect to login
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(new Error('Refresh token failed'))
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Forbidden - redirect to 403 page
      window.location.href = '/403'
    }

    return Promise.reject(error)
  }
)

export default api

// Export types for API responses (updated to match backend structure)
export interface ApiResponse<T = unknown> {
  data: T
  message: string
  statusCode: number
  timestamp: string
  path: string
}

export interface ApiError {
  message: string
  statusCode: number
  timestamp: string
  path: string
  error?: string
}
