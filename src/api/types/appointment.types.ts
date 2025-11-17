/**
 * Appointment Types
 * Type definitions for appointment-related API calls
 */

/**
 * Appointment Status
 * Based on API documentation
 */
export type AppointmentStatus =
  | 'BOOKED'
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'CANCELLED_BY_PATIENT'
  | 'CANCELLED_BY_STAFF'
  | 'NO_SHOW'
  | 'COMPLETED'

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

/**
 * Create Appointment Request
 * All fields required for creating a new appointment
 */
export interface CreateAppointmentRequest {
  specialtyId: string // Valid CUID
  patientId: string // Valid CUID
  doctorId: string // Valid CUID
  locationId: string // Valid CUID
  serviceDate: string // Date string (YYYY-MM-DD)
  timeStart: string // Time string (HH:mm)
  timeEnd: string // Time string (HH:mm)
  reason?: string // Optional, max 255 characters
  notes?: string // Optional text
  status?: AppointmentStatus // Optional, default: BOOKED
  priceAmount?: number // Optional decimal
  currency?: string // Optional, max 3 chars, default: VND
}

/**
 * Update Appointment Request
 * All fields optional for partial updates
 */
export interface UpdateAppointmentRequest {
  status?: AppointmentStatus
  notes?: string
  priceAmount?: number
  reason?: string
}

/**
 * Reschedule Appointment Request
 */
export interface RescheduleAppointmentRequest {
  doctorId?: string // Valid CUID
  locationId?: string // Valid CUID
  serviceDate?: string // Date string (YYYY-MM-DD)
  timeStart?: string // Time string (HH:mm)
  timeEnd?: string // Time string (HH:mm)
  autoconfirm?: boolean // Auto-confirm after reschedule
}

/**
 * Cancel Appointment Request
 */
export interface CancelAppointmentRequest {
  reason?: string // Cancellation reason
}

/**
 * Appointment Action Response
 * Response for confirm, complete, cancel actions
 */
export interface AppointmentActionResponse {
  success: boolean
  message: string
  data: Appointment
}
