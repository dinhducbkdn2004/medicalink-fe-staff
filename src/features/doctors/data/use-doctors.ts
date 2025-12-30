import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { doctorService } from '@/api/services'
import type {
  DoctorQueryParams,
  CreateDoctorRequest,
  UpdateDoctorAccountRequest,
  CompleteDoctorData,
} from '@/api/types/doctor.types'

export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (params: DoctorQueryParams) => [...doctorKeys.lists(), params] as const,
  details: () => [...doctorKeys.all, 'detail'] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
  complete: (id: string) => [...doctorKeys.details(), id, 'complete'] as const,
  stats: () => [...doctorKeys.all, 'stats'] as const,
}

export function useDoctors(params: DoctorQueryParams = {}) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => doctorService.getDoctors(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useSearchCompleteDoctors(params: DoctorQueryParams = {}) {
  return useQuery({
    queryKey: [...doctorKeys.lists(), 'complete', params] as const,
    queryFn: () => doctorService.searchCompleteDoctors(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useDoctor(id: string | undefined) {
  return useQuery({
    queryKey: doctorKeys.detail(id!),
    queryFn: () => doctorService.getDoctorById(id!),
    enabled: !!id,
  })
}

export function useCompleteDoctor(id: string | undefined, skipCache = true) {
  return useQuery<CompleteDoctorData>({
    queryKey: [...doctorKeys.complete(id!), skipCache] as const,
    queryFn: () => doctorService.getCompleteDoctorById(id!, skipCache),
    enabled: !!id,
  })
}

export function useDoctorStats() {
  return useQuery({
    queryKey: doctorKeys.stats(),
    queryFn: () => doctorService.getDoctorStats(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateDoctor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDoctorRequest) => doctorService.createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      queryClient.invalidateQueries({ queryKey: doctorKeys.stats() })
      toast.success('Doctor created successfully')
    },
  })
}

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
  })
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => doctorService.deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() })
      queryClient.invalidateQueries({ queryKey: doctorKeys.stats() })
      toast.success('Doctor deleted successfully')
    },
  })
}
