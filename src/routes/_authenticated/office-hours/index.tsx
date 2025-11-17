/**
 * Office Hours Route
 * Route configuration for the office hours management page
 */
import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { OfficeHours } from '@/features/office-hours'

// Search params validation schema
const officeHoursSearchSchema = z.object({
  // Filters
  doctorId: z.string().optional().catch(''),
  workLocationId: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/office-hours/')({
  validateSearch: officeHoursSearchSchema,
  component: OfficeHours,
})
