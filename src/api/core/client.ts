/**
 * API Client Configuration
 * Handles HTTP requests with automatic token management and error handling
 */
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { toast } from 'sonner'

const API_BASE_URL =
  import.meta.env['VITE_APP_ENVIRONMENT'] === 'production'
    ? import.meta.env['VITE_API_BASE_URL_PRO'] || 'https://api.medicalink.click'
    : import.meta.env['VITE_API_BASE_URL_DEV'] || 'http://localhost:3000'

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Note: withCredentials is false because we use localStorage for tokens
  // The API returns tokens in response body, not httpOnly cookies
  withCredentials: false,
})

// Request interceptor - Add access token to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (
    error: AxiosError<{
      message?: string
      details?: Array<{ property: string; constraints: Record<string, string> }>
    }>
  ) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Handle 401 Unauthorized - Token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      const refreshToken = localStorage.getItem('refresh_token')

      if (!refreshToken) {
        // No refresh token, redirect to login
        handleLogout('Session expired. Please sign in again.')
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        // Call refresh endpoint with correct field name
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refresh_token: refreshToken, // Use refresh_token as per API spec
        })

        const { access_token, refresh_token } = response.data

        if (access_token && refresh_token) {
          // Update tokens in localStorage
          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', refresh_token)

          // Update Authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`
          }

          // Retry the original request
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh token expired or invalid
        handleLogout('Session expired. Please sign in again.')
        return Promise.reject(refreshError)
      }
    }

    // Handle validation errors (400)
    if (error.response?.status === 400) {
      const data = error.response.data

      // Handle validation error with details
      if (data?.details && Array.isArray(data.details)) {
        const firstError = data.details[0]
        const constraintMessages = Object.values(firstError?.constraints || {})
        const errorMessage =
          constraintMessages[0] || data.message || 'Validation failed'
        toast.error(errorMessage)
      } else {
        toast.error(data?.message || 'Invalid request data')
      }
    }

    // Handle other errors
    else if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 403:
          toast.error(
            data?.message ||
              'You do not have permission to access this resource'
          )
          break
        case 404:
          toast.error(data?.message || 'Resource not found')
          break
        case 500:
          toast.error(
            data?.message || 'Internal server error. Please try again later'
          )
          break
        case 503:
          toast.error(
            data?.message ||
              'Service temporarily unavailable. Please try again later'
          )
          break
        default:
          toast.error(data?.message || 'An error occurred')
      }
    } else if (error.request) {
      // Request sent but no response received
      toast.error(
        'Unable to connect to server. Please check your network connection'
      )
    } else {
      // Other errors
      toast.error('An error occurred. Please try again')
    }

    return Promise.reject(error)
  }
)

/**
 * Handle logout and cleanup
 */
function handleLogout(message?: string) {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')

  if (message) {
    toast.error(message)
  }

  // Redirect to sign in page
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in'
  }
}

export default apiClient
