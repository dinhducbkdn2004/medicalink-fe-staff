import type { IEvent, IUser } from '@/calendar/interfaces'
import type { TEventColor } from '@/calendar/types'
import type { Appointment } from '@/api/types/appointment.types'

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
    RESCHEDULED: 'purple',
  }
  return statusColorMap[status] || 'blue'
}

export const transformAppointmentToEvent = (
  appointment: Appointment
): IEvent => {
  const { event, doctor, patient, status, reason } = appointment

  const serviceDate = new Date(event.serviceDate)

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
Doctor: ${doctor?.name || 'Deleted Doctor'}
Status: ${status}
Reason: ${reason}
${appointment.notes ? `Notes: ${appointment.notes}` : ''}
    `.trim(),
    user: doctor
      ? {
          id: doctor.id,
          name: doctor.name,
          picturePath: doctor.avatarUrl,
        }
      : {
          id: 'deleted-doctor',
          name: 'Deleted Doctor',
          picturePath: null,
        },
    appointment: {
      ...appointment,
    } as unknown as import('@/calendar/interfaces').IAppointment,
  }
}

export const transformAppointmentsToEvents = (
  appointments: Appointment[]
): IEvent[] => {
  return appointments.map(transformAppointmentToEvent)
}

export const extractUsersFromAppointments = (
  appointments: Appointment[]
): IUser[] => {
  const uniqueDoctors = new Map<string, IUser>()

  for (const appointment of appointments) {
    const { doctor } = appointment

    if (doctor && !uniqueDoctors.has(doctor.id)) {
      uniqueDoctors.set(doctor.id, {
        id: doctor.id,
        name: doctor.name,
        picturePath: doctor.avatarUrl,
      })
    }
  }

  return Array.from(uniqueDoctors.values())
}

export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

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
      fromDate = new Date(date)
      fromDate.setDate(date.getDate() - date.getDay())

      toDate = new Date(fromDate)
      toDate.setDate(fromDate.getDate() + 6)
      break
    }

    case 'month': {
      fromDate = new Date(date.getFullYear(), date.getMonth(), 1)

      toDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      break
    }

    case 'year': {
      fromDate = new Date(date.getFullYear(), 0, 1)

      toDate = new Date(date.getFullYear(), 11, 31)
      break
    }

    case 'agenda':
    default:
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
