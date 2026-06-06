import { z } from 'zod'

export const clinicExceptionSchema = z.object({
  id: z.string().uuid(),
  workLocationId: z.string().uuid().nullable().optional(),
  date: z.string(),
  isFullDay: z.boolean(),
  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),
  reason: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  workLocation: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
})

export type ClinicException = z.infer<typeof clinicExceptionSchema>

export const clinicExceptionFormSchema = z
  .object({
    workLocationId: z.string().nullable().optional(),
    date: z.string().min(1, 'Date is required'),
    isFullDay: z.boolean().default(false),
    startTime: z.string().nullable().optional(),
    endTime: z.string().nullable().optional(),
    reason: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (!data.isFullDay) {
        return !!data.startTime && !!data.endTime
      }
      return true
    },
    {
      message: 'Start time and end time are required for partial day holidays',
      path: ['startTime'],
    }
  )
  .refine(
    (data) => {
      if (!data.isFullDay && data.startTime && data.endTime) {
        return data.startTime < data.endTime
      }
      return true
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )

export type ClinicExceptionFormValues = z.infer<
  typeof clinicExceptionFormSchema
>
