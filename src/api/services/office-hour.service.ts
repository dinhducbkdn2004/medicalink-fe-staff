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

/**
 * Grouped response from GET /api/office-hours
 * API returns office hours categorized by type
 * Note: apiClient interceptor auto-unwraps response.data.data to response.data
 */
export interface OfficeHoursGroupedResponse {
  global: OfficeHour[] // isGlobal=true, doctorId=null
  workLocation: OfficeHour[] // workLocationId set, doctorId=null, isGlobal=false
  doctor: OfficeHour[] // doctorId set, workLocationId=null
  doctorInLocation: OfficeHour[] // Both doctorId and workLocationId set
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
   * Returns: Grouped office hours (auto-unwrapped by apiClient interceptor)
   */
  async getOfficeHours(
    params: OfficeHourQueryParams = {}
  ): Promise<OfficeHoursGroupedResponse> {
    const response = await apiClient.get<OfficeHoursGroupedResponse>(
      '/office-hours',
      { params }
    )
    return response.data
  }

  /**
   * Get public office hours for a doctor at a location (public endpoint)
   * GET /api/office-hours/public?doctorId=xxx&workLocationId=xxx
   * Returns: Flat array of applicable office hours
   */
  async getPublicOfficeHours(
    doctorId: string,
    workLocationId: string
  ): Promise<OfficeHour[]> {
    const response = await apiClient.get<OfficeHour[]>('/office-hours/public', {
      params: { doctorId, workLocationId },
    })
    return response.data
  }

  /**
   * Create new office hours entry (staff only)
   * POST /api/office-hours
   * Returns: Created office hour (auto-unwrapped by apiClient interceptor)
   */
  async createOfficeHour(data: CreateOfficeHourRequest): Promise<OfficeHour> {
    const response = await apiClient.post<OfficeHour>('/office-hours', data)
    return response.data
  }

  /**
   * Delete an office hours entry (staff only)
   * DELETE /api/office-hours/:id
   * Returns: Deleted office hour (auto-unwrapped by apiClient interceptor)
   */
  async deleteOfficeHour(id: string): Promise<OfficeHour> {
    const response = await apiClient.delete<OfficeHour>(`/office-hours/${id}`)
    return response.data
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const officeHourService = new OfficeHourService()
