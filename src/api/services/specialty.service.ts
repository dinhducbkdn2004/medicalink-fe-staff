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

  async getAllActiveSpecialties(): Promise<Specialty[]> {
    try {
      const response = await apiClient.get<SpecialtyListResponse>(
        '/specialties',
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
        return response.data.data
      } catch (_fallbackError) {
        return []
      }
    }
  }
  async getSpecialty(id: string): Promise<Specialty> {
    const response = await apiClient.get<Specialty>(`/specialties/${id}`)
    return response.data
  }

  async createSpecialty(data: CreateSpecialtyRequest): Promise<Specialty> {
    const response = await apiClient.post<Specialty>('/specialties', data)
    return response.data
  }

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

  async deleteSpecialty(id: string): Promise<void> {
    await apiClient.delete(`/specialties/${id}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSpecialtyStats(): Promise<any> {
    const response = await apiClient.get('/specialties/stats')
    return response.data
  }

  async getInfoSections(specialtyId: string): Promise<SpecialtyInfoSection[]> {
    const response = await apiClient.get<SpecialtyInfoSection[]>(
      `/specialties/${specialtyId}/info-sections`
    )
    return response.data
  }

  async createInfoSection(
    data: CreateInfoSectionRequest
  ): Promise<SpecialtyInfoSection> {
    const response = await apiClient.post<SpecialtyInfoSection>(
      '/specialties/info-sections',
      data
    )
    return response.data
  }

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

  async deleteInfoSection(id: string): Promise<void> {
    await apiClient.delete(`/specialties/info-sections/${id}`)
  }
}

export const specialtyService = new SpecialtyService()
