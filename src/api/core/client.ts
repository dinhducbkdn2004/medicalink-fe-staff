import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { toast } from 'sonner'

const API_BASE_URL =
  import.meta.env.VITE_APP_ENVIRONMENT === 'production'
    ? import.meta.env.VITE_API_BASE_URL_PRO || 'https://api.medicalink.online'
    : 'http://localhost:3000'

const refreshClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })
  failedQueue = []
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error)
)

interface ErrorResponse {
  message?: string
  details?: Array<{ property: string; constraints: Record<string, string> }>
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data
    if (data && typeof data === 'object' && 'data' in data) {
      return {
        ...response,
        data: 'meta' in data ? { data: data.data, meta: data.meta } : data.data,
      }
    }
    return response
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return handleApiError(error)
    }

    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      handleLogout('Session expired. Please sign in again.')
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return apiClient(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await refreshClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      })

      const responseData = data.data || data
      const newAccessToken = responseData.access_token
      const newRefreshToken = responseData.refresh_token

      if (!newAccessToken || !newRefreshToken) {
        throw new Error('Invalid refresh token response')
      }

      localStorage.setItem('access_token', newAccessToken)
      localStorage.setItem('refresh_token', newRefreshToken)

      apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`

      try {
        const { useAuthStore } = await import('@/stores/auth-store')
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken)
      } catch {
        // ignore
      }

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      }

      processQueue(null, newAccessToken)
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      handleLogout('Session expired. Please sign in again.')
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
function handleApiError(error: AxiosError<ErrorResponse>) {
  const { response, request } = error

  if (response) {
    const { status, data } = response
    if (status === 400) {
      if (
        data?.details &&
        Array.isArray(data.details) &&
        data.details.length > 0
      ) {
        const constraintMessages = Object.values(
          data.details[0]?.constraints || {}
        )
        toast.error(
          (constraintMessages[0] as string) ||
            data.message ||
            'Validation failed'
        )
      } else {
        toast.error(data?.message || 'Invalid request data')
      }
    } else {
      const messages: Record<number, string> = {
        403: 'You do not have permission to access this resource',
        404: 'Resource not found',
        500: 'Internal server error. Please try again later',
        503: 'Service temporarily unavailable. Please try again later',
      }
      toast.error(data?.message || messages[status] || 'An error occurred')
    }
  } else if (request) {
    toast.error(
      'Unable to connect to server. Please check your network connection'
    )
  } else {
    toast.error('An error occurred. Please try again')
  }

  return Promise.reject(error)
}

function handleLogout(message?: string) {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')

  if (message) {
    toast.error(message)
  }

  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in'
  }
}

export default apiClient
