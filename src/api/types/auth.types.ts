import { z } from 'zod'

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR'

export interface User {
  id: string
  fullName: string
  email: string
  role: UserRole
  phone?: string
  isMale?: boolean | null
  dateOfBirth?: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}
export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface VerifyPasswordRequest {
  password: string
}

export interface SuccessResponse {
  success: true
  message: string
}

export interface ErrorResponse {
  success: false
  message: string
  error: string
  statusCode: number
  timestamp: string
  path: string
  method: string
}

export interface ValidationErrorDetail {
  property: string
  value: string
  constraints: Record<string, string>
}

export interface ValidationErrorResponse {
  message: string
  error: string
  statusCode: 400
  details: ValidationErrorDetail[]
}

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email')
    .email('Please provide a valid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must not exceed 50 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Please enter your current password')
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must not exceed 50 characters'),
    newPassword: z
      .string()
      .min(1, 'Please enter your new password')
      .min(8, 'New password must be at least 8 characters')
      .max(50, 'New password must not exceed 50 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'New password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export const verifyPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must not exceed 50 characters'),
})

export type VerifyPasswordFormData = z.infer<typeof verifyPasswordSchema>

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'DOCTOR']),
  phone: z.string().optional(),
  isMale: z.boolean().nullable().optional(),
  dateOfBirth: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const loginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: userSchema,
})

export interface RequestPasswordResetRequest {
  email: string
}

export interface VerifyResetCodeRequest {
  email: string
  code: string
}

export interface ConfirmPasswordResetRequest {
  email: string
  code: string
  newPassword: string
}

export const requestPasswordResetSchema = z.object({
  email: z
    .string()
    .min(1, 'Please enter your email')
    .email('Please provide a valid email address')
    .toLowerCase(),
})

export type RequestPasswordResetFormData = z.infer<
  typeof requestPasswordResetSchema
>

export const verifyResetCodeSchema = z.object({
  email: z.string().email(),
  code: z
    .string()
    .min(6, 'Code must be 6 digits')
    .max(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must be numeric'),
})

export type VerifyResetCodeFormData = z.infer<typeof verifyResetCodeSchema>

export const confirmPasswordResetSchema = z
  .object({
    email: z.string().email(),
    code: z.string().min(6).max(6),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must not exceed 50 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ConfirmPasswordResetFormData = z.infer<
  typeof confirmPasswordResetSchema
>
