
import { useQuery } from '@tanstack/react-query'
import { statsService } from '@/api/services/stats.service'
import type {
  DoctorBookingStatsParams,
  DoctorContentStatsParams,
} from '@/api/types/stats.types'


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
  
  doctorMy: () => [...statsKeys.all, 'doctors', 'me'] as const,
  doctorById: (id: string) => [...statsKeys.all, 'doctors', id] as const,
  doctorsBooking: (params: DoctorBookingStatsParams) =>
    [...statsKeys.all, 'doctors', 'booking', params] as const,
  doctorsContent: (params: DoctorContentStatsParams) =>
    [...statsKeys.all, 'doctors', 'content', params] as const,
}



export function useStaffStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.staffs(),
    queryFn: statsService.getStaffStats,
    staleTime: 5 * 60 * 1000, 
    retry: 1,
    enabled,
  })
}


export function useRevenueStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.revenue(),
    queryFn: statsService.getRevenueStats,
    staleTime: 5 * 60 * 1000, 
    retry: 1,
    enabled,
  })
}


export function useRevenueByDoctorStats(limit = 5, enabled = true) {
  return useQuery({
    queryKey: statsKeys.revenueByDoctor(limit),
    queryFn: () => statsService.getRevenueByDoctorStats(limit),
    staleTime: 5 * 60 * 1000, 
    retry: 1,
    enabled,
  })
}


export function usePatientStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.patients(),
    queryFn: statsService.getPatientStats,
    staleTime: 5 * 60 * 1000, 
    retry: 1,
    enabled,
  })
}


export function useAppointmentStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.appointments(),
    queryFn: statsService.getAppointmentStats,
    staleTime: 5 * 60 * 1000, 
    retry: 1,
    enabled,
  })
}


export function useReviewsOverviewStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.reviewsOverview(),
    queryFn: statsService.getReviewsOverviewStats,
    staleTime: 5 * 60 * 1000, 
    retry: 1,
    enabled,
  })
}


export function useQAOverviewStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.qaOverview(),
    queryFn: statsService.getQAOverviewStats,
    staleTime: 5 * 60 * 1000, 
    retry: 1,
    enabled,
  })
}






export function useDoctorMyStats(enabled = true) {
  return useQuery({
    queryKey: statsKeys.doctorMy(),
    queryFn: statsService.getDoctorMyStats,
    staleTime: 30 * 1000, 
    retry: 1,
    enabled,
  })
}


export function useDoctorStatsById(id: string, enabled = true) {
  return useQuery({
    queryKey: statsKeys.doctorById(id),
    queryFn: () => statsService.getDoctorStatsById(id),
    staleTime: 5 * 60 * 1000, 
    retry: 1,
    enabled: enabled && !!id,
  })
}


export function useDoctorsBookingStats(
  params: DoctorBookingStatsParams = {},
  enabled = true
) {
  return useQuery({
    queryKey: statsKeys.doctorsBooking(params),
    queryFn: () => statsService.getDoctorsBookingStats(params),
    staleTime: 2 * 60 * 1000, 
    retry: 1,
    enabled,
  })
}


export function useDoctorsContentStats(
  params: DoctorContentStatsParams = {},
  enabled = true
) {
  return useQuery({
    queryKey: statsKeys.doctorsContent(params),
    queryFn: () => statsService.getDoctorsContentStats(params),
    staleTime: 2 * 60 * 1000, 
    retry: 1,
    enabled,
  })
}
