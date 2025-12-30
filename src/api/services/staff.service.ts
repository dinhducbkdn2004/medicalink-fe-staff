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

export const staffService = {
  async getStaffs(params?: StaffQueryParams): Promise<StaffListResponse> {
    const response = await apiClient.get<StaffListResponse>('/staffs', {
      params,
    })
    return response.data
  },

  async getStaffStats(): Promise<StaffStats> {
    const response = await apiClient.get<StaffStats>('/staffs/stats')
    return response.data
  },

  async getStaffById(id: string): Promise<Staff> {
    const response = await apiClient.get<Staff>(`/staffs/${id}`)
    return response.data
  },

  async createStaff(data: CreateStaffRequest): Promise<Staff> {
    const response = await apiClient.post<Staff>('/staffs', data)
    return response.data
  },

  async updateStaff(id: string, data: UpdateStaffRequest): Promise<Staff> {
    const response = await apiClient.patch<Staff>(`/staffs/${id}`, data)
    return response.data
  },

  async deleteStaff(id: string): Promise<ApiSuccessResponse> {
    const response = await apiClient.delete<ApiSuccessResponse>(`/staffs/${id}`)
    return response.data
  },
}
