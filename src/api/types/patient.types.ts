import type { PaginationParams, PaginatedResponse } from './common.types'

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

export interface PatientQueryParams extends PaginationParams {
  search?: string
  sortBy?: 'dateOfBirth' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  includedDeleted?: boolean
}

export type PatientListResponse = PaginatedResponse<Patient>

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
