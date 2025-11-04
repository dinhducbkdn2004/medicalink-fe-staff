import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Doctors } from '@/features/doctors'

const doctorsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Per-column text filter for search (fullName and email)
  search: z.string().optional().catch(''),
  // Facet filters
  isActive: z.string().optional().catch(''),
  isMale: z.string().optional().catch(''),
  // Date range filters
  createdFrom: z.string().optional().catch(''),
  createdTo: z.string().optional().catch(''),
  // Sorting
  sortBy: z.string().optional().catch(''),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/doctors/')({
  validateSearch: doctorsSearchSchema,
  component: Doctors,
})
