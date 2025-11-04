/**
 * Doctor Profile API Hooks
 * TanStack Query hooks for Doctor Profile management
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { doctorProfileService } from '@/api/services'
import type {
  CreateDoctorProfileRequest,
  UpdateDoctorProfileRequest,
  ToggleDoctorProfileActiveRequest,
} from '@/api/types/doctor.types'
import { doctorKeys } from './use-doctors'

// ============================================================================
// Query Keys
// ============================================================================

export const doctorProfileKeys = {
  all: ['doctor-profiles'] as const,
  myProfile: () => [...doctorProfileKeys.all, 'me'] as const,
  details: () => [...doctorProfileKeys.all, 'detail'] as const,
  detail: (id: string) => [...doctorProfileKeys.details(), id] as const,
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch current doctor's own profile
 */
export function useMyDoctorProfile() {
  return useQuery({
    queryKey: doctorProfileKeys.myProfile(),
    queryFn: () => doctorProfileService.getMyProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch doctor profile by ID
 */
export function useDoctorProfile(id: string | undefined) {
  return useQuery({
    queryKey: doctorProfileKeys.detail(id!),
    queryFn: () => doctorProfileService.getDoctorProfileById(id!),
    enabled: !!id,
  })
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new doctor profile
 */
export function useCreateDoctorProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDoctorProfileRequest) =>
      doctorProfileService.createDoctorProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorProfileKeys.all })
      toast.success('Doctor profile created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create doctor profile')
    },
  })
}

/**
 * Hook to update current doctor's own profile
 */
export function useUpdateMyProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateDoctorProfileRequest) =>
      doctorProfileService.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorProfileKeys.myProfile() })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile')
    },
  })
}

/**
 * Hook to update doctor profile by ID (admin)
 */
export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateDoctorProfileRequest
    }) => doctorProfileService.updateDoctorProfile(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both profile and complete doctor data
      queryClient.invalidateQueries({
        queryKey: doctorProfileKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({
        queryKey: doctorKeys.all,
      })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update doctor profile')
    },
  })
}

/**
 * Hook to toggle doctor profile active status
 */
export function useToggleDoctorProfileActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: ToggleDoctorProfileActiveRequest
    }) => doctorProfileService.toggleDoctorProfileActive(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: doctorProfileKeys.detail(variables.id),
      })
      // Also invalidate doctor lists to refresh the table
      queryClient.invalidateQueries({
        queryKey: doctorKeys.lists(),
      })
      toast.success('Profile status updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile status')
    },
  })
}

/**
 * Hook to delete a doctor profile
 */
export function useDeleteDoctorProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => doctorProfileService.deleteDoctorProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorProfileKeys.all })
      toast.success('Doctor profile deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete doctor profile')
    },
  })
}
