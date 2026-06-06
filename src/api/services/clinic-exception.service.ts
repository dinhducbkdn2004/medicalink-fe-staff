import { apiClient } from '../core/client'
import type { PaginationParams } from '../types/common.types'

export interface ClinicException {
  id: string
  workLocationId?: string | null
  date: string
  isFullDay: boolean
  startTime?: string | null
  endTime?: string | null
  reason?: string | null
  createdAt: string
  updatedAt: string
  workLocation?: {
    id: string
    name: string
  }
}

export interface ClinicExceptionQueryParams extends PaginationParams {
  workLocationId?: string
  date?: string
}

export interface CreateClinicExceptionRequest {
  workLocationId?: string | null
  date: string
  isFullDay?: boolean
  startTime?: string | null
  endTime?: string | null
  reason?: string | null
}

export type UpdateClinicExceptionRequest = Partial<CreateClinicExceptionRequest>

class ClinicExceptionService {
  async getClinicExceptions(
    params: ClinicExceptionQueryParams = {}
  ): Promise<ClinicException[]> {
    const response = await apiClient.get<ClinicException[]>(
      '/clinic-exceptions',
      {
        params,
      }
    )
    return response.data
  }

  async createClinicException(
    data: CreateClinicExceptionRequest
  ): Promise<ClinicException> {
    const response = await apiClient.post<ClinicException>(
      '/clinic-exceptions',
      data
    )
    return response.data
  }

  async updateClinicException(
    id: string,
    data: UpdateClinicExceptionRequest
  ): Promise<ClinicException> {
    const response = await apiClient.patch<ClinicException>(
      `/clinic-exceptions/${id}`,
      data
    )
    return response.data
  }

  async deleteClinicException(id: string): Promise<ClinicException> {
    const response = await apiClient.delete<ClinicException>(
      `/clinic-exceptions/${id}`
    )
    return response.data
  }
}

export const clinicExceptionService = new ClinicExceptionService()
