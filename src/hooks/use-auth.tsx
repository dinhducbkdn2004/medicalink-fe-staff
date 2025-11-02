/**
 * Authentication React Query Hooks
 * Provides hooks for all authentication operations with optimistic updates
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { authService } from '@/api/services/auth.service'
import type {
  LoginRequest,
  ChangePasswordRequest,
  VerifyPasswordRequest,
} from '@/api/types/auth.types'
import { useAuthStore } from '@/stores/auth-store'

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
}

/**
 * Hook for user login
 */
export function useLogin() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      console.log('Login response data:', data)

      // Handle potential nested data structure
      const responseData = data as any
      const user = responseData.user || responseData.data?.user
      const accessToken =
        responseData.access_token || responseData.data?.access_token
      const refreshToken =
        responseData.refresh_token || responseData.data?.refresh_token

      if (!user || !accessToken || !refreshToken) {
        console.error('Invalid response structure:', data)
        toast.error(
          'Login successful but unable to parse response. Please try again.'
        )
        return
      }

      // Store auth data in Zustand store (which also saves to localStorage)
      setAuth(user, accessToken, refreshToken)

      toast.success(`Welcome back, ${user.fullName}!`)

      // Redirect to dashboard
      navigate({ to: '/', replace: true })
    },
    onError: (error: any) => {
      // Error already handled by apiClient interceptor
      console.error('Login error:', error)
    },
  })
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      // Clear auth state
      clearAuth()

      // Clear all queries
      queryClient.clear()
    },
    onSuccess: () => {
      toast.success('You have been signed out')
      navigate({ to: '/sign-in', replace: true })
    },
  })
}

/**
 * Hook to fetch user profile
 * Automatically fetches when user is authenticated
 */
export function useProfile() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Password changed successfully')
      // Invalidate profile query to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
    onError: (error: any) => {
      // Error already handled by apiClient interceptor
      console.error('Change password error:', error)
    },
  })
}

/**
 * Hook to verify password
 */
export function useVerifyPassword() {
  return useMutation({
    mutationFn: (data: VerifyPasswordRequest) =>
      authService.verifyPassword(data),
    onSuccess: (data) => {
      // Don't show toast by default, let the caller handle it
      return data
    },
    onError: (error: any) => {
      // Error already handled by apiClient interceptor
      console.error('Verify password error:', error)
    },
  })
}

/**
 * Hook to get current auth state
 * Useful for checking authentication status in components
 */
export function useAuth() {
  const authState = useAuthStore()
  const profileQuery = useProfile()

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: profileQuery.isLoading,

    // Profile data (potentially more up-to-date than store)
    profile: profileQuery.data,

    // Actions
    clearAuth: authState.clearAuth,
    setAuth: authState.setAuth,
    setUser: authState.setUser,
  }
}
