import type { PaginationParams, PaginatedResponse } from './common.types'

export enum StaffRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

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

export interface CreateStaffRequest {
  fullName: string
  email: string
  password: string
  role?: StaffRole
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
}

export interface UpdateStaffRequest {
  fullName?: string
  email?: string
  password?: string
  role?: StaffRole
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
}

export type StaffListResponse = PaginatedResponse<Staff>
