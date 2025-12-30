import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { toast } from 'sonner'

const API_BASE_URL =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta.env as any).VITE_APP_ENVIRONMENT === 'production'
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (import.meta.env as any).VITE_API_BASE_URL_PRO ||
      'https://api.medicalink.click'
    : ''

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

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
  withCredentials: false,
})

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

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      'data' in response.data
    ) {
      if ('meta' in response.data) {
        return {
          ...response,
          data: {
            data: response.data.data,
            meta: response.data.meta,
          },
        }
      }
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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      const refreshToken = localStorage.getItem('refresh_token')

      if (!refreshToken) {
        handleLogout('Session expired. Please sign in again.')
        return Promise.reject(error)
      }

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
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refresh_token: refreshToken,
        })
        const responseData = response.data.data || response.data
        const newAccessToken = responseData.access_token
        const newRefreshToken = responseData.refresh_token

        if (!newAccessToken || !newRefreshToken) {
          throw new Error('Invalid refresh token response')
        }

        localStorage.setItem('access_token', newAccessToken)
        localStorage.setItem('refresh_token', newRefreshToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        try {
          const { useAuthStore } = await import('@/stores/auth-store')
          const store = useAuthStore.getState()
          store.setTokens(newAccessToken, newRefreshToken)
        } catch {
          void 0
        }

        processQueue(null, newAccessToken)
        isRefreshing = false

        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false

        handleLogout('Session expired. Please sign in again.')
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status === 400) {
      const data = error.response.data

      if (data?.details && Array.isArray(data.details)) {
        const firstError = data.details[0]
        const constraintMessages = Object.values(firstError?.constraints || {})
        const errorMessage =
          constraintMessages[0] || data.message || 'Validation failed'
        toast.error(errorMessage)
      } else {
        toast.error(data?.message || 'Invalid request data')
      }
    } else if (error.response) {
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
      toast.error(
        'Unable to connect to server. Please check your network connection'
      )
    } else {
      toast.error('An error occurred. Please try again')
    }

    return Promise.reject(error)
  }
)

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
