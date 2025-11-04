/**
 * Staff API Hooks
 * TanStack Query hooks for Staff Account management
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { staffService } from '@/api/services'
import type {
  StaffQueryParams,
  CreateStaffRequest,
  UpdateStaffRequest,
} from '@/api/types/staff.types'

// ============================================================================
// Query Keys
// ============================================================================

export const staffKeys = {
  all: ['staffs'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (params: StaffQueryParams) => [...staffKeys.lists(), params] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  stats: () => [...staffKeys.all, 'stats'] as const,
}

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook to fetch paginated list of staff accounts with filtering and sorting
 */
export function useStaffs(params: StaffQueryParams = {}) {
  return useQuery({
    queryKey: staffKeys.list(params),
    queryFn: () => staffService.getStaffs(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch single staff account by ID
 */
export function useStaff(id: string | undefined) {
  return useQuery({
    queryKey: staffKeys.detail(id!),
    queryFn: () => staffService.getStaffById(id!),
    enabled: !!id,
  })
}

/**
 * Hook to fetch staff statistics
 */
export function useStaffStats() {
  return useQuery({
    queryKey: staffKeys.stats(),
    queryFn: () => staffService.getStaffStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Hook to create a new staff account
 */
export function useCreateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateStaffRequest) => staffService.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() })
      toast.success('Staff account created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create staff account')
    },
  })
}

/**
 * Hook to update staff account information
 */
export function useUpdateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffRequest }) =>
      staffService.updateStaff(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: staffKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() })
      toast.success('Staff account updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update staff account')
    },
  })
}

/**
 * Hook to delete a staff account
 */
export function useDeleteStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => staffService.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() })
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() })
      toast.success('Staff account deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete staff account')
    },
  })
}
