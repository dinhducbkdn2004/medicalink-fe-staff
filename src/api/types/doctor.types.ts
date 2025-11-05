import type { PaginationParams, PaginatedResponse } from './common.types'

/**
 * Doctor account data
 */
export interface DoctorAccount {
  id: string
  fullName: string
  email: string
  role: 'DOCTOR'
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  createdAt: string
  updatedAt: string
}

/**
 * Specialty data
 */
export interface Specialty {
  id: string
  name: string
  slug: string
  description?: string
}

/**
 * Work location data (matches backend response)
 */
export interface WorkLocation {
  id: string
  name: string
  address?: string
  phone?: string
  timezone?: string
  googleMapUrl?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * Doctor profile data
 */
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
  specialties: Specialty[]
  workLocations: WorkLocation[]
  createdAt: string
  updatedAt: string
}

/**
 * Doctor with profile (composite - flat structure from backend)
 * Backend returns a flattened structure with both account and profile fields
 */
export interface DoctorWithProfile {
  // Account fields
  id: string
  fullName: string
  email: string
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  role: 'DOCTOR'

  // Profile fields (flattened)
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

  // Timestamps
  createdAt: string
  accountUpdatedAt: string
  profileCreatedAt?: string
  profileUpdatedAt?: string
}

/**
 * Complete doctor data (account + profile merged - flat structure from API)
 * API GET /api/doctors/:id/complete returns flat structure
 */
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

/**
 * Public doctor profile (for patients/visitors)
 */
export interface PublicDoctorProfile {
  id: string
  staffAccountId: string
  fullName: string
  isActive: boolean
  degree?: string
  position?: string[]
  avatarUrl?: string
  specialties: Pick<Specialty, 'id' | 'name' | 'slug'>[]
  workLocations: Pick<WorkLocation, 'id' | 'name' | 'slug'>[]
}

/**
 * Doctor statistics
 */
export interface DoctorStats {
  total: number
  active: number
  inactive: number
  recentlyCreated: number
}

/**
 * Doctor query parameters
 */
export interface DoctorQueryParams extends PaginationParams {
  search?: string
  email?: string
  isMale?: boolean
  isActive?: boolean
  createdFrom?: string
  createdTo?: string
  sortBy?: 'createdAt' | 'fullName' | 'email'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Create doctor request (saga pattern - creates both account and profile)
 */
export interface CreateDoctorRequest {
  fullName: string
  email: string
  password: string
  role?: 'DOCTOR'
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
}

/**
 * Create doctor response
 */
export interface CreateDoctorResponse {
  success: true
  message: string
  data: {
    accountId: string
    profileId: string
    correlationId: string
  }
}

/**
 * Update doctor account request
 */
export interface UpdateDoctorAccountRequest {
  fullName?: string
  email?: string
  password?: string
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
}

/**
 * Create doctor profile request
 */
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

/**
 * Update doctor profile request
 */
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

/**
 * Toggle doctor profile active status request
 */
export interface ToggleDoctorProfileActiveRequest {
  isActive: boolean
}

/**
 * Doctor list response
 */
export type DoctorListResponse = PaginatedResponse<DoctorWithProfile>

/**
 * Public doctor profile list response
 */
export type PublicDoctorProfileListResponse =
  PaginatedResponse<PublicDoctorProfile>
