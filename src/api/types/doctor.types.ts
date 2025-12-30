import type { PaginationParams, PaginatedResponse } from './common.types'

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

export interface Specialty {
  id: string
  name: string
  slug: string
  description?: string
}

export interface WorkLocation {
  id: string
  name: string
  slug: string
  address?: string
  phone?: string
  timezone?: string
  googleMapUrl?: string
  isActive?: boolean
  createdAt?: string
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
  specialties: Specialty[]
  workLocations: WorkLocation[]
  createdAt: string
  updatedAt: string
}

export interface DoctorWithProfile {
  id: string
  fullName: string
  email: string
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  role: 'DOCTOR'

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

  createdAt: string
  accountUpdatedAt: string
  profileCreatedAt?: string
  profileUpdatedAt?: string
}

export interface CompleteDoctorData {
  id: string
  fullName: string
  email: string
  role: string

  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  createdAt?: string
  updatedAt?: string

  profileId: string
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
  profileCreatedAt?: string
  profileUpdatedAt?: string
}

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

export interface DoctorStats {
  total: number
  active: number
  inactive: number
  recentlyCreated: number
}

export interface DoctorQueryParams extends PaginationParams {
  search?: string
  email?: string
  isMale?: boolean
  isActive?: boolean
  createdFrom?: string
  createdTo?: string
  sortBy?: 'createdAt' | 'fullName' | 'email'
  sortOrder?: 'asc' | 'desc'
  specialtyIds?: string
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

export interface ToggleDoctorProfileActiveRequest {
  isActive: boolean
}

export type DoctorListResponse = PaginatedResponse<DoctorWithProfile>

export type PublicDoctorProfileListResponse =
  PaginatedResponse<PublicDoctorProfile>
