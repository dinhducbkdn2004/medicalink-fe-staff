import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Patients } from '@/features/patients'

const patientsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  isMale: z.string().optional().catch(''),
  includedDeleted: z.boolean().optional().catch(false),
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
