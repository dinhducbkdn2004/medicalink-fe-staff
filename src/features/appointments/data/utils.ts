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
    CANCELLED: 'red',
    COMPLETED: 'gray',
    NO_SHOW: 'orange',
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
  const serviceDate = new Date(event.serviceDate)
  const startTime = new Date(event.timeStart)
  const endTime = new Date(event.timeEnd)

  // Create full datetime by combining date and time
  const startDate = new Date(serviceDate)
  startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0)

  const endDate = new Date(serviceDate)
  endDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0)

  return {
    id: Number.parseInt(appointment.id.slice(-8), 16), // Convert string ID to number for calendar
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
 */
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]
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
