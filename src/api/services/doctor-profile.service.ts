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

/**
 * Query parameters for public doctor profiles
 */
export interface PublicDoctorProfileQueryParams extends PaginationParams {
  search?: string
  specialtyIds?: string
  workLocationIds?: string
  sortBy?: 'createdAt' | 'fullName'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Time slot for doctor availability
 * Response from GET /api/doctors/profile/:profileId/slots
 */
export interface TimeSlot {
  timeStart: string // HH:mm format (API field name)
  timeEnd: string // HH:mm format (API field name)
}

/**
 * Doctor Profile API Service
 * Manages public-facing doctor profile information including specialties, locations, and professional details
 */
export const doctorProfileService = {
  /**
   * Get the current doctor's own profile
   * Requires authentication
   * @returns Current doctor's profile
   */
  async getMyProfile(): Promise<DoctorProfile> {
    const response = await apiClient.get<DoctorProfile>('/doctors/profile/me')
    return response.data
  },

  /**
   * Get a doctor profile by ID
   * Requires authentication and doctors:read permission
   * @param id - Doctor profile CUID
   * @returns Doctor profile details
   */
  async getDoctorProfileById(id: string): Promise<DoctorProfile> {
    const response = await apiClient.get<DoctorProfile>(
      `/doctors/profile/${id}`
    )
    return response.data
  },

  /**
   * Create a new doctor profile
   * Requires authentication and doctors:update permission
   * @param data - Doctor profile data
   * @returns Created doctor profile
   */
  async createDoctorProfile(
    data: CreateDoctorProfileRequest
  ): Promise<DoctorProfile> {
    const response = await apiClient.post<DoctorProfile>(
      '/doctors/profile',
      data
    )
    return response.data
  },

  /**
   * Update the current doctor's own profile
   * Requires authentication (self-update allowed)
   * @param data - Updated doctor profile data
   * @returns Updated doctor profile
   */
  async updateMyProfile(
    data: UpdateDoctorProfileRequest
  ): Promise<DoctorProfile> {
    const response = await apiClient.patch<DoctorProfile>(
      '/doctors/profile/me',
      data
    )
    return response.data
  },

  /**
   * Update a doctor profile by ID (admin)
   * Requires authentication and doctors:update permission
   * @param id - Doctor profile CUID
   * @param data - Updated doctor profile data
   * @returns Updated doctor profile
   */
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

  /**
   * Toggle doctor profile active status
   * Requires authentication and doctors:update permission
   * @param id - Doctor profile CUID
   * @param data - Active status
   * @returns Updated doctor profile
   */
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

  /**
   * Delete a doctor profile
   * Requires authentication and doctors:delete permission
   * @param id - Doctor profile CUID
   * @returns Success response
   */
  async deleteDoctorProfile(id: string): Promise<ApiSuccessResponse> {
    const response = await apiClient.delete<ApiSuccessResponse>(
      `/doctors/profile/${id}`
    )
    return response.data
  },

  /**
   * Get public doctor profiles (no authentication required)
   * GET /api/doctors/profile/public
   * @param params - Query parameters for filtering
   * @returns Paginated list of public doctor profiles
   */
  async getPublicDoctorProfiles(
    params: PublicDoctorProfileQueryParams = {}
  ): Promise<PublicDoctorProfileListResponse> {
    const response = await apiClient.get<PublicDoctorProfileListResponse>(
      '/doctors/profile/public',
      { params }
    )
    return response.data
  },

  /**
   * Get available time slots for a doctor at a specific location on a specific date
   * GET /api/doctors/profile/:profileId/slots
   * @param profileId - Doctor profile CUID
   * @param locationId - Work location CUID
   * @param serviceDate - Date in YYYY-MM-DD format
   * @param allowPast - Allow past dates (default: false)
   * @returns Array of time slots
   */
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

  /**
   * Get available dates for a doctor at a specific location
   * This method queries slots endpoint for a date range to find available dates
   * @param profileId - Doctor profile CUID
   * @param locationId - Work location CUID
   * @param startDate - Optional start date in YYYY-MM-DD format
   * @param endDate - Optional end date in YYYY-MM-DD format
   * @returns Array of available dates in YYYY-MM-DD format
   */
  async getDoctorAvailableDates(
    profileId: string,
    locationId: string,
    startDate?: string,
    endDate?: string
  ): Promise<string[]> {
    // Generate date range (default: next 30 days from today)
    const start = startDate ? new Date(startDate) : new Date()
    const end = endDate
      ? new Date(endDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    const dates: string[] = []
    const currentDate = new Date(start)

    // Collect all dates in range
    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Query slots for each date and filter dates with available slots
    const availableDates: string[] = []

    // Process in batches of 7 days to avoid too many parallel requests
    const batchSize = 7
    for (let i = 0; i < dates.length; i += batchSize) {
      const batch = dates.slice(i, i + batchSize)
      const results = await Promise.allSettled(
        batch.map(async (date) => {
          try {
            const slots = await this.getDoctorAvailableSlots(
              profileId,
              locationId,
              date,
              true // allowPast for staff
            )
            // If there are any slots available for this date, include it
            const hasAvailableSlots = slots.length > 0
            return hasAvailableSlots ? date : null
          } catch (error) {
            console.error(`Failed to fetch slots for ${date}:`, error)
            return null
          }
        })
      )

      // Collect successful results
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          availableDates.push(result.value)
        }
      }
    }

    return availableDates.sort((a, b) => a.localeCompare(b))
  },
}
