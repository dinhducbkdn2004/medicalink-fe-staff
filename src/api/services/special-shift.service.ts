import { apiClient } from '../core/client'
import type { PaginationParams } from '../types/common.types'

export interface SpecialShift {
  id: string
  doctorId: string
  workLocationId?: string | null
  effectiveDate: string
  startTime: string
  endTime: string
  reason?: string | null
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

export interface SpecialShiftQueryParams extends PaginationParams {
  doctorId?: string
  workLocationId?: string
  effectiveDate?: string
}

export interface CreateSpecialShiftRequest {
  doctorId: string
  workLocationId?: string | null
  effectiveDate: string
  startTime: string
  endTime: string
  reason?: string | null
}

export type UpdateSpecialShiftRequest = Partial<CreateSpecialShiftRequest>

class SpecialShiftService {
  async getSpecialShifts(
    params: SpecialShiftQueryParams = {}
  ): Promise<SpecialShift[]> {
    const response = await apiClient.get<SpecialShift[]>('/special-shifts', {
      params,
    })
    return response.data
  }

  async createSpecialShift(
    data: CreateSpecialShiftRequest
  ): Promise<SpecialShift> {
    const response = await apiClient.post<SpecialShift>('/special-shifts', data)
    return response.data
  }

  async updateSpecialShift(
    id: string,
    data: UpdateSpecialShiftRequest
  ): Promise<SpecialShift> {
    const response = await apiClient.patch<SpecialShift>(
      `/special-shifts/${id}`,
      data
    )
    return response.data
  }

  async deleteSpecialShift(id: string): Promise<SpecialShift> {
    const response = await apiClient.delete<SpecialShift>(
      `/special-shifts/${id}`
    )
    return response.data
  }
}

export const specialShiftService = new SpecialShiftService()
