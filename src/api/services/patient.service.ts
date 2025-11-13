import { apiClient } from '../core/client'
import type {
  Patient,
  PatientQueryParams,
  PatientListResponse,
  CreatePatientRequest,
  UpdatePatientRequest,
} from '../types/patient.types'

/**
 * Patient API Service
 * Manages patient records including personal information, contact details, and address
 */
export const patientService = {
  /**
   * Get paginated list of all patients
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated list of patients
   */
  async getPatients(params?: PatientQueryParams): Promise<PatientListResponse> {
    const response = await apiClient.get<PatientListResponse>('/patients', {
      params,
    })
    return response.data
  },

  /**
   * Get a single patient by ID
   * Requires permission: patients:read
   * @param id - Patient CUID
   * @returns Patient details
   */
  async getPatientById(id: string): Promise<Patient> {
    const response = await apiClient.get<Patient>(`/patients/${id}`)
    return response.data
  },

  /**
   * Create a new patient record
   * @param data - Patient data
   * @returns Created patient
   */
  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    const response = await apiClient.post<Patient>('/patients', data)
    return response.data
  },

  /**
   * Update a patient record
   * Requires permission: patients:update
   * @param id - Patient CUID
   * @param data - Updated patient data
   * @returns Updated patient
   */
  async updatePatient(
    id: string,
    data: UpdatePatientRequest
  ): Promise<Patient> {
    const response = await apiClient.patch<Patient>(`/patients/${id}`, data)
    return response.data
  },

  /**
   * Soft delete a patient record
   * Requires permission: patients:delete
   * @param id - Patient CUID
   * @returns Deleted patient (with deletedAt timestamp)
   */
  async deletePatient(id: string): Promise<Patient> {
    const response = await apiClient.delete<Patient>(`/patients/${id}`)
    return response.data
  },

  /**
   * Restore a soft-deleted patient record
   * Requires permission: patients:update
   * @param id - Patient CUID
   * @returns Restored patient
   */
  async restorePatient(id: string): Promise<Patient> {
    const response = await apiClient.patch<Patient>(`/patients/${id}/restore`)
    return response.data
  },
}
