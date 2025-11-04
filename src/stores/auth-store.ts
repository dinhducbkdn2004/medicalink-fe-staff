/**
 * Authentication Store
 * Manages user authentication state using Zustand
 * Persists tokens in localStorage and user data in memory
 */
import { create } from 'zustand'
import type { User } from '@/api/types/auth.types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
}

// Storage keys
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

// Helper functions for localStorage
const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

const getStoredRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

const setStoredTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

const setStoredUser = (user: User): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const clearStorage = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const useAuthStore = create<AuthState>()((set) => ({
  // Initial state from localStorage
  user: getStoredUser(),
  accessToken: getStoredAccessToken(),
  refreshToken: getStoredRefreshToken(),
  isAuthenticated: !!getStoredAccessToken(),

  // Set full authentication (after login)
  setAuth: (user, accessToken, refreshToken) => {
    setStoredUser(user)
    setStoredTokens(accessToken, refreshToken)
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    })
  },

  // Update user data only
  setUser: (user) => {
    setStoredUser(user)
    set({ user })
  },

  // Update tokens only (after refresh)
  setTokens: (accessToken, refreshToken) => {
    setStoredTokens(accessToken, refreshToken)
    set({ accessToken, refreshToken })
  },

  // Clear all authentication data (logout)
  clearAuth: () => {
    clearStorage()
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  },
}))
