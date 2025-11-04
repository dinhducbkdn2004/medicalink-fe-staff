import type { PaginationParams, PaginatedResponse } from './common.types'

/**
 * Staff role enumeration
 */
export enum StaffRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

/**
 * Staff account data
 */
export interface Staff {
  id: string
  fullName: string
  email: string
  role: StaffRole
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  createdAt: string
  updatedAt: string
}

/**
 * Staff statistics
 */
export interface StaffStats {
  total: number
  active: number
  inactive: number
  recentlyCreated: number
  byRole: {
    SUPER_ADMIN: number
    ADMIN: number
  }
}

/**
 * Staff query parameters
 */
export interface StaffQueryParams extends PaginationParams {
  role?: StaffRole
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
 * Create staff request
 */
export interface CreateStaffRequest {
  fullName: string
  email: string
  password: string
  role?: StaffRole
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
}

/**
 * Update staff request
 */
export interface UpdateStaffRequest {
  fullName?: string
  email?: string
  password?: string
  role?: StaffRole
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
}

/**
 * Staff paginated response
 */
export type StaffListResponse = PaginatedResponse<Staff>
