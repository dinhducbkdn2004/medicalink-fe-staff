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
  revenue: () => [...statsKeys.all, 'revenue'] as const,
  revenueByDoctor: (limit: number) =>
    [...statsKeys.all, 'revenue-by-doctor', limit] as const,
  patients: () => [...statsKeys.all, 'patients'] as const,
  appointments: () => [...statsKeys.all, 'appointments'] as const,
  reviewsOverview: () => [...statsKeys.all, 'reviews-overview'] as const,
  qaOverview: () => [...statsKeys.all, 'qa-overview'] as const,
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

/**
 * Hook to fetch revenue statistics
 */
export function useRevenueStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.revenue(),
    queryFn: statsService.getRevenueStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled,
  })
}

/**
 * Hook to fetch revenue by doctor statistics
 * @param limit - Number of top doctors to fetch (default: 5)
 */
export function useRevenueByDoctorStats(limit = 5, enabled = true) {
  return useQuery({
    queryKey: statsKeys.revenueByDoctor(limit),
    queryFn: () => statsService.getRevenueByDoctorStats(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled,
  })
}

/**
 * Hook to fetch patient statistics
 */
export function usePatientStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.patients(),
    queryFn: statsService.getPatientStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled,
  })
}

/**
 * Hook to fetch appointment statistics
 */
export function useAppointmentStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.appointments(),
    queryFn: statsService.getAppointmentStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled,
  })
}

/**
 * Hook to fetch reviews overview statistics
 */
export function useReviewsOverviewStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.reviewsOverview(),
    queryFn: statsService.getReviewsOverviewStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled,
  })
}

/**
 * Hook to fetch Q&A overview statistics
 */
export function useQAOverviewStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.qaOverview(),
    queryFn: statsService.getQAOverviewStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled,
  })
}
