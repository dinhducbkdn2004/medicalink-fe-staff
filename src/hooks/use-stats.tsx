/**
 * Stats React Query Hooks
 * Provides hooks for fetching statistics data
 */
import { useQuery } from '@tanstack/react-query'
import { statsService } from '@/api/services/stats.service'

// Query keys
export const statsKeys = {
  all: ['stats'] as const,
  staffs: () => [...statsKeys.all, 'staffs'] as const,
  doctors: () => [...statsKeys.all, 'doctors'] as const,
}

/**
 * Hook to fetch staff statistics
 */
/**
 * Hook to fetch staff statistics
 */
export function useStaffStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.staffs(),
    queryFn: statsService.getStaffStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled,
  })
}

/**
 * Hook to fetch doctor statistics
 */
export function useDoctorStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.doctors(),
    queryFn: statsService.getDoctorStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled,
  })
}
