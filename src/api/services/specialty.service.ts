/**
 * Specialty API Service
 * Handles API calls related to specialties
 */
import { apiClient } from '../core/client'
import type { PaginatedResponse, PaginationParams } from '../types/common.types'

export interface Specialty {
  id: string
  name: string
  slug: string
}

export interface SpecialtyQueryParams extends PaginationParams {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type SpecialtyListResponse = PaginatedResponse<Specialty>

class SpecialtyService {
  /**
   * Get all specialties
   * GET /api/specialties
   */
  async getSpecialties(
    params: SpecialtyQueryParams = {}
  ): Promise<SpecialtyListResponse> {
    const response = await apiClient.get<SpecialtyListResponse>(
      '/specialties',
      {
        params,
      }
    )
    return response.data
  }
}

export const specialtyService = new SpecialtyService()
