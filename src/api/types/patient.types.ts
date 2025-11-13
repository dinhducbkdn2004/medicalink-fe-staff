import type { PaginationParams, PaginatedResponse } from './common.types'

/**
 * Patient data structure
 * Based on /api/patients API specification
 */
export interface Patient {
  id: string
  fullName: string
  email?: string
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  addressLine?: string
  district?: string
  province?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

/**
 * Patient query parameters for listing/searching
 */
export interface PatientQueryParams extends PaginationParams {
  search?: string
  sortBy?: 'dateOfBirth' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  includedDeleted?: boolean
}

/**
 * Patient list response
 */
export type PatientListResponse = PaginatedResponse<Patient>

/**
 * Create patient request body
 */
export interface CreatePatientRequest {
  fullName: string
  email?: string
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  addressLine?: string
  district?: string
  province?: string
}

/**
 * Update patient request body
 * All fields optional for updates
 */
export interface UpdatePatientRequest {
  fullName?: string
  email?: string
  phone?: string
  isMale?: boolean
  dateOfBirth?: string
  addressLine?: string
  district?: string
  province?: string
}
