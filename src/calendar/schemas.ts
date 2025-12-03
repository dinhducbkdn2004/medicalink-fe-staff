import { z } from 'zod'

/**
 * Appointment Status Schema
 */
export const appointmentStatusSchema = z.enum([
  'BOOKED',
  'CONFIRMED',
  'RESCHEDULED',
  'CANCELLED_BY_PATIENT',
  'CANCELLED_BY_STAFF',
  'NO_SHOW',
  'COMPLETED',
])

/**
 * Create Appointment Schema
 * Based on POST /api/appointments endpoint
 */
export const createAppointmentSchema = z
  .object({
    specialtyId: z.string().min(1, 'Specialty is required'),
    patientId: z.string().min(1, 'Patient is required'),
    doctorId: z.string().min(1, 'Doctor is required'),
    locationId: z.string().min(1, 'Location is required'),
    serviceDate: z.date({ required_error: 'Service date is required' }),
    timeStart: z.object(
      { hour: z.number(), minute: z.number() },
      { required_error: 'Start time is required' }
    ),
    timeEnd: z.object(
      { hour: z.number(), minute: z.number() },
      { required_error: 'End time is required' }
    ),
    reason: z
      .string()
      .min(1, 'Reason is required')
      .max(255, 'Reason must be less than 255 characters'),
    notes: z.string().optional(),
    status: appointmentStatusSchema.optional(),
    priceAmount: z.number().optional(),
    currency: z.string().max(3).optional(),
  })
  .refine(
    (data) => {
      const startDateTime = new Date(data.serviceDate)
      startDateTime.setHours(data.timeStart.hour, data.timeStart.minute, 0, 0)

      const endDateTime = new Date(data.serviceDate)
      endDateTime.setHours(data.timeEnd.hour, data.timeEnd.minute, 0, 0)

      return startDateTime < endDateTime
    },
    {
      message: 'Start time must be before end time',
      path: ['timeStart'],
    }
  )

/**
 * Update Appointment Schema
 * Based on PATCH /api/appointments/:id endpoint
 */
export const updateAppointmentSchema = z.object({
  status: appointmentStatusSchema.optional(),
  notes: z.string().optional(),
  priceAmount: z.number().optional(),
  reason: z
    .string()
    .max(255, 'Reason must be less than 255 characters')
    .optional(),
})

/**
 * Reschedule Appointment Schema
 * Based on PATCH /api/appointments/:id/reschedule endpoint
 */
export const rescheduleAppointmentSchema = z
  .object({
    doctorId: z.string().optional(),
    locationId: z.string().optional(),
    serviceDate: z.date().optional(),
    timeStart: z.object({ hour: z.number(), minute: z.number() }).optional(),
    timeEnd: z.object({ hour: z.number(), minute: z.number() }).optional(),
    autoconfirm: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.serviceDate && data.timeStart && data.timeEnd) {
        const startDateTime = new Date(data.serviceDate)
        startDateTime.setHours(data.timeStart.hour, data.timeStart.minute, 0, 0)

        const endDateTime = new Date(data.serviceDate)
        endDateTime.setHours(data.timeEnd.hour, data.timeEnd.minute, 0, 0)

        return startDateTime < endDateTime
      }
      return true
    },
    {
      message: 'Start time must be before end time',
      path: ['timeStart'],
    }
  )

/**
 * Cancel Appointment Schema
 * Based on DELETE /api/appointments/:id endpoint
 */
export const cancelAppointmentSchema = z.object({
  reason: z.string().optional(),
})

export type TCreateAppointmentFormData = z.infer<typeof createAppointmentSchema>
export type TUpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>
export type TRescheduleAppointmentFormData = z.infer<
  typeof rescheduleAppointmentSchema
>
export type TCancelAppointmentFormData = z.infer<typeof cancelAppointmentSchema>
