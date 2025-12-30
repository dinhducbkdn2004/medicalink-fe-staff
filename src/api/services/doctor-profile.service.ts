import { apiClient } from '../core/client'
import type {
  ApiSuccessResponse,
  PaginationParams,
} from '../types/common.types'
import type {
  DoctorProfile,
  CreateDoctorProfileRequest,
  UpdateDoctorProfileRequest,
  ToggleDoctorProfileActiveRequest,
  PublicDoctorProfileListResponse,
} from '../types/doctor.types'

export interface PublicDoctorProfileQueryParams extends PaginationParams {
  search?: string
  specialtyIds?: string
  workLocationIds?: string
  sortBy?: 'createdAt' | 'fullName'
  sortOrder?: 'asc' | 'desc'
}

export interface TimeSlot {
  timeStart: string
  timeEnd: string
}

export interface MonthSlotsResponse {
  availableDates: string[]
  month: number
  year: number
}

export const doctorProfileService = {
  async getMyProfile(): Promise<DoctorProfile> {
    const response = await apiClient.get<DoctorProfile>('/doctors/profile/me')
    return response.data
  },

  async getDoctorProfileById(id: string): Promise<DoctorProfile> {
    const response = await apiClient.get<DoctorProfile>(
      `/doctors/profile/${id}`
    )
    return response.data
  },

  async createDoctorProfile(
    data: CreateDoctorProfileRequest
  ): Promise<DoctorProfile> {
    const response = await apiClient.post<DoctorProfile>(
      '/doctors/profile',
      data
    )
    return response.data
  },

  async updateMyProfile(
    data: UpdateDoctorProfileRequest
  ): Promise<DoctorProfile> {
    const response = await apiClient.patch<DoctorProfile>(
      '/doctors/profile/me',
      data
    )
    return response.data
  },

  async updateDoctorProfile(
    id: string,
    data: UpdateDoctorProfileRequest
  ): Promise<DoctorProfile> {
    const response = await apiClient.patch<DoctorProfile>(
      `/doctors/profile/${id}`,
      data
    )
    return response.data
  },

  async toggleDoctorProfileActive(
    id: string,
    data: ToggleDoctorProfileActiveRequest
  ): Promise<DoctorProfile> {
    const response = await apiClient.patch<DoctorProfile>(
      `/doctors/profile/${id}/toggle-active`,
      data
    )
    return response.data
  },

  async deleteDoctorProfile(id: string): Promise<ApiSuccessResponse> {
    const response = await apiClient.delete<ApiSuccessResponse>(
      `/doctors/profile/${id}`
    )
    return response.data
  },

  async getPublicDoctorProfiles(
    params: PublicDoctorProfileQueryParams = {}
  ): Promise<PublicDoctorProfileListResponse> {
    const response = await apiClient.get<PublicDoctorProfileListResponse>(
      '/doctors/profile/public',
      { params }
    )
    return response.data
  },

  async getDoctorAvailableSlots(
    profileId: string,
    locationId: string,
    serviceDate: string,
    allowPast = false
  ): Promise<TimeSlot[]> {
    const response = await apiClient.get<TimeSlot[]>(
      `/doctors/profile/${profileId}/slots`,
      {
        params: {
          locationId,
          serviceDate,
          allowPast,
        },
      }
    )
    return response.data
  },

  async getDoctorMonthSlots(
    profileId: string,
    month: number,
    year: number,
    locationId: string,
    allowPast = false
  ): Promise<MonthSlotsResponse> {
    const response = await apiClient.get<MonthSlotsResponse>(
      `/doctors/profile/${profileId}/month-slots`,
      {
        params: {
          month,
          year,
          locationId,
          allowPast,
        },
      }
    )
    return response.data
  },

  async getDoctorAvailableDates(
    profileId: string,
    locationId: string,
    startDate?: string,
    endDate?: string
  ): Promise<string[]> {
    const start = startDate ? new Date(startDate) : new Date()
    const end = endDate
      ? new Date(endDate)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

    const dates: string[] = []
    const currentDate = new Date(start)

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    const availableDates: string[] = []

    const batchSize = 3
    for (let i = 0; i < dates.length; i += batchSize) {
      const batch = dates.slice(i, i + batchSize)
      const results = await Promise.allSettled(
        batch.map(async (date) => {
          try {
            const slots = await this.getDoctorAvailableSlots(
              profileId,
              locationId,
              date,
              true
            )
            const hasAvailableSlots = slots.length > 0
            return hasAvailableSlots ? date : null
          } catch {
            return null
          }
        })
      )

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          availableDates.push(result.value)
        }
      }

      if (i + batchSize < dates.length) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    return availableDates.sort((a, b) => a.localeCompare(b))
  },
}
