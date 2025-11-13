/**
 * Patient Module Types
 * Based on /api/patients API specification
 */
import { z } from 'zod'

// ============================================================================
// Base Types - Re-export from API
// ============================================================================

export type {
  Patient,
  PatientQueryParams,
  PatientListResponse,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '@/api/types/patient.types'

// ============================================================================
// Zod Schemas for Validation
// ============================================================================

/**
 * Schema for creating a patient
 */
export const createPatientSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  email: z.string().optional(),
  phone: z.string().optional(),
  isMale: z.boolean().optional(),
  dateOfBirth: z.string().optional(),
  addressLine: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
})

/**
 * Schema for updating a patient
 * All fields are optional
 */
export const updatePatientSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  isMale: z.boolean().optional(),
  dateOfBirth: z.string().optional(),
  addressLine: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
})

/**
 * Inferred types from schemas
 */
export type CreatePatientFormData = z.infer<typeof createPatientSchema>
export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>

// ============================================================================
// UI State Types
// ============================================================================

export type PatientDialogType = 'create' | 'edit' | 'delete' | 'restore' | null
