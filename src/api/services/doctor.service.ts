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

export const doctorService = {
  async getDoctors(params?: DoctorQueryParams): Promise<DoctorListResponse> {
    const response = await apiClient.get<DoctorListResponse>('/doctors', {
      params,
    })
    return response.data
  },

  async searchCompleteDoctors(
    params?: DoctorQueryParams
  ): Promise<DoctorListResponse> {
    const response = await apiClient.get<DoctorListResponse>(
      '/doctors/search/complete',
      { params }
    )
    return response.data
  },

  async getDoctorById(id: string): Promise<DoctorAccount> {
    const response = await apiClient.get<DoctorAccount>(`/doctors/${id}`)
    return response.data
  },

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

  async createDoctor(data: CreateDoctorRequest): Promise<CreateDoctorResponse> {
    const response = await apiClient.post<CreateDoctorResponse>(
      '/doctors',
      data
    )
    return response.data
  },

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

  async deleteDoctor(id: string): Promise<DoctorAccount> {
    const response = await apiClient.delete<DoctorAccount>(`/doctors/${id}`)
    return response.data
  },

  async getProfileMe(): Promise<CompleteDoctorData> {
    const response = await apiClient.get<CompleteDoctorData>(
      '/doctors/profile/me'
    )
    return response.data
  },
}
