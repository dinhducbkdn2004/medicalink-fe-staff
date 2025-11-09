/**
 * Doctor Module Types
 * Based on /api/doctors API specification
 */
import { z } from 'zod'
import type { Specialty, WorkLocation } from '@/api/types/doctor.types'

// ============================================================================
// Base Types - Re-export from API
// ============================================================================

export type { Specialty, WorkLocation } from '@/api/types/doctor.types'

// ============================================================================
// Doctor Account Types
// ============================================================================

export interface DoctorAccount {
  id: string
  fullName: string
  email: string
  role: 'DOCTOR'
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  createdAt: string
  updatedAt?: string
}

export interface DoctorProfile {
  id: string
  staffAccountId: string
  isActive: boolean
  degree?: string
  position?: string[]
  introduction?: string
  memberships?: string[]
  awards?: string[]
  research?: string
  trainingProcess?: string[]
  experience?: string[]
  avatarUrl?: string
  portrait?: string
  specialties?: Specialty[]
  workLocations?: WorkLocation[]
  createdAt: string
  updatedAt: string
}

// Extended DoctorWithProfile type for GET /api/doctors endpoint
// Backend returns flat structure with profile fields merged at root level
export interface DoctorWithProfile {
  // Account fields
  id: string
  fullName: string
  email: string
  role: 'DOCTOR'
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  createdAt: string

  // Profile data (optional, may not exist)
  profile?: DoctorProfile

  // Profile fields at root level (merged by backend)
  profileId?: string
  isActive?: boolean
  degree?: string
  position?: string[]
  introduction?: string
  memberships?: string[]
  awards?: string[]
  research?: string
  trainingProcess?: string[]
  experience?: string[]
  avatarUrl?: string
  portrait?: string
  specialties?: Specialty[]
  workLocations?: WorkLocation[]
  profileCreatedAt?: string
  profileUpdatedAt?: string
  accountUpdatedAt?: string
}

// Complete doctor data - API GET /api/doctors/:id/complete returns flat structure
// This API always returns complete data (account + profile merged), so fields are NOT optional
export interface CompleteDoctorData {
  // From DoctorAccount (required fields)
  id: string
  fullName: string
  email: string
  role: string
  // From DoctorAccount (optional fields)
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  createdAt?: string
  updatedAt?: string
  // From DoctorProfile (required fields)
  profileId: string
  isActive: boolean
  // From DoctorProfile (optional fields)
  degree?: string
  position?: string[]
  introduction?: string
  memberships?: string[]
  awards?: string[]
  research?: string
  trainingProcess?: string[]
  experience?: string[]
  avatarUrl?: string
  portrait?: string
  specialties?: Specialty[]
  workLocations?: WorkLocation[]
  profileCreatedAt?: string
  profileUpdatedAt?: string
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface DoctorListParams {
  page?: number
  limit?: number
  role?: 'DOCTOR'
  search?: string
  email?: string
  isMale?: boolean
  isActive?: boolean
  createdFrom?: string
  createdTo?: string
  sortBy?: 'createdAt' | 'fullName' | 'email'
  sortOrder?: 'asc' | 'desc'
}

export interface DoctorListResponse {
  data: DoctorWithProfile[]
  meta: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface DoctorStatsResponse {
  total: number
  active: number
  inactive: number
  recentlyCreated: number
}

export interface CreateDoctorRequest {
  fullName: string
  email: string
  password: string
  role?: 'DOCTOR'
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
}

export interface CreateDoctorResponse {
  success: true
  message: string
  data: {
    accountId: string
    profileId: string
    correlationId: string
  }
}

export interface UpdateDoctorAccountRequest {
  fullName?: string
  email?: string
  password?: string
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
}

// ============================================================================
// Doctor Profile Types
// ============================================================================

export interface PublicDoctorProfileParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  specialtyIds?: string[]
  workLocationIds?: string[]
}

export interface CreateDoctorProfileRequest {
  staffAccountId: string
  isActive?: boolean
  degree?: string
  position?: string[]
  introduction?: string
  memberships?: string[]
  awards?: string[]
  research?: string
  trainingProcess?: string[]
  experience?: string[]
  avatarUrl?: string
  portrait?: string
  specialtyIds?: string[]
  locationIds?: string[]
}

export interface UpdateDoctorProfileRequest {
  degree?: string
  position?: string[]
  introduction?: string
  memberships?: string[]
  awards?: string[]
  research?: string
  trainingProcess?: string[]
  experience?: string[]
  avatarUrl?: string
  portrait?: string
  specialtyIds?: string[]
  locationIds?: string[]
}

export interface ToggleActiveRequest {
  isActive: boolean
}

// ============================================================================
// Zod Validation Schemas
// ============================================================================

export const createDoctorSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().toLowerCase(),
  password: z
    .string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain uppercase, lowercase, and number',
    }),
  role: z.literal('DOCTOR').optional(),
  phone: z.string().optional(),
  isMale: z.boolean().optional(),
  dateOfBirth: z.string().optional(),
})

export const updateDoctorAccountSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  email: z.string().email().toLowerCase().optional(),
  password: z
    .string()
    .min(8)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain uppercase, lowercase, and number',
    })
    .optional(),
  phone: z.string().optional(),
  isMale: z.boolean().optional(),
  dateOfBirth: z.string().optional(),
})

export const updateDoctorProfileSchema = z.object({
  degree: z.string().max(100).optional(),
  position: z.array(z.string()).optional(),
  introduction: z.string().optional(),
  memberships: z.array(z.string()).optional(),
  awards: z.array(z.string()).optional(),
  research: z.string().optional(),
  trainingProcess: z.array(z.string()).optional(),
  experience: z.array(z.string()).optional(),
  avatarUrl: z.string().url().optional(),
  portrait: z.string().url().optional(),
  specialtyIds: z.array(z.string()).optional(),
  locationIds: z.array(z.string()).optional(),
})

export type CreateDoctorFormData = z.infer<typeof createDoctorSchema>
export type UpdateDoctorAccountFormData = z.infer<
  typeof updateDoctorAccountSchema
>
export type UpdateDoctorProfileFormData = z.infer<
  typeof updateDoctorProfileSchema
>
