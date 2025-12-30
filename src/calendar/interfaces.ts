import type { AppointmentStatus } from '@/api/types'

export interface IAppointmentPatient {
  fullName: string
  dateOfBirth: string | null
}

export interface IAppointmentEvent {
  id: string
  serviceDate: string
  timeStart: string
  timeEnd: string
}

export interface IAppointmentDoctor {
  id: string
  staffAccountId: string
  isActive: boolean
  avatarUrl: string | null
  name: string
}

export interface IAppointmentSpecialty {
  id: string
  name: string
}

export interface IAppointmentLocation {
  id: string
  name: string
  address: string
}

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

export interface IUser {
  id: string
  name: string
  picturePath: string | null
}

export interface IEvent {
  id: string
  startDate: string
  endDate: string
  title: string
  color: import('./types').TEventColor
  description: string
  user: IUser
  appointment?: IAppointment
}
