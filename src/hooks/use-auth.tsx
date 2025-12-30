
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


export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
}


export function useLogin() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      
      const { user, access_token, refresh_token } = data

      if (!user || !access_token || !refresh_token) {
        toast.error(
          'Login successful but unable to parse response. Please try again.'
        )
        return
      }

      
      setAuth(user, access_token, refresh_token)

      toast.success(`Welcome back, ${user.fullName}!`)

      
      navigate({ to: '/', replace: true })
    },
    onError: () => {
      
    },
  })
}


export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      
      clearAuth()

      
      queryClient.clear()
    },
    onSuccess: () => {
      toast.success('You have been signed out')
      navigate({ to: '/sign-in', replace: true })
    },
  })
}


export function useProfile() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, 
    retry: 1,
  })
}


export function useChangePassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      authService.changePassword(data),
    onSuccess: (data) => {
      toast.success(data.message || 'Password changed successfully')
      
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
    onError: () => {
      
    },
  })
}


export function useVerifyPassword() {
  return useMutation({
    mutationFn: (data: VerifyPasswordRequest) =>
      authService.verifyPassword(data),
    onSuccess: (data) => {
      
      return data
    },
    onError: () => {
      
    },
  })
}


export function useAuth() {
  const authState = useAuthStore()
  const profileQuery = useProfile()

  return {
    
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: profileQuery.isLoading,

    
    profile: profileQuery.data,

    
    clearAuth: authState.clearAuth,
    setAuth: authState.setAuth,
    setUser: authState.setUser,
  }
}
