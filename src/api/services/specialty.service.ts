/**
 * Specialty API Service
 * Handles all API calls related to specialties
 * API Base: /api/specialties
 */
import { apiClient } from '../core/client'
import type { PaginatedResponse, PaginationParams } from '../types/common.types'

// ============================================================================
// Types
// ============================================================================

export interface Specialty {
  id: string
  name: string
  slug: string
  description?: string
  iconUrl?: string
  isActive: boolean
  infoSectionsCount?: number
  createdAt: string
  updatedAt: string
}

export interface SpecialtyQueryParams extends PaginationParams {
  search?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateSpecialtyRequest {
  name: string
  description?: string
  iconUrl?: string
}

export interface UpdateSpecialtyRequest {
  name?: string
  description?: string
  iconUrl?: string
}

export interface SpecialtyStats {
  total: number
  recentlyCreated: number
}

export interface SpecialtyInfoSection {
  id: string
  specialtyId: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface CreateInfoSectionRequest {
  specialtyId: string
  name: string
  content?: string
}

export interface UpdateInfoSectionRequest {
  name?: string
  content?: string
}

export type SpecialtyListResponse = PaginatedResponse<Specialty>

// ============================================================================
// Service Class
// ============================================================================

class SpecialtyService {
  // --------------------------------------------------------------------------
  // Specialty CRUD
  // --------------------------------------------------------------------------

  /**
   * Get all specialties with pagination and filtering
   * GET /api/specialties
   */
  async getSpecialties(
    params: SpecialtyQueryParams = {}
  ): Promise<SpecialtyListResponse> {
    const response = await apiClient.get<SpecialtyListResponse>(
      '/specialties',
      { params }
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
        // Filter active on client side
        return response.data.data.filter((s) => s.isActive)
      } catch (_fallbackError) {
        // Silent fallback - return empty array
        return []
      }
    }
  }

  /**
   * Get specialty statistics
   * GET /api/specialties/stats
   */
  async getSpecialtyStats(): Promise<SpecialtyStats> {
    const response = await apiClient.get<SpecialtyStats>('/specialties/stats')
    return response.data
  }

  /**
   * Get a single specialty by ID
   * GET /api/specialties/:id
   */
  async getSpecialty(id: string): Promise<Specialty> {
    const response = await apiClient.get<Specialty>(`/specialties/${id}`)
    return response.data
  }

  /**
   * Create a new specialty
   * POST /api/specialties
   */
  async createSpecialty(data: CreateSpecialtyRequest): Promise<Specialty> {
    const response = await apiClient.post<Specialty>('/specialties', data)
    return response.data
  }

  /**
   * Update a specialty
   * PATCH /api/specialties/:id
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
   * Delete a specialty (soft delete)
   * DELETE /api/specialties/:id
   */
  async deleteSpecialty(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean
      message: string
    }>(`/specialties/${id}`)
    return response.data
  }

  // --------------------------------------------------------------------------
  // Info Sections
  // --------------------------------------------------------------------------

  /**
   * Get all info sections for a specialty
   * GET /api/specialties/:specialtyId/info-sections
   */
  async getInfoSections(specialtyId: string): Promise<SpecialtyInfoSection[]> {
    const response = await apiClient.get<SpecialtyInfoSection[]>(
      `/specialties/${specialtyId}/info-sections`
    )
    return response.data
  }

  /**
   * Create a new info section
   * POST /api/specialties/info-sections
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
   * Update an info section
   * PATCH /api/specialties/info-sections/:id
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
   * Delete an info section
   * DELETE /api/specialties/info-sections/:id
   */
  async deleteInfoSection(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean
      message: string
    }>(`/specialties/info-sections/${id}`)
    return response.data
  }

  /**
   * Get public specialties (no authentication required)
   * GET /api/specialties/public
   */
  async getPublicSpecialties(
    params: SpecialtyQueryParams = {}
  ): Promise<SpecialtyListResponse> {
    const response = await apiClient.get<SpecialtyListResponse>(
      '/specialties/public',
      { params }
    )
    return response.data
  }
}

export const specialtyService = new SpecialtyService()
