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
  RequestPasswordResetRequest,
  VerifyResetCodeRequest,
  ConfirmPasswordResetRequest,
} from '../types/auth.types'

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials
  )
  return response.data
}

export async function refreshToken(
  data: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>(
    '/auth/refresh',
    data
  )
  return response.data
}

export async function getProfile(): Promise<User> {
  const response = await apiClient.get<User>('/auth/profile')
  return response.data
}

export async function changePassword(
  data: ChangePasswordRequest
): Promise<SuccessResponse> {
  const response = await apiClient.post<SuccessResponse>(
    '/auth/change-password',
    data
  )
  return response.data
}

export async function verifyPassword(
  data: VerifyPasswordRequest
): Promise<SuccessResponse> {
  const response = await apiClient.post<SuccessResponse>(
    '/auth/verify-password',
    data
  )
  return response.data
}

export async function requestPasswordReset(
  data: RequestPasswordResetRequest
): Promise<SuccessResponse> {
  const response = await apiClient.post<SuccessResponse>(
    '/auth/password-reset/request',
    data
  )
  return response.data
}

export async function verifyResetCode(
  data: VerifyResetCodeRequest
): Promise<SuccessResponse> {
  const response = await apiClient.post<SuccessResponse>(
    '/auth/password-reset/verify-code',
    data
  )
  return response.data
}

export async function confirmPasswordReset(
  data: ConfirmPasswordResetRequest
): Promise<SuccessResponse> {
  const response = await apiClient.post<SuccessResponse>(
    '/auth/password-reset/confirm',
    data
  )
  return response.data
}

export const authService = {
  login,
  refreshToken,
  getProfile,
  changePassword,
  verifyPassword,
  requestPasswordReset,
  verifyResetCode,
  confirmPasswordReset,
}

export default authService
