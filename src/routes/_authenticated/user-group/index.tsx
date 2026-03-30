import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { UserGroup } from '@/features/permissions/user-group'

const userGroupSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  email: z.string().optional().catch(''),
  role: z.string().optional().catch(''),
  sortBy: z.string().optional().catch(''),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/user-group/')({
  validateSearch: userGroupSearchSchema,
  component: UserGroup,
})
