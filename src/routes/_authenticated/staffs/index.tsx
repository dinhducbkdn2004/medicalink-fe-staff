import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Staffs } from '@/features/staffs'

const staffsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  email: z.string().optional().catch(''),
  role: z.string().optional().catch(''),
  isMale: z.string().optional().catch(''),
  createdFrom: z.string().optional().catch(''),
  createdTo: z.string().optional().catch(''),
  sortBy: z.string().optional().catch(''),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/staffs/')({
  validateSearch: staffsSearchSchema,
  component: Staffs,
})
