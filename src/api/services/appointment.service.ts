/**
 * Appointment Service
 * Handles all appointment-related API calls
 * Base URL: /api/appointments
 */
import apiClient from '../core/client'
import type {
  Appointment,
  AppointmentListParams,
  AppointmentListResponse,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  AppointmentActionResponse,
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

  /**
   * Get a single appointment by ID
   * Requires permission: appointments:read
   * @param id - Appointment CUID
   * @returns Appointment details
   */
  async getById(id: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Create a new appointment
   * Requires permission: appointments:create
   * @param data - Appointment data
   * @returns Created appointment
   */
  async create(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(this.baseUrl, data)
    return response.data
  }

  /**
   * Update an appointment
   * Requires permission: appointments:update
   * @param id - Appointment CUID
   * @param data - Updated appointment data (partial)
   * @returns Updated appointment
   */
  async update(
    id: string,
    data: UpdateAppointmentRequest
  ): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(
      `${this.baseUrl}/${id}`,
      data
    )
    return response.data
  }

  /**
   * Reschedule an appointment to a new time/date/location
   * Requires permission: appointments:update
   * @param id - Appointment CUID
   * @param data - Reschedule data
   * @returns Rescheduled appointment
   */
  async reschedule(
    id: string,
    data: RescheduleAppointmentRequest
  ): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(
      `${this.baseUrl}/${id}/reschedule`,
      data
    )
    return response.data
  }

  /**
   * Confirm an appointment
   * Requires permission: appointments:update
   * @param id - Appointment CUID
   * @returns Confirmed appointment response
   */
  async confirm(id: string): Promise<AppointmentActionResponse> {
    const response = await apiClient.patch<AppointmentActionResponse>(
      `${this.baseUrl}/${id}/confirm`
    )
    return response.data
  }

  /**
   * Mark an appointment as completed
   * Requires permission: appointments:update
   * @param id - Appointment CUID
   * @returns Completed appointment response
   */
  async complete(id: string): Promise<AppointmentActionResponse> {
    const response = await apiClient.patch<AppointmentActionResponse>(
      `${this.baseUrl}/${id}/complete`
    )
    return response.data
  }

  /**
   * Cancel an appointment
   * Requires permission: appointments:delete
   * @param id - Appointment CUID
   * @param data - Cancellation reason
   * @returns Cancelled appointment response
   */
  async cancel(
    id: string,
    data?: CancelAppointmentRequest
  ): Promise<AppointmentActionResponse> {
    const response = await apiClient.delete<AppointmentActionResponse>(
      `${this.baseUrl}/${id}`,
      { data }
    )
    return response.data
  }
}

export const appointmentService = new AppointmentService()
