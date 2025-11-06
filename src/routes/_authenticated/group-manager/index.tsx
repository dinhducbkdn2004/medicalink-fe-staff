import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { GroupManager } from '@/features/permissions/group-manager'

const groupManagerSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  isActive: z.string().optional().catch(''),
  sortBy: z.string().optional().catch(''),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/group-manager/')({
  validateSearch: groupManagerSearchSchema,
  component: GroupManager,
})
