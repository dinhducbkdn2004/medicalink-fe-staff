import { apiClient } from '../core/client'
import type { ApiSuccessResponse } from '../types/common.types'
import type {
  DoctorProfile,
  CreateDoctorProfileRequest,
  UpdateDoctorProfileRequest,
  ToggleDoctorProfileActiveRequest,
} from '../types/doctor.types'

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
}
