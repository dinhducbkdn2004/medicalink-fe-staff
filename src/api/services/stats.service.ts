/**
 * Stats API Service
 * Handles all stats-related API calls
 */
import { apiClient } from '../core/client'
import type {
  StaffStats,
  RevenueStats,
  RevenueByDoctorStats,
  PatientStats,
  AppointmentStats,
  ReviewsOverviewStats,
  QAOverviewStats,
} from '../types/stats.types'

/**
 * GET /api/staffs/stats
 * Get staff statistics
 */
export async function getStaffStats(): Promise<StaffStats> {
  const response = await apiClient.get<StaffStats>('/staffs/stats')
  return response.data
}

/**
 * GET /api/stats/revenue
 * Get revenue statistics by month
 */
export async function getRevenueStats(): Promise<RevenueStats[]> {
  const response = await apiClient.get<RevenueStats[]>('/stats/revenue')
  return response.data
}

/**
 * GET /api/stats/revenue-by-doctor
 * Get revenue statistics by doctor
 * @param limit - Number of top doctors to return (default: 5)
 */
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

/**
 * GET /api/stats/patients
 * Get patient statistics
 */
export async function getPatientStats(): Promise<PatientStats> {
  const response = await apiClient.get<PatientStats>('/stats/patients')
  return response.data
}

/**
 * GET /api/stats/appointments
 * Get appointment statistics
 */
export async function getAppointmentStats(): Promise<AppointmentStats> {
  const response = await apiClient.get<AppointmentStats>('/stats/appointments')
  return response.data
}

/**
 * GET /api/stats/reviews-overview
 * Get reviews overview statistics
 */
export async function getReviewsOverviewStats(): Promise<ReviewsOverviewStats> {
  const response = await apiClient.get<ReviewsOverviewStats>(
    '/stats/reviews-overview'
  )
  return response.data
}

/**
 * GET /api/stats/qa-overview
 * Get Q&A overview statistics
 */
export async function getQAOverviewStats(): Promise<QAOverviewStats> {
  const response = await apiClient.get<QAOverviewStats>('/stats/qa-overview')
  return response.data
}

// Export all stats services as a single object for convenience
export const statsService = {
  getStaffStats,
  getRevenueStats,
  getRevenueByDoctorStats,
  getPatientStats,
  getAppointmentStats,
  getReviewsOverviewStats,
  getQAOverviewStats,
}

export default statsService
