/**
 * Authentication API Service
 * Handles all authentication-related API calls
 * Base URL: /api/auth
 */
import { apiClient } from '../core/client'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  ChangePasswordRequest,
  VerifyPasswordRequest,
  SuccessResponse,
} from '../types/auth.types'

/**
 * POST /api/auth/login
 * Authenticate user credentials and return access/refresh tokens
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials
  )
  return response.data
}

/**
 * POST /api/auth/refresh
 * Refresh the access token using a valid refresh token
 */
export async function refreshToken(
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>(
    '/auth/refresh',
    data
  )
  return response.data
}

/**
 * GET /api/auth/profile
 * Get the currently authenticated user's profile information
 */
export async function getProfile(): Promise<User> {
  const response = await apiClient.get<User>('/auth/profile')
  return response.data
}

/**
 * POST /api/auth/change-password
 * Change the current user's password
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<SuccessResponse> {
  const response = await apiClient.post<SuccessResponse>(
    '/auth/change-password',
    data
  )
  return response.data
}

/**
 * POST /api/auth/verify-password
 * Verify if the provided password matches the current user's password
 */
export async function verifyPassword(
  data: VerifyPasswordRequest
): Promise<SuccessResponse> {
  const response = await apiClient.post<SuccessResponse>(
    '/auth/verify-password',
    data
  )
  return response.data
}

// Export all auth services as a single object for convenience
export const authService = {
  login,
  refreshToken,
  getProfile,
  changePassword,
  verifyPassword,
}

export default authService
