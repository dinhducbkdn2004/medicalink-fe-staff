import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { officeHourService } from '@/api/services'
import type {
  OfficeHourQueryParams,
  CreateOfficeHourRequest,
} from '@/api/services/office-hour.service'

export const officeHourKeys = {
  all: ['office-hours'] as const,
  lists: () => [...officeHourKeys.all, 'list'] as const,
  list: (params: OfficeHourQueryParams) =>
    [...officeHourKeys.lists(), params] as const,
}

export function useOfficeHours(params: OfficeHourQueryParams = {}) {
  return useQuery({
    queryKey: officeHourKeys.list(params),
    queryFn: () => officeHourService.getOfficeHours(params),

    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } }
      if (
        axiosError?.response?.status === 401 ||
        axiosError?.response?.status === 403
      ) {
        return false
      }
      return failureCount < 2
    },
  })
}

export function useCreateOfficeHour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOfficeHourRequest) =>
      officeHourService.createOfficeHour(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: officeHourKeys.lists() })
      toast.success('Đã tạo giờ làm việc thành công')
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: {
          status?: number
          data?: { message?: string; error?: string }
        }
        message?: string
      }

      if (axiosError?.response?.status === 404) {
        const errorMessage =
          axiosError.response.data?.message || 'Record not found'
        if (errorMessage.includes('Doctor')) {
          toast.error(
            'Không tìm thấy bác sĩ đã chọn. Vui lòng làm mới trang và thử lại.'
          )
        } else if (errorMessage.includes('WorkLocation')) {
          toast.error(
            'Không tìm thấy cơ sở làm việc đã chọn. Vui lòng làm mới trang và thử lại.'
          )
        } else {
          toast.error(errorMessage)
        }
      } else if (axiosError?.response?.status === 400) {
        toast.error(
          axiosError.response.data?.message ||
            'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.'
        )
      } else {
        toast.error(axiosError?.message || 'Không thể tạo giờ làm việc')
      }
    },
  })
}

export function useDeleteOfficeHour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => officeHourService.deleteOfficeHour(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: officeHourKeys.lists() })
      toast.success('Đã xóa giờ làm việc thành công')
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string
            details?: { code?: string }
          }
        }
        message?: string
      }
      const code = axiosError?.response?.data?.details?.code
      if (code === 'SHRINKING_WINDOW') {
        // We handle this in the component via a custom modal
        return
      }
      toast.error(
        axiosError?.response?.data?.message ||
          axiosError?.message ||
          'Không thể xóa giờ làm việc'
      )
    },
  })
}
