import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Patients } from '@/features/patients'

const patientsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Per-column text filter for search (fullName, email, phone)
  search: z.string().optional().catch(''),
  // Facet filters
  isMale: z.string().optional().catch(''),
  includedDeleted: z.boolean().optional().catch(false),
  // Sorting
  sortBy: z
    .enum(['dateOfBirth', 'createdAt', 'updatedAt'])
    .optional()
    .catch('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/patients/')({
  validateSearch: patientsSearchSchema,
  component: Patients,
})
