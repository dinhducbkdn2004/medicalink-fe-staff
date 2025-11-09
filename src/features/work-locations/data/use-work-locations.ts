/**
 * Work Location API Hooks
 * TanStack Query hooks for Work Location management
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workLocationService } from '@/api/services'
import type {
  WorkLocationQueryParams,
  CreateWorkLocationRequest,
  UpdateWorkLocationRequest,
} from '@/api/services/work-location.service'

// ============================================================================
// Query Keys
// ============================================================================

export const workLocationKeys = {
  all: ['work-locations'] as const,
  lists: () => [...workLocationKeys.all, 'list'] as const,
  list: (params: WorkLocationQueryParams) =>
    [...workLocationKeys.lists(), params] as const,
  details: () => [...workLocationKeys.all, 'detail'] as const,
  detail: (id: string) => [...workLocationKeys.details(), id] as const,
  stats: () => [...workLocationKeys.all, 'stats'] as const,
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch paginated list of work locations with filtering and sorting
 */
export function useWorkLocations(params: WorkLocationQueryParams = {}) {
  return useQuery({
    queryKey: workLocationKeys.list(params),
    queryFn: () => workLocationService.getWorkLocations(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch single work location by ID
 */
export function useWorkLocation(id: string | undefined) {
  return useQuery({
    queryKey: workLocationKeys.detail(id!),
    queryFn: () => workLocationService.getWorkLocation(id!),
    enabled: !!id,
  })
}

/**
 * Hook to fetch work location statistics
 */
export function useWorkLocationStats() {
  return useQuery({
    queryKey: workLocationKeys.stats(),
    queryFn: () => workLocationService.getWorkLocationStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch all active work locations (for dropdowns)
 */
export function useActiveWorkLocations() {
  return useQuery({
    queryKey: [...workLocationKeys.all, 'active'],
    queryFn: () => workLocationService.getAllActiveWorkLocations(),
    staleTime: 1000 * 60 * 10, // 10 minutes (rarely changes)
  })
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new work location
 */
export function useCreateWorkLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateWorkLocationRequest) =>
      workLocationService.createWorkLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workLocationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workLocationKeys.stats() })
      toast.success('Work location created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create work location')
    },
  })
}

/**
 * Hook to update work location information
 */
export function useUpdateWorkLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateWorkLocationRequest
    }) => workLocationService.updateWorkLocation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workLocationKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: workLocationKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: workLocationKeys.stats() })
      toast.success('Work location updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update work location')
    },
  })
}

/**
 * Hook to delete a work location
 */
export function useDeleteWorkLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => workLocationService.deleteWorkLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workLocationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workLocationKeys.stats() })
      toast.success('Work location deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete work location')
    },
  })
}
