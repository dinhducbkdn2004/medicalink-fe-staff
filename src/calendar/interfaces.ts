import type { AppointmentStatus } from '@/api/types'

/**
 * Patient Info in Appointment
 */
export interface IAppointmentPatient {
  fullName: string
  dateOfBirth: string
}

/**
 * Event Info in Appointment
 */
export interface IAppointmentEvent {
  id: string
  serviceDate: string
  timeStart: string
  timeEnd: string
}

/**
 * Doctor Info in Appointment
 */
export interface IAppointmentDoctor {
  id: string
  staffAccountId: string
  isActive: boolean
  avatarUrl: string | null
  name: string
}

/**
 * Specialty Info in Appointment
 */
export interface IAppointmentSpecialty {
  id: string
  name: string
}

/**
 * Location Info in Appointment
 */
export interface IAppointmentLocation {
  id: string
  name: string
  address: string
}

/**
 * Appointment Data Model
 */
export interface IAppointment {
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
  patient: IAppointmentPatient
  event: IAppointmentEvent
  doctor: IAppointmentDoctor
  specialty?: IAppointmentSpecialty
  location?: IAppointmentLocation
}

export interface ICalendarCell {
  day: number
  currentMonth: boolean
  date: Date
}
