
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { WorkLocations } from '@/features/work-locations'

const workLocationsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  isActive: z.string().optional().catch(''),
  sortBy: z.string().optional().catch(''),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('asc'),
})

export const Route = createFileRoute('/_authenticated/work-locations/')({
  validateSearch: workLocationsSearchSchema,
  component: WorkLocations,
})

