import { apiClient } from '../core/client'
import type { PaginatedResponse, PaginationParams } from '../types/common.types'

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

class WorkLocationService {
  async getWorkLocations(
    params: WorkLocationQueryParams = {}
  ): Promise<WorkLocationListResponse> {
    const response = await apiClient.get<WorkLocationListResponse>(
      '/work-locations',
      { params }
    )
    return response.data
  }

  async getAllActiveWorkLocations(): Promise<WorkLocation[]> {
    try {
      const response = await apiClient.get<WorkLocationListResponse>(
        '/work-locations',
        {
          params: {
            isActive: true,
            limit: 100,
            sortBy: 'name',
            sortOrder: 'asc',
          },
        }
      )
      return response.data.data
    } catch (_error) {
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
        return response.data.data.filter((l) => l.isActive)
      } catch (_fallbackError) {
        return []
      }
    }
  }

  async getWorkLocationStats(): Promise<WorkLocationStats> {
    const response = await apiClient.get<WorkLocationStats>(
      '/work-locations/stats'
    )
    return response.data
  }

  async getWorkLocation(id: string): Promise<WorkLocation> {
    const response = await apiClient.get<WorkLocation>(`/work-locations/${id}`)
    return response.data
  }

  async createWorkLocation(
    data: CreateWorkLocationRequest
  ): Promise<WorkLocation> {
    const response = await apiClient.post<WorkLocation>('/work-locations', data)
    return response.data
  }

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

  async deleteWorkLocation(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean
      message: string
    }>(`/work-locations/${id}`)
    return response.data
  }

  async getPublicWorkLocations(
    params: WorkLocationQueryParams = {}
  ): Promise<WorkLocationListResponse> {
    const response = await apiClient.get<WorkLocationListResponse>(
      '/work-locations/public',
      { params }
    )
    return response.data
  }
}

export const workLocationService = new WorkLocationService()
