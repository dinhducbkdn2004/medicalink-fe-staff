import { z } from 'zod'

export const specialShiftSchema = z.object({
  id: z.string().uuid(),
  doctorId: z.string().uuid(),
  workLocationId: z.string().uuid().nullable().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  reason: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  doctor: z
    .object({
      id: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      specialtyName: z.string().optional(),
    })
    .optional(),
  workLocation: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
})

export type SpecialShift = z.infer<typeof specialShiftSchema>

export const specialShiftFormSchema = z
  .object({
    doctorIds: z.array(z.string()).min(1, 'Please select at least one doctor'),
    workLocationId: z.string().nullable().optional(),
    date: z.string().min(1, 'Date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    reason: z.string().nullable().optional(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  })

export type SpecialShiftFormValues = z.infer<typeof specialShiftFormSchema>
