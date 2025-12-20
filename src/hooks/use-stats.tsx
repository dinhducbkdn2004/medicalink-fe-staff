/**
 * Stats React Query Hooks
 * Provides hooks for fetching statistics data
 */
import { useQuery } from '@tanstack/react-query'
import { statsService } from '@/api/services/stats.service'
import type {
  DoctorBookingStatsParams,
  DoctorContentStatsParams,
} from '@/api/types/stats.types'

// Query keys
export const statsKeys = {
  all: ['stats'] as const,
  staffs: () => [...statsKeys.all, 'staffs'] as const,
  revenue: () => [...statsKeys.all, 'revenue'] as const,
  revenueByDoctor: (limit: number) =>
    [...statsKeys.all, 'revenue-by-doctor', limit] as const,
  patients: () => [...statsKeys.all, 'patients'] as const,
  appointments: () => [...statsKeys.all, 'appointments'] as const,
  reviewsOverview: () => [...statsKeys.all, 'reviews-overview'] as const,
  qaOverview: () => [...statsKeys.all, 'qa-overview'] as const,
  // Doctor stats keys
  doctorMy: () => [...statsKeys.all, 'doctors', 'me'] as const,
  doctorById: (id: string) => [...statsKeys.all, 'doctors', id] as const,
  doctorsBooking: (params: DoctorBookingStatsParams) =>
    [...statsKeys.all, 'doctors', 'booking', params] as const,
  doctorsContent: (params: DoctorContentStatsParams) =>
    [...statsKeys.all, 'doctors', 'content', params] as const,
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

// ============================================================================
// Doctor Stats Hooks (New from API_DOCTOR_STATS.md)
// ============================================================================

/**
 * Hook to fetch current doctor's own stats (booking + content)
 * Permission: doctors:read (Doctor role)
 */
export function useDoctorMyStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.doctorMy(),
    queryFn: statsService.getDoctorMyStats,
    staleTime: 30 * 1000, // 30 seconds - refresh frequently to show latest data
    retry: 1,
    enabled,
  })
}

/**
 * Hook to fetch stats for a specific doctor by staff account ID
 * Permission: doctors:read
 * @param id - Doctor staff account ID
 */
export function useDoctorStatsById(id: string, enabled = true) {
  return useQuery({
    queryKey: statsKeys.doctorById(id),
    queryFn: () => statsService.getDoctorStatsById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: enabled && !!id,
  })
}

/**
 * Hook to fetch booking stats for all doctors (admin only)
 * Permission: appointments:read (Admin role)
 * @param params - Query parameters for pagination and sorting
 */
export function useDoctorsBookingStats(
  params: DoctorBookingStatsParams = {},
  enabled = true
) {
  return useQuery({
    queryKey: statsKeys.doctorsBooking(params),
    queryFn: () => statsService.getDoctorsBookingStats(params),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for admin dashboard)
    retry: 1,
    enabled,
  })
}

/**
 * Hook to fetch content stats for all doctors (admin only)
 * Permission: reviews:read (Admin role)
 * @param params - Query parameters for pagination and sorting
 */
export function useDoctorsContentStats(
  params: DoctorContentStatsParams = {},
  enabled = true
) {
  return useQuery({
    queryKey: statsKeys.doctorsContent(params),
    queryFn: () => statsService.getDoctorsContentStats(params),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for admin dashboard)
    retry: 1,
    enabled,
  })
}
