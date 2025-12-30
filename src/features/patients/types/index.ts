import { z } from 'zod'

export type {
  Patient,
  PatientQueryParams,
  PatientListResponse,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '@/api/types/patient.types'

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

export type CreatePatientFormData = z.infer<typeof createPatientSchema>
export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>

export type PatientDialogType = 'create' | 'edit' | 'delete' | 'restore' | null
