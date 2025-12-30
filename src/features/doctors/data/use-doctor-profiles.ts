import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { doctorProfileService } from '@/api/services'
import type {
  CreateDoctorProfileRequest,
  UpdateDoctorProfileRequest,
  ToggleDoctorProfileActiveRequest,
} from '@/api/types/doctor.types'
import { doctorKeys } from './use-doctors'

export const doctorProfileKeys = {
  all: ['doctor-profiles'] as const,
  myProfile: () => [...doctorProfileKeys.all, 'me'] as const,
  details: () => [...doctorProfileKeys.all, 'detail'] as const,
  detail: (id: string) => [...doctorProfileKeys.details(), id] as const,
}

export function useMyDoctorProfile() {
  return useQuery({
    queryKey: doctorProfileKeys.myProfile(),
    queryFn: () => doctorProfileService.getMyProfile(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useDoctorProfile(id: string | undefined) {
  return useQuery({
    queryKey: doctorProfileKeys.detail(id!),
    queryFn: () => doctorProfileService.getDoctorProfileById(id!),
    enabled: !!id,
  })
}

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
