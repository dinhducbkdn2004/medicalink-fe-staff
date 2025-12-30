import { apiClient } from '../core/client'
import type { PaginationParams } from '../types/common.types'

export interface OfficeHour {
  id: string
  doctorId: string | null
  workLocationId: string | null
  dayOfWeek: number
  startTime: string
  endTime: string
  isGlobal: boolean
  createdAt: string
  updatedAt: string
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
  startTime: string
  endTime: string
  isGlobal?: boolean
}

export interface OfficeHoursGroupedResponse {
  global: OfficeHour[]
  workLocation: OfficeHour[]
  doctor: OfficeHour[]
  doctorInLocation: OfficeHour[]
}

class OfficeHourService {
  async getOfficeHours(
    params: OfficeHourQueryParams = {}
  ): Promise<OfficeHoursGroupedResponse> {
    const response = await apiClient.get<OfficeHoursGroupedResponse>(
      '/office-hours',
      { params }
    )
    return response.data
  }

  async getPublicOfficeHours(
    doctorId: string,
    workLocationId: string
  ): Promise<OfficeHour[]> {
    const response = await apiClient.get<OfficeHour[]>('/office-hours/public', {
      params: { doctorId, workLocationId },
    })
    return response.data
  }

  async createOfficeHour(data: CreateOfficeHourRequest): Promise<OfficeHour> {
    const response = await apiClient.post<OfficeHour>('/office-hours', data)
    return response.data
  }

  async deleteOfficeHour(id: string): Promise<OfficeHour> {
    const response = await apiClient.delete<OfficeHour>(`/office-hours/${id}`)
    return response.data
  }
}

export const officeHourService = new OfficeHourService()
