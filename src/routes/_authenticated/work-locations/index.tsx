/**
 * Work Locations Route
 * Route configuration for the work locations management page
 */
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { WorkLocations } from '@/features/work-locations'

// Search params validation schema
const workLocationsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Per-column text filter for search
  search: z.string().optional().catch(''),
  // Facet filters
  isActive: z.string().optional().catch(''),
  // Sorting
  sortBy: z.string().optional().catch(''),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('asc'),
})

export const Route = createFileRoute('/_authenticated/work-locations/')({
  validateSearch: workLocationsSearchSchema,
  component: WorkLocations,
})

