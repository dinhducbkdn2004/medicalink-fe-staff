/**
 * Office Hours API Hooks
 * TanStack Query hooks for Office Hours management
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { officeHourService } from '@/api/services'
import type {
  OfficeHourQueryParams,
  CreateOfficeHourRequest,
} from '@/api/services/office-hour.service'

// ============================================================================
// Query Keys
// ============================================================================

export const officeHourKeys = {
  all: ['office-hours'] as const,
  lists: () => [...officeHourKeys.all, 'list'] as const,
  list: (params: OfficeHourQueryParams) =>
    [...officeHourKeys.lists(), params] as const,
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch office hours with filtering
 */
export function useOfficeHours(params: OfficeHourQueryParams = {}) {
  return useQuery({
    queryKey: officeHourKeys.list(params),
    queryFn: () => officeHourService.getOfficeHours(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401/403 (permission errors)
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

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new office hour entry
 */
export function useCreateOfficeHour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOfficeHourRequest) =>
      officeHourService.createOfficeHour(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: officeHourKeys.lists() })
      toast.success('Office hours created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create office hours')
    },
  })
}

/**
 * Hook to delete an office hour entry
 */
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

/**
 * Hook to bulk delete office hour entries
 */
export function useBulkDeleteOfficeHours() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Delete all in parallel
      await Promise.all(ids.map((id) => officeHourService.deleteOfficeHour(id)))
    },
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: officeHourKeys.lists() })
      toast.success(`${ids.length} office hour(s) deleted successfully`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete office hours')
    },
  })
}
