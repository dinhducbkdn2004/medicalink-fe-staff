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
      toast.success('Office hours created successfully')
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
            'Selected doctor not found. Please refresh and try again.'
          )
        } else if (errorMessage.includes('WorkLocation')) {
          toast.error(
            'Selected work location not found. Please refresh and try again.'
          )
        } else {
          toast.error(errorMessage)
        }
      } else if (axiosError?.response?.status === 400) {
        toast.error(
          axiosError.response.data?.message ||
            'Invalid data. Please check your input.'
        )
      } else {
        toast.error(axiosError?.message || 'Failed to create office hours')
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
      toast.success('Office hours deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete office hours')
    },
  })
}
