import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { specialShiftService } from '@/api/services'
import type {
  SpecialShiftQueryParams,
  CreateSpecialShiftRequest,
  UpdateSpecialShiftRequest,
} from '@/api/services/special-shift.service'

export const specialShiftKeys = {
  all: ['special-shifts'] as const,
  lists: () => [...specialShiftKeys.all, 'list'] as const,
  list: (params: SpecialShiftQueryParams) =>
    [...specialShiftKeys.lists(), params] as const,
}

export function useSpecialShifts(params: SpecialShiftQueryParams = {}) {
  return useQuery({
    queryKey: specialShiftKeys.list(params),
    queryFn: () => specialShiftService.getSpecialShifts(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateSpecialShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSpecialShiftRequest) =>
      specialShiftService.createSpecialShift(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialShiftKeys.lists() })
      toast.success('Đã tạo ca làm đặc biệt thành công')
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
      toast.error(errString || 'Không thể tạo ca làm đặc biệt')
    },
  })
}

export function useUpdateSpecialShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateSpecialShiftRequest
    }) => specialShiftService.updateSpecialShift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialShiftKeys.lists() })
      toast.success('Đã cập nhật ca làm đặc biệt thành công')
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
      toast.error(errString || 'Không thể cập nhật ca làm đặc biệt')
    },
  })
}

export function useDeleteSpecialShift() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => specialShiftService.deleteSpecialShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialShiftKeys.lists() })
      toast.success('Đã xóa ca làm đặc biệt thành công')
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string | string[]
            details?: { code?: string }
          }
        }
        message?: string
      }
      const code = axiosError?.response?.data?.details?.code
      if (code === 'SHRINKING_WINDOW') {
        // Handled in component
        return
      }
      const errData = axiosError?.response?.data?.message
      const errString = Array.isArray(errData) ? errData[0] : errData
      toast.error(errString || 'Không thể xóa ca làm đặc biệt')
    },
  })
}
