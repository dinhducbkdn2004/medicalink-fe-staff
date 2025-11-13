/**
 * Appointment Service
 * Handles all appointment-related API calls
 * Base URL: /api/appointments
 */
import apiClient from '../core/client'
import type {
  AppointmentListParams,
  AppointmentListResponse,
} from '../types/appointment.types'

/**
 * Appointment Service Class
 */
class AppointmentService {
  private readonly baseUrl = '/appointments'

  /**
   * Get paginated list of appointments
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with appointment list response
   */
  async getList(
    params?: AppointmentListParams
  ): Promise<AppointmentListResponse> {
    const response = await apiClient.get<AppointmentListResponse>(
      this.baseUrl,
      { params }
    )
    return response.data
  }
}

export const appointmentService = new AppointmentService()
