/**
 * Appointment Types
 * Type definitions for appointment-related API calls
 */

/**
 * Appointment Status
 */
export type AppointmentStatus =
  | 'BOOKED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'

/**
 * Patient Info in Appointment
 */
export interface AppointmentPatient {
  fullName: string
  dateOfBirth: string
}

/**
 * Event Info in Appointment
 */
export interface AppointmentEvent {
  id: string
  serviceDate: string
  timeStart: string
  timeEnd: string
}

/**
 * Doctor Info in Appointment
 */
export interface AppointmentDoctor {
  id: string
  staffAccountId: string
  isActive: boolean
  avatarUrl: string | null
  name: string
}

/**
 * Appointment Data Model
 */
export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  locationId: string
  eventId: string
  specialtyId: string
  status: AppointmentStatus
  reason: string
  notes: string | null
  priceAmount: number | null
  currency: string
  createdAt: string
  updatedAt: string
  cancelledAt: string | null
  completedAt: string | null
  patient: AppointmentPatient
  event: AppointmentEvent
  doctor: AppointmentDoctor
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  hasNext: boolean
  hasPrev: boolean
  totalPages: number
}

/**
 * Query Parameters for Appointment List
 */
export interface AppointmentListParams {
  page?: number
  limit?: number
  doctorId?: string
  workLocationId?: string
  specialtyId?: string
  patientId?: string
  fromDate?: string // YYYY-MM-DD
  toDate?: string // YYYY-MM-DD
  status?: AppointmentStatus
}

/**
 * Appointment List API Response
 */
export interface AppointmentListResponse {
  success: boolean
  message: string
  data: Appointment[]
  timestamp: string
  path: string
  method: string
  statusCode: number
  meta: PaginationMeta
}
