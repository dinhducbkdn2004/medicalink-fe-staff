/**
 * Appointment Form Schemas
 * Zod schemas for appointment form validation
 */
import { z } from 'zod'

/**
 * Schema for creating a new appointment
 */
export const createAppointmentSchema = z
  .object({
    specialtyId: z.string().min(1, 'Specialty is required'),
    patientId: z.string().min(1, 'Patient is required'),
    doctorId: z.string().min(1, 'Doctor is required'),
    locationId: z.string().min(1, 'Location is required'),
    serviceDate: z.date({ message: 'Service date is required' }),
    timeStart: z.object(
      { hour: z.number(), minute: z.number() },
      { message: 'Start time is required' }
    ),
    timeEnd: z.object(
      { hour: z.number(), minute: z.number() },
      { message: 'End time is required' }
    ),
    reason: z
      .string()
      .max(255, 'Reason cannot exceed 255 characters')
      .optional(),
    notes: z.string().optional(),
    priceAmount: z.number().min(0, 'Price cannot be negative').optional(),
    currency: z.string().max(3).optional(),
  })
  .refine(
    (data) => {
      const startMinutes = data.timeStart.hour * 60 + data.timeStart.minute
      const endMinutes = data.timeEnd.hour * 60 + data.timeEnd.minute
      return startMinutes < endMinutes
    },
    {
      message: 'Start time must be before end time',
      path: ['timeStart'],
    }
  )

export type CreateAppointmentFormData = z.infer<typeof createAppointmentSchema>

/**
 * Schema for updating an appointment
 */
export const updateAppointmentSchema = z.object({
  status: z
    .enum([
      'BOOKED',
      'CONFIRMED',
      'RESCHEDULED',
      'CANCELLED_BY_PATIENT',
      'CANCELLED_BY_STAFF',
      'NO_SHOW',
      'COMPLETED',
    ])
    .optional(),
  notes: z.string().optional(),
  priceAmount: z.number().min(0, 'Price cannot be negative').optional(),
  reason: z.string().max(255, 'Reason cannot exceed 255 characters').optional(),
})

export type UpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>

/**
 * Schema for rescheduling an appointment
 */
export const rescheduleAppointmentSchema = z
  .object({
    doctorId: z.string().optional(),
    locationId: z.string().optional(),
    serviceDate: z.date().optional(),
    timeStart: z
      .object({
        hour: z.number(),
        minute: z.number(),
      })
      .optional(),
    timeEnd: z
      .object({
        hour: z.number(),
        minute: z.number(),
      })
      .optional(),
    autoconfirm: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // Only validate times if both are provided
      if (data.timeStart && data.timeEnd) {
        const startMinutes = data.timeStart.hour * 60 + data.timeStart.minute
        const endMinutes = data.timeEnd.hour * 60 + data.timeEnd.minute
        return startMinutes < endMinutes
      }
      return true
    },
    {
      message: 'Start time must be before end time',
      path: ['timeStart'],
    }
  )

export type RescheduleAppointmentFormData = z.infer<
  typeof rescheduleAppointmentSchema
>

/**
 * Schema for cancelling an appointment
 */
export const cancelAppointmentSchema = z.object({
  reason: z.string().optional(),
})

export type CancelAppointmentFormData = z.infer<typeof cancelAppointmentSchema>
