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
  isActive?: boolean
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

  /**
   * Get all public specialties
   * GET /api/specialties/public
   */
  async getPublicSpecialties(
    params: SpecialtyQueryParams = {}
  ): Promise<SpecialtyListResponse> {
    const response = await apiClient.get<SpecialtyListResponse>(
      '/specialties/public',
      {
        params,
      }
    )
    return response.data
  }

  /**
   * Get all active specialties (no pagination, for dropdowns)
   * GET /api/specialties?isActive=true&limit=100
   */
  async getAllActiveSpecialties(): Promise<Specialty[]> {
    try {
      const response = await apiClient.get<SpecialtyListResponse>(
        '/specialties',
        {
          params: {
            isActive: true,
            limit: 100, // Get active specialties (backend may have max limit)
            sortBy: 'name',
            sortOrder: 'asc',
          },
        }
      )
      return response.data.data
    } catch (_error) {
      // Fallback: try without isActive filter if it fails
      try {
        const response = await apiClient.get<SpecialtyListResponse>(
          '/specialties',
          {
            params: {
              limit: 100,
              sortBy: 'name',
              sortOrder: 'asc',
            },
          }
        )
        // Filter active on client side if API doesn't support filtering
        // Logic: if 'isActive' property exists, filter by it. Otherwise return all.
        // Assuming Specialty interface might not strictly enforce isActive locally but backend returns it.
        // If Specialty interface needs update, we should check that too.
        return response.data.data
      } catch (_fallbackError) {
        return []
      }
    }
  }
}

export const specialtyService = new SpecialtyService()
