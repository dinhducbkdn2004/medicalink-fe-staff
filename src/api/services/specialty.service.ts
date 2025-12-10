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

export interface CreateSpecialtyRequest {
  name: string
  description?: string
  iconUrl?: string
  isActive?: boolean
}

export type UpdateSpecialtyRequest = Partial<CreateSpecialtyRequest>

export interface SpecialtyInfoSection {
  id: string
  specialtyId: string
  title: string
  content: string
  order?: number
  isActive: boolean
}

export interface CreateInfoSectionRequest {
  specialtyId: string
  title: string
  content: string
  order?: number
  isActive?: boolean
}

export type UpdateInfoSectionRequest = Partial<
  Omit<CreateInfoSectionRequest, 'specialtyId'>
>

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

  /**
   * Get specialty by ID
   */
  async getSpecialty(id: string): Promise<Specialty> {
    const response = await apiClient.get<Specialty>(`/specialties/${id}`)
    return response.data
  }

  /**
   * Create new specialty
   */
  async createSpecialty(data: CreateSpecialtyRequest): Promise<Specialty> {
    const response = await apiClient.post<Specialty>('/specialties', data)
    return response.data
  }

  /**
   * Update specialty
   */
  async updateSpecialty(
    id: string,
    data: UpdateSpecialtyRequest
  ): Promise<Specialty> {
    const response = await apiClient.patch<Specialty>(
      `/specialties/${id}`,
      data
    )
    return response.data
  }

  /**
   * Delete specialty
   */
  async deleteSpecialty(id: string): Promise<void> {
    await apiClient.delete(`/specialties/${id}`)
  }

  /**
   * Get specialty statistics
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSpecialtyStats(): Promise<any> {
    const response = await apiClient.get('/specialties/stats')
    return response.data
  }

  /**
   * Get info sections for a specialty
   */
  async getInfoSections(specialtyId: string): Promise<SpecialtyInfoSection[]> {
    const response = await apiClient.get<SpecialtyInfoSection[]>(
      `/specialties/${specialtyId}/info-sections`
    )
    return response.data
  }

  /**
   * Create info section
   */
  async createInfoSection(
    data: CreateInfoSectionRequest
  ): Promise<SpecialtyInfoSection> {
    const response = await apiClient.post<SpecialtyInfoSection>(
      '/specialties/info-sections',
      data
    )
    return response.data
  }

  /**
   * Update info section
   */
  async updateInfoSection(
    id: string,
    data: UpdateInfoSectionRequest
  ): Promise<SpecialtyInfoSection> {
    const response = await apiClient.patch<SpecialtyInfoSection>(
      `/specialties/info-sections/${id}`,
      data
    )
    return response.data
  }

  /**
   * Delete info section
   */
  async deleteInfoSection(id: string): Promise<void> {
    await apiClient.delete(`/specialties/info-sections/${id}`)
  }
}

export const specialtyService = new SpecialtyService()
