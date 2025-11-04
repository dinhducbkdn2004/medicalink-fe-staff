/**
 * Work Location API Service
 * Handles all API calls related to work locations
 * API Base: /api/work-locations
 */
import { apiClient } from '../core/client'
import type { PaginatedResponse, PaginationParams } from '../types/common.types'

// ============================================================================
// Types
// ============================================================================

export interface WorkLocation {
  id: string
  name: string
  slug: string
  address?: string
  phone?: string
  timezone?: string
  googleMapUrl?: string
  isActive: boolean
  doctorsCount?: number
  createdAt: string
  updatedAt: string
}

export interface WorkLocationQueryParams extends PaginationParams {
  search?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  includeMetadata?: boolean
}

export interface CreateWorkLocationRequest {
  name: string
  address?: string
  phone?: string
  timezone?: string
  googleMapUrl?: string
}

export interface UpdateWorkLocationRequest {
  name?: string
  address?: string
  phone?: string
  timezone?: string
  googleMapUrl?: string
}

export interface WorkLocationStats {
  total: number
  recentlyCreated: number
}

export type WorkLocationListResponse = PaginatedResponse<WorkLocation>

// ============================================================================
// Service Class
// ============================================================================

class WorkLocationService {
  // --------------------------------------------------------------------------
  // Work Location CRUD
  // --------------------------------------------------------------------------

  /**
   * Get all work locations with pagination and filtering
   * GET /api/work-locations
   */
  async getWorkLocations(
    params: WorkLocationQueryParams = {}
  ): Promise<WorkLocationListResponse> {
    const response = await apiClient.get<WorkLocationListResponse>(
      '/work-locations',
      { params }
    )
    return response.data
  }

  /**
   * Get all active work locations (no pagination, for dropdowns)
   * GET /api/work-locations?isActive=true&limit=100
   */
  async getAllActiveWorkLocations(): Promise<WorkLocation[]> {
    try {
      const response = await apiClient.get<WorkLocationListResponse>(
        '/work-locations',
        {
          params: {
            isActive: true,
            limit: 100, // Get active locations (backend may have max limit)
            sortBy: 'name',
            sortOrder: 'asc',
          },
        }
      )
      return response.data.data
    } catch (_error) {
      // Fallback: try without isActive filter if it fails
      try {
        const response = await apiClient.get<WorkLocationListResponse>(
          '/work-locations',
          {
            params: {
              limit: 100,
              sortBy: 'name',
              sortOrder: 'asc',
            },
          }
        )
        // Filter active on client side
        return response.data.data.filter((l) => l.isActive)
      } catch (_fallbackError) {
        // Silent fallback - return empty array
        return []
      }
    }
  }

  /**
   * Get work location statistics
   * GET /api/work-locations/stats
   */
  async getWorkLocationStats(): Promise<WorkLocationStats> {
    const response = await apiClient.get<WorkLocationStats>(
      '/work-locations/stats'
    )
    return response.data
  }

  /**
   * Get a single work location by ID
   * GET /api/work-locations/:id
   */
  async getWorkLocation(id: string): Promise<WorkLocation> {
    const response = await apiClient.get<WorkLocation>(`/work-locations/${id}`)
    return response.data
  }

  /**
   * Create a new work location
   * POST /api/work-locations
   */
  async createWorkLocation(
    data: CreateWorkLocationRequest
  ): Promise<WorkLocation> {
    const response = await apiClient.post<WorkLocation>('/work-locations', data)
    return response.data
  }

  /**
   * Update a work location
   * PATCH /api/work-locations/:id
   */
  async updateWorkLocation(
    id: string,
    data: UpdateWorkLocationRequest
  ): Promise<WorkLocation> {
    const response = await apiClient.patch<WorkLocation>(
      `/work-locations/${id}`,
      data
    )
    return response.data
  }

  /**
   * Delete a work location (soft delete)
   * DELETE /api/work-locations/:id
   */
  async deleteWorkLocation(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean
      message: string
    }>(`/work-locations/${id}`)
    return response.data
  }
}

export const workLocationService = new WorkLocationService()
