import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workLocationService } from '@/api/services'
import type {
  CreateWorkLocationRequest,
  UpdateWorkLocationRequest,
  WorkLocationQueryParams,
} from '@/api/services/work-location.service'

export const workLocationKeys = {
  all: ['work-locations'] as const,
  lists: () => [...workLocationKeys.all, 'list'] as const,
  list: (params: WorkLocationQueryParams) =>
    [...workLocationKeys.lists(), params] as const,
  active: () => [...workLocationKeys.all, 'active'] as const,
  stats: () => [...workLocationKeys.all, 'stats'] as const,
  details: () => [...workLocationKeys.all, 'detail'] as const,
  detail: (id: string) => [...workLocationKeys.details(), id] as const,
}

export function useWorkLocations(params: WorkLocationQueryParams = {}) {
  return useQuery({
    queryKey: workLocationKeys.list(params),
    queryFn: () => workLocationService.getWorkLocations(params),
  })
}

export function useActiveWorkLocations() {
  return useQuery({
    queryKey: workLocationKeys.active(),
    queryFn: () => workLocationService.getAllActiveWorkLocations(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  })
}

export function useWorkLocationStats() {
  return useQuery({
    queryKey: workLocationKeys.stats(),
    queryFn: () => workLocationService.getWorkLocationStats(),
    staleTime: 2 * 60 * 1000,
  })
}

export function useWorkLocation(id: string | undefined) {
  return useQuery({
    queryKey: workLocationKeys.detail(id!),
    queryFn: () => workLocationService.getWorkLocation(id!),
    enabled: !!id,
  })
}

export function useCreateWorkLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateWorkLocationRequest) =>
      workLocationService.createWorkLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workLocationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workLocationKeys.active() })
      queryClient.invalidateQueries({ queryKey: workLocationKeys.stats() })
      toast.success('Work location created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create work location')
    },
  })
}

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
      queryClient.invalidateQueries({ queryKey: workLocationKeys.active() })
      queryClient.invalidateQueries({
        queryKey: workLocationKeys.detail(variables.id),
      })
      toast.success('Work location updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update work location')
    },
  })
}

export function useDeleteWorkLocation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => workLocationService.deleteWorkLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workLocationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workLocationKeys.active() })
      queryClient.invalidateQueries({ queryKey: workLocationKeys.stats() })
      toast.success('Work location deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete work location')
    },
  })
}
