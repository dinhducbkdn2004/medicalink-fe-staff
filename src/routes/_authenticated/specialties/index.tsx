/**
 * Specialties Route
 * Route configuration for the specialties management page
 */
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Specialties } from '@/features/specialties'

// Search params validation schema
const specialtiesSearchSchema = z.object({
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

export const Route = createFileRoute('/_authenticated/specialties/')({
  validateSearch: specialtiesSearchSchema,
  component: Specialties,
})

