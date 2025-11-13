/**
 * Patient API Hooks
 * TanStack Query hooks for Patient management
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { patientService } from '@/api/services'
import type {
  PatientQueryParams,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '@/api/types/patient.types'

// ============================================================================
// Query Keys
// ============================================================================

export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (params: PatientQueryParams) =>
    [...patientKeys.lists(), params] as const,
  details: () => [...patientKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientKeys.details(), id] as const,
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch paginated list of patients with filtering and sorting
 */
export function usePatients(params: PatientQueryParams = {}) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientService.getPatients(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch single patient by ID
 */
export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: patientKeys.detail(id!),
    queryFn: () => patientService.getPatientById(id!),
    enabled: !!id,
  })
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new patient
 */
export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePatientRequest) =>
      patientService.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      toast.success('Patient created successfully')
    },
    onError: (
      error: Error | { response?: { data?: { message?: string } } }
    ) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to create patient'
      toast.error(message)
    },
  })
}

/**
 * Hook to update a patient
 */
export function useUpdatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePatientRequest }) =>
      patientService.updatePatient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: patientKeys.detail(variables.id),
      })
      toast.success('Patient updated successfully')
    },
    onError: (
      error: Error | { response?: { data?: { message?: string } } }
    ) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to update patient'
      toast.error(message)
    },
  })
}

/**
 * Hook to delete a patient (soft delete)
 */
export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => patientService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      toast.success('Patient deleted successfully')
    },
    onError: (
      error: Error | { response?: { data?: { message?: string } } }
    ) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to delete patient'
      toast.error(message)
    },
  })
}

/**
 * Hook to restore a soft-deleted patient
 */
export function useRestorePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => patientService.restorePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      toast.success('Patient restored successfully')
    },
    onError: (
      error: Error | { response?: { data?: { message?: string } } }
    ) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to restore patient'
      toast.error(message)
    },
  })
}

/**
 * Hook to bulk delete patients
 */
export function useBulkDeletePatients() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      return Promise.all(ids.map((id) => patientService.deletePatient(id)))
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.lists() })
      toast.success(`${ids.length} patient(s) deleted successfully`)
    },
    onError: (
      error: Error | { response?: { data?: { message?: string } } }
    ) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to delete patients'
      toast.error(message)
    },
  })
}
