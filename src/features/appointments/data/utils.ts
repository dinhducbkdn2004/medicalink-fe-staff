/**
 * Appointment Utilities
 * Helper functions for transforming and mapping appointment data
 */
import type { IEvent, IUser } from '@/calendar/interfaces'
import type { TEventColor } from '@/calendar/types'
import type { Appointment } from '@/api/types/appointment.types'

/**
 * Map appointment status to calendar event color
 */
export const getEventColorByStatus = (
  status: Appointment['status']
): TEventColor => {
  const statusColorMap: Record<Appointment['status'], TEventColor> = {
    BOOKED: 'blue',
    CONFIRMED: 'green',
    CANCELLED_BY_PATIENT: 'red',
    CANCELLED_BY_STAFF: 'red',
    COMPLETED: 'gray',
    NO_SHOW: 'orange',
    RESCHEDULED: 'blue',
  }
  return statusColorMap[status] || 'blue'
}

/**
 * Transform Appointment to IEvent for calendar display
 */
export const transformAppointmentToEvent = (
  appointment: Appointment
): IEvent => {
  const { event, doctor, patient, status, reason } = appointment

  // Combine service date with time
  // Combine service date with time
  const serviceDate = new Date(event.serviceDate)

  // Parse HH:mm time strings
  // Parse HH:mm time strings or ISO strings
  let startHour: number, startMinute: number
  let endHour: number, endMinute: number

  if (event.timeStart.includes('T')) {
    const timePart = event.timeStart.split('T')[1]
    ;[startHour, startMinute] = timePart.split(':').map(Number)
  } else {
    ;[startHour, startMinute] = event.timeStart.split(':').map(Number)
  }

  if (event.timeEnd.includes('T')) {
    const timePart = event.timeEnd.split('T')[1]
    ;[endHour, endMinute] = timePart.split(':').map(Number)
  } else {
    ;[endHour, endMinute] = event.timeEnd.split(':').map(Number)
  }

  // Create full datetime by combining date and time
  const startDate = new Date(serviceDate)
  startDate.setHours(startHour, startMinute, 0, 0)

  const endDate = new Date(serviceDate)
  endDate.setHours(endHour, endMinute, 0, 0)

  return {
    id: appointment.id,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    title: `${patient.fullName} - ${reason}`,
    color: getEventColorByStatus(status),
    description: `
Patient: ${patient.fullName}
Doctor: ${doctor.name}
Status: ${status}
Reason: ${reason}
${appointment.notes ? `Notes: ${appointment.notes}` : ''}
    `.trim(),
    user: {
      id: doctor.id,
      name: doctor.name,
      picturePath: doctor.avatarUrl,
    },
    appointment: {
      ...appointment,
      // Ensure nested objects match IAppointment interface if needed
      // The API Appointment type seems compatible with IAppointment for the most part
      // except maybe for some optional fields or date strings vs Date objects
      // But looking at interfaces.ts, IAppointment uses strings for dates, same as API
      // So we can just pass the appointment object
    } as unknown as import('@/calendar/interfaces').IAppointment,
  }
}

/**
 * Transform array of appointments to calendar events
 */
export const transformAppointmentsToEvents = (
  appointments: Appointment[]
): IEvent[] => {
  return appointments.map(transformAppointmentToEvent)
}

/**
 * Extract unique users (doctors) from appointments
 */
export const extractUsersFromAppointments = (
  appointments: Appointment[]
): IUser[] => {
  const uniqueDoctors = new Map<string, IUser>()

  for (const appointment of appointments) {
    const { doctor } = appointment
    if (!uniqueDoctors.has(doctor.id)) {
      uniqueDoctors.set(doctor.id, {
        id: doctor.id,
        name: doctor.name,
        picturePath: doctor.avatarUrl,
      })
    }
  }

  return Array.from(uniqueDoctors.values())
}

/**
 * Format date to YYYY-MM-DD for API queries
 * Uses local timezone to avoid date shifting issues
 */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Get date range for current view
 */
export const getDateRangeForView = (
  view: 'day' | 'week' | 'month' | 'year' | 'agenda',
  currentDate: Date
): { fromDate: string; toDate: string } => {
  const date = new Date(currentDate)
  let fromDate: Date
  let toDate: Date

  switch (view) {
    case 'day':
      fromDate = new Date(date)
      toDate = new Date(date)
      break

    case 'week': {
      // Get start of week (Sunday)
      fromDate = new Date(date)
      fromDate.setDate(date.getDate() - date.getDay())
      // Get end of week (Saturday)
      toDate = new Date(fromDate)
      toDate.setDate(fromDate.getDate() + 6)
      break
    }

    case 'month': {
      // Get first day of month
      fromDate = new Date(date.getFullYear(), date.getMonth(), 1)
      // Get last day of month
      toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      break
    }

    case 'year': {
      // Get first day of year
      fromDate = new Date(date.getFullYear(), 0, 1)
      // Get last day of year
      toDate = new Date(date.getFullYear(), 11, 31)
      break
    }

    case 'agenda':
    default:
      // For agenda, show next 30 days
      fromDate = new Date(date)
      toDate = new Date(date)
      toDate.setDate(date.getDate() + 30)
      break
  }

  return {
    fromDate: formatDateForAPI(fromDate),
    toDate: formatDateForAPI(toDate),
  }
}
