export type AppointmentStatus =
  | 'BOOKED'
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'CANCELLED_BY_PATIENT'
  | 'CANCELLED_BY_STAFF'
  | 'NO_SHOW'
  | 'COMPLETED'

export interface AppointmentPatient {
  fullName: string
  dateOfBirth: string | null
}

export interface AppointmentEvent {
  id: string
  serviceDate: string
  timeStart: string
  timeEnd: string
}

export interface AppointmentDoctor {
  id: string
  staffAccountId: string
  isActive: boolean
  avatarUrl: string | null
  name: string
}

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

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  hasNext: boolean
  hasPrev: boolean
  totalPages: number
}

export interface AppointmentListParams {
  page?: number
  limit?: number
  doctorId?: string
  workLocationId?: string
  specialtyId?: string
  patientId?: string
  fromDate?: string
  toDate?: string
  status?: AppointmentStatus
}

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

export interface CreateAppointmentRequest {
  specialtyId: string
  patientId: string
  doctorId: string
  locationId: string
  serviceDate: string
  timeStart: string
  timeEnd: string
  reason?: string
  notes?: string
  status?: AppointmentStatus
  priceAmount?: number
  currency?: string
}

export interface UpdateAppointmentRequest {
  status?: AppointmentStatus
  notes?: string
  priceAmount?: number
  reason?: string
}

export interface RescheduleAppointmentRequest {
  doctorId?: string
  locationId?: string
  serviceDate?: string
  timeStart?: string
  timeEnd?: string
}

export interface CancelAppointmentRequest {
  reason?: string
}

export interface AppointmentActionResponse {
  success: boolean
  message: string
  data: Appointment
}
