
import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { OfficeHours } from '@/features/office-hours'

const officeHoursSearchSchema = z.object({
  doctorId: z.string().optional().catch(''),
  workLocationId: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/office-hours/')({
  validateSearch: officeHoursSearchSchema,
  component: OfficeHours,
})
