import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { clinicExceptionService } from '@/api/services'
import type {
  ClinicExceptionQueryParams,
  CreateClinicExceptionRequest,
  UpdateClinicExceptionRequest,
} from '@/api/services/clinic-exception.service'

export const clinicExceptionKeys = {
  all: ['clinic-exceptions'] as const,
  lists: () => [...clinicExceptionKeys.all, 'list'] as const,
  list: (params: ClinicExceptionQueryParams) =>
    [...clinicExceptionKeys.lists(), params] as const,
}

export function useClinicExceptions(params: ClinicExceptionQueryParams = {}) {
  return useQuery({
    queryKey: clinicExceptionKeys.list(params),
    queryFn: () => clinicExceptionService.getClinicExceptions(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateClinicException() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClinicExceptionRequest) =>
      clinicExceptionService.createClinicException(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicExceptionKeys.lists() })
      toast.success('Đã tạo ngày nghỉ lễ thành công')
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: {
          status?: number
          data?: { message?: string | string[] }
        }
        message?: string
      }
      const errData = axiosError.response?.data?.message
      const errString = Array.isArray(errData) ? errData[0] : errData
      toast.error(errString || 'Không thể tạo ngày nghỉ lễ')
    },
  })
}

export function useUpdateClinicException() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateClinicExceptionRequest
    }) => clinicExceptionService.updateClinicException(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicExceptionKeys.lists() })
      toast.success('Đã cập nhật ngày nghỉ lễ thành công')
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: {
          status?: number
          data?: { message?: string | string[] }
        }
        message?: string
      }
      const errData = axiosError.response?.data?.message
      const errString = Array.isArray(errData) ? errData[0] : errData
      toast.error(errString || 'Không thể cập nhật ngày nghỉ lễ')
    },
  })
}

export function useDeleteClinicException() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      clinicExceptionService.deleteClinicException(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicExceptionKeys.lists() })
      toast.success('Đã xóa ngày nghỉ lễ thành công')
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: {
          status?: number
          data?: { message?: string | string[] }
        }
        message?: string
      }
      const errData = axiosError.response?.data?.message
      const errString = Array.isArray(errData) ? errData[0] : errData
      toast.error(errString || 'Không thể xóa ngày nghỉ lễ')
    },
  })
}
