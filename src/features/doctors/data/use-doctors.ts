/**
 * Doctor API Hooks
 * TanStack Query hooks for Doctor Account management
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { doctorService } from '@/api/services'
import type {
  DoctorQueryParams,
  CreateDoctorRequest,
  UpdateDoctorAccountRequest,
  CompleteDoctorData,
} from '@/api/types/doctor.types'

// ============================================================================
// Query Keys
// ============================================================================

export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (params: DoctorQueryParams) => [...doctorKeys.lists(), params] as const,
  details: () => [...doctorKeys.all, 'detail'] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
  complete: (id: string) => [...doctorKeys.details(), id, 'complete'] as const,
  stats: () => [...doctorKeys.all, 'stats'] as const,
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch paginated list of doctors with filtering and sorting
 */
export function useDoctors(params: DoctorQueryParams = {}) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => doctorService.getDoctors(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to search doctors with complete data (account + profile merged)
 */
export function useSearchCompleteDoctors(params: DoctorQueryParams = {}) {
  return useQuery({
    queryKey: [...doctorKeys.lists(), 'complete', params] as const,
    queryFn: () => doctorService.searchCompleteDoctors(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch single doctor account by ID
 */
export function useDoctor(id: string | undefined) {
  return useQuery({
    queryKey: doctorKeys.detail(id!),
    queryFn: () => doctorService.getDoctorById(id!),
    enabled: !!id,
  })
}

/**
 * Hook to fetch complete doctor data (account + profile)
 */
export function useCompleteDoctor(id: string | undefined, skipCache = true) {
  return useQuery<CompleteDoctorData>({
    queryKey: [...doctorKeys.complete(id!), skipCache] as const,
    queryFn: () => doctorService.getCompleteDoctorById(id!, skipCache),
    enabled: !!id,
  })
}

/**
 * Hook to fetch doctor statistics
 */
export function useDoctorStats() {
  return useQuery({
    queryKey: doctorKeys.stats(),
    queryFn: () => doctorService.getDoctorStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new doctor account
 */
export function useCreateDoctor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDoctorRequest) => doctorService.createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      queryClient.invalidateQueries({ queryKey: doctorKeys.stats() })
      toast.success('Doctor created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create doctor')
    },
  })
}

/**
 * Hook to update doctor account information
 */
export function useUpdateDoctor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateDoctorAccountRequest
    }) => doctorService.updateDoctor(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: doctorKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({
        queryKey: doctorKeys.complete(variables.id),
      })
      toast.success('Doctor updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update doctor')
    },
  })
}

/**
 * Hook to delete a doctor account
 */
export function useDeleteDoctor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => doctorService.deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      queryClient.invalidateQueries({ queryKey: doctorKeys.stats() })
      toast.success('Doctor deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete doctor')
    },
  })
}
