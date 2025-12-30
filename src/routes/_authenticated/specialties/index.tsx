
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Specialties } from '@/features/specialties'

const specialtiesSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  isActive: z.string().optional().catch(''),
  sortBy: z.string().optional().catch(''),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('asc'),
})

export const Route = createFileRoute('/_authenticated/specialties/')({
  validateSearch: specialtiesSearchSchema,
  component: Specialties,
})

