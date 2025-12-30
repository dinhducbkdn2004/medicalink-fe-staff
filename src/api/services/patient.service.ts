import { apiClient } from '../core/client'
import type {
  Patient,
  PatientQueryParams,
  PatientListResponse,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '../types/patient.types'

export const patientService = {
  async getPatients(params?: PatientQueryParams): Promise<PatientListResponse> {
    const response = await apiClient.get<PatientListResponse>('/patients', {
      params,
    })
    return response.data
  },

  async getPatientById(id: string): Promise<Patient> {
    const response = await apiClient.get<Patient>(`/patients/${id}`)
    return response.data
  },

  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    const response = await apiClient.post<Patient>('/patients', data)
    return response.data
  },

  async updatePatient(
    id: string,
    data: UpdatePatientRequest
  ): Promise<Patient> {
    const response = await apiClient.patch<Patient>(`/patients/${id}`, data)
    return response.data
  },

  async deletePatient(id: string): Promise<Patient> {
    const response = await apiClient.delete<Patient>(`/patients/${id}`)
    return response.data
  },

  async restorePatient(id: string): Promise<Patient> {
    const response = await apiClient.patch<Patient>(`/patients/${id}/restore`)
    return response.data
  },
}
