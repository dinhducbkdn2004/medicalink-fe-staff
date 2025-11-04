/**
 * Stats API Service
 * Handles all stats-related API calls
 */
import { apiClient } from '../core/client'
import type { StaffStats, DoctorStats } from '../types/stats.types'

/**
 * GET /api/staffs/stats
 * Get staff statistics
 */
export async function getStaffStats(): Promise<StaffStats> {
  const response = await apiClient.get<StaffStats>('/staffs/stats')
  return response.data
}

/**
 * GET /api/doctors/stats
 * Get doctor statistics
 */
export async function getDoctorStats(): Promise<DoctorStats> {
  const response = await apiClient.get<DoctorStats>('/doctors/stats')
  return response.data
}

// Export all stats services as a single object for convenience
export const statsService = {
  getStaffStats,
  getDoctorStats,
}

export default statsService
