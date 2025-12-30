import { apiClient } from '../core/client'
import type {
  StaffStats,
  RevenueStats,
  RevenueByDoctorStats,
  PatientStats,
  AppointmentStats,
  ReviewsOverviewStats,
  QAOverviewStats,
  DoctorStats,
  DoctorBookingStatsResponse,
  DoctorContentStatsResponse,
  DoctorBookingStatsParams,
  DoctorContentStatsParams,
} from '../types/stats.types'

export async function getStaffStats(): Promise<StaffStats> {
  const response = await apiClient.get<StaffStats>('/staffs/stats')
  return response.data
}

export async function getRevenueStats(): Promise<RevenueStats[]> {
  const response = await apiClient.get<RevenueStats[]>('/stats/revenue')
  return response.data
}

export async function getRevenueByDoctorStats(
  limit: number = 5
): Promise<RevenueByDoctorStats[]> {
  const response = await apiClient.get<RevenueByDoctorStats[]>(
    '/stats/revenue-by-doctor',
    {
      params: { limit },
    }
  )
  return response.data
}

export async function getPatientStats(): Promise<PatientStats> {
  const response = await apiClient.get<PatientStats>('/stats/patients')
  return response.data
}

export async function getAppointmentStats(): Promise<AppointmentStats> {
  const response = await apiClient.get<AppointmentStats>('/stats/appointments')
  return response.data
}

export async function getReviewsOverviewStats(): Promise<ReviewsOverviewStats> {
  const response = await apiClient.get<ReviewsOverviewStats>(
    '/stats/reviews-overview'
  )
  return response.data
}

export async function getQAOverviewStats(): Promise<QAOverviewStats> {
  const response = await apiClient.get<QAOverviewStats>('/stats/qa-overview')
  return response.data
}
export async function getDoctorMyStats(): Promise<DoctorStats> {
  const response = await apiClient.get<DoctorStats>('/stats/doctors/me')
  return response.data
}

export async function getDoctorStatsById(id: string): Promise<DoctorStats> {
  const response = await apiClient.get<DoctorStats>(`/stats/doctors/${id}`)
  return response.data
}

export async function getDoctorsBookingStats(
  params: DoctorBookingStatsParams = {}
): Promise<DoctorBookingStatsResponse> {
  const response = await apiClient.get<DoctorBookingStatsResponse>(
    '/stats/doctors/booking',
    { params }
  )
  return response.data
}

export async function getDoctorsContentStats(
  params: DoctorContentStatsParams = {}
): Promise<DoctorContentStatsResponse> {
  const response = await apiClient.get<DoctorContentStatsResponse>(
    '/stats/doctors/content',
    { params }
  )
  return response.data
}

export const statsService = {
  getStaffStats,
  getRevenueStats,
  getRevenueByDoctorStats,
  getPatientStats,
  getAppointmentStats,
  getReviewsOverviewStats,
  getQAOverviewStats,
  getDoctorMyStats,
  getDoctorStatsById,
  getDoctorsBookingStats,
  getDoctorsContentStats,
}

export default statsService
