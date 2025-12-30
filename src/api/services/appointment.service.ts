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

class AppointmentService {
  private readonly baseUrl = '/appointments'

  async getList(
    params?: AppointmentListParams
  ): Promise<AppointmentListResponse> {
    const response = await apiClient.get<AppointmentListResponse>(
      this.baseUrl,
      { params }
    )
    return response.data
  }

  async getById(id: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`${this.baseUrl}/${id}`)
    return response.data
  }

  async create(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(this.baseUrl, data)
    return response.data
  }

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

  async confirm(id: string): Promise<AppointmentActionResponse> {
    const response = await apiClient.patch<AppointmentActionResponse>(
      `${this.baseUrl}/${id}/confirm`
    )
    return response.data
  }

  async complete(id: string): Promise<AppointmentActionResponse> {
    const response = await apiClient.patch<AppointmentActionResponse>(
      `${this.baseUrl}/${id}/complete`
    )
    return response.data
  }

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
