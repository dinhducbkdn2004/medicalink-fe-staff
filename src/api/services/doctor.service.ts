import { apiClient } from '../core/client'
import type {
  DoctorAccount,
  DoctorQueryParams,
  DoctorListResponse,
  CompleteDoctorData,
  CreateDoctorRequest,
  CreateDoctorResponse,
  UpdateDoctorAccountRequest,
} from '../types/doctor.types'

/**
 * Doctor Account API Service
 * Manages doctor accounts (staff account management for doctors)
 */
export const doctorService = {
  /**
   * Get paginated list of all doctor accounts with composite data (account + profile merged)
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated list of doctors with profiles
   */
  async getDoctors(params?: DoctorQueryParams): Promise<DoctorListResponse> {
    const response = await apiClient.get<DoctorListResponse>('/doctors', {
      params,
    })
    return response.data
  },

  /**
   * Search doctors with complete data (account + profile merged) using orchestrator
   * @param params - Query parameters for searching
   * @returns Paginated list of doctors with complete data
   */
  async searchCompleteDoctors(
    params?: DoctorQueryParams
  ): Promise<DoctorListResponse> {
    const response = await apiClient.get<DoctorListResponse>(
      '/doctors/search/complete',
      { params }
    )
    return response.data
  },

  /**
   * Get a single doctor account by ID (account only, no profile)
   * @param id - Doctor account CUID
   * @returns Doctor account details
   */
  async getDoctorById(id: string): Promise<DoctorAccount> {
    const response = await apiClient.get<DoctorAccount>(`/doctors/${id}`)
    return response.data
  },

  /**
   * Get complete doctor data (account + profile merged) using orchestrator with caching
   * @param id - Doctor account CUID
   * @param skipCache - Set to true to bypass cache
   * @returns Complete doctor data with account and profile
   */
  async getCompleteDoctorById(
    id: string,
    skipCache = false
  ): Promise<CompleteDoctorData> {
    const response = await apiClient.get<CompleteDoctorData>(
      `/doctors/${id}/complete`,
      {
        params: { skipCache },
      }
    )
    return response.data
  },

  /**
   * Create a complete doctor (account + profile) using orchestrator saga pattern
   * @param data - Doctor account data
   * @returns Create doctor response with IDs and correlation ID
   */
  async createDoctor(data: CreateDoctorRequest): Promise<CreateDoctorResponse> {
    const response = await apiClient.post<CreateDoctorResponse>(
      '/doctors',
      data
    )
    return response.data
  },

  /**
   * Update a doctor account (account data only, not profile)
   * @param id - Doctor account CUID
   * @param data - Updated doctor account data
   * @returns Updated doctor account
   */
  async updateDoctor(
    id: string,
    data: UpdateDoctorAccountRequest
  ): Promise<DoctorAccount> {
    const response = await apiClient.patch<DoctorAccount>(
      `/doctors/${id}`,
      data
    )
    return response.data
  },

  /**
   * Delete a doctor account (soft delete)
   * @param id - Doctor account CUID
   * @returns Deleted doctor account details
   */
  async deleteDoctor(id: string): Promise<DoctorAccount> {
    const response = await apiClient.delete<DoctorAccount>(`/doctors/${id}`)
    return response.data
  },
  /**
   * Get current doctor's profile
   * GET /api/doctors/profile/me
   */
  async getProfileMe(): Promise<CompleteDoctorData> {
    const response = await apiClient.get<CompleteDoctorData>(
      '/doctors/profile/me'
    )
    return response.data
  },
}
