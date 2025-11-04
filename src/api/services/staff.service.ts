import { apiClient } from '../core/client'
import type { ApiSuccessResponse } from '../types/common.types'
import type {
  Staff,
  StaffStats,
  StaffQueryParams,
  StaffListResponse,
  CreateStaffRequest,
  UpdateStaffRequest,
} from '../types/staff.types'

/**
 * Staff API Service
 * Manages staff accounts (non-doctor employees) including administrators and super administrators
 */
export const staffService = {
  /**
   * Get paginated list of all staff accounts with filtering and sorting
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated list of staff accounts
   */
  async getStaffs(params?: StaffQueryParams): Promise<StaffListResponse> {
    const response = await apiClient.get<StaffListResponse>('/staffs', {
      params,
    })
    return response.data
  },

  /**
   * Get statistics about staff accounts
   * @returns Staff statistics including total, active, inactive counts and role breakdown
   */
  async getStaffStats(): Promise<StaffStats> {
    const response = await apiClient.get<StaffStats>('/staffs/stats')
    return response.data
  },

  /**
   * Get a single staff account by ID
   * @param id - Staff account CUID
   * @returns Staff account details
   */
  async getStaffById(id: string): Promise<Staff> {
    const response = await apiClient.get<Staff>(`/staffs/${id}`)
    return response.data
  },

  /**
   * Create a new staff account
   * @param data - Staff account data
   * @returns Created staff account
   */
  async createStaff(data: CreateStaffRequest): Promise<Staff> {
    const response = await apiClient.post<Staff>('/staffs', data)
    return response.data
  },

  /**
   * Update a staff account
   * @param id - Staff account CUID
   * @param data - Updated staff account data
   * @returns Updated staff account
   */
  async updateStaff(id: string, data: UpdateStaffRequest): Promise<Staff> {
    const response = await apiClient.patch<Staff>(`/staffs/${id}`, data)
    return response.data
  },

  /**
   * Delete a staff account (soft delete)
   * @param id - Staff account CUID
   * @returns Success response
   */
  async deleteStaff(id: string): Promise<ApiSuccessResponse> {
    const response = await apiClient.delete<ApiSuccessResponse>(`/staffs/${id}`)
    return response.data
  },
}
