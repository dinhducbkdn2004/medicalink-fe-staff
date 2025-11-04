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
      // Data is already unwrapped by API client interceptor
      const { user, access_token, refresh_token } = data

      if (!user || !access_token || !refresh_token) {
        toast.error(
          'Login successful but unable to parse response. Please try again.'
        )
        return
      }

      // Store auth data in Zustand store (which also saves to localStorage)
      setAuth(user, access_token, refresh_token)

      toast.success(`Welcome back, ${user.fullName}!`)

      // Redirect to dashboard
      navigate({ to: '/', replace: true })
    },
    onError: () => {
      // Error already handled by apiClient interceptor
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
    onError: () => {
      // Error already handled by apiClient interceptor
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
    onError: () => {
      // Error already handled by apiClient interceptor
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
