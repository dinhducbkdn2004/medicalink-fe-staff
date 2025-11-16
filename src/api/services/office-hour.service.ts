/**
 * Office Hours API Service
 * Handles all API calls related to office hours/schedules
 * API Base: /api/office-hours
 */
import { apiClient } from '../core/client'
import type { PaginationParams } from '../types/common.types'

// ============================================================================
// Types
// ============================================================================

export interface OfficeHour {
  id: string
  doctorId: string | null
  workLocationId: string | null
  dayOfWeek: number // 0-6 (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  startTime: string // HH:mm format or ISO DateTime
  endTime: string // HH:mm format or ISO DateTime
  isGlobal: boolean
  createdAt: string
  updatedAt: string
  // Expanded relations (optional, populated by backend)
  doctor?: {
    id: string
    firstName: string
    lastName: string
    specialtyName?: string
  }
  workLocation?: {
    id: string
    name: string
  }
}

export interface OfficeHourQueryParams extends PaginationParams {
  doctorId?: string
  workLocationId?: string
}

export interface CreateOfficeHourRequest {
  doctorId?: string | null
  workLocationId?: string | null
  dayOfWeek: number
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  isGlobal?: boolean
}

export interface OfficeHoursGroupedResponse {
  global: OfficeHour[]
  workLocation: OfficeHour[]
  doctor: OfficeHour[]
  doctorInLocation: OfficeHour[]
}

export interface OfficeHoursApiResponse {
  success: boolean
  message: string
  data: OfficeHoursGroupedResponse
  timestamp: string
  path: string
  method: string
  statusCode: number
}

// ============================================================================
// Service Class
// ============================================================================

class OfficeHourService {
  // --------------------------------------------------------------------------
  // Office Hours CRUD
  // --------------------------------------------------------------------------

  /**
   * Get all office hours with filtering (staff only)
   * GET /api/office-hours
   */
  async getOfficeHours(
    params: OfficeHourQueryParams = {}
  ): Promise<OfficeHoursApiResponse> {
    const response = await apiClient.get<OfficeHoursApiResponse>(
      '/office-hours',
      { params }
    )
    return response.data
  }

  /**
   * Create new office hours entry (staff only)
   * POST /api/office-hours
   */
  async createOfficeHour(
    data: CreateOfficeHourRequest
  ): Promise<{ success: boolean; data: OfficeHour }> {
    const response = await apiClient.post<{
      success: boolean
      data: OfficeHour
    }>('/office-hours', data)
    return response.data
  }

  /**
   * Delete an office hours entry (staff only)
   * DELETE /api/office-hours/:id
   */
  async deleteOfficeHour(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean
      message: string
    }>(`/office-hours/${id}`)
    return response.data
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const officeHourService = new OfficeHourService()
