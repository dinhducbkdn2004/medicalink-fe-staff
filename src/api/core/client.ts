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

/**
 * Flag to prevent multiple simultaneous refresh token requests
 */
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

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
  (response: AxiosResponse) => {
    // Auto-unwrap data field from API response wrapper
    // API returns: { success, message, data, meta?, timestamp, path, method, statusCode }
    // For paginated responses, preserve both data and meta
    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data
    ) {
      // Check if this is a paginated response (has meta field)
      if ('meta' in response.data) {
        return {
          ...response,
          data: {
            data: response.data.data,
            meta: response.data.meta,
          },
        }
      }
      // Regular response - just unwrap data
      return {
        ...response,
        data: response.data.data,
      }
    }
    return response
  },
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

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Call refresh endpoint with correct field name
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refresh_token: refreshToken, // Use refresh_token as per API spec
        })

        // Handle both wrapped and unwrapped response structures
        // API may return: { data: { access_token, refresh_token } }
        // or directly: { access_token, refresh_token }
        const responseData = response.data.data || response.data
        const newAccessToken = responseData.access_token
        const newRefreshToken = responseData.refresh_token

        if (!newAccessToken || !newRefreshToken) {
          throw new Error('Invalid refresh token response')
        }

        // Update tokens in localStorage
        localStorage.setItem('access_token', newAccessToken)
        localStorage.setItem('refresh_token', newRefreshToken)

        // Update Authorization header for original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        // Update auth store if available (for UI sync)
        try {
          const { useAuthStore } = await import('@/stores/auth-store')
          const store = useAuthStore.getState()
          store.setTokens(newAccessToken, newRefreshToken)
        } catch {
          // Store not available, tokens are already in localStorage
        }

        // Process queued requests
        processQueue(null, newAccessToken)
        isRefreshing = false

        // Retry the original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Process queued requests with error
        processQueue(refreshError, null)
        isRefreshing = false

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
