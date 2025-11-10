/**
 * Reviews Route
 * Route configuration for /reviews
 */
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Reviews } from '@/features/reviews/exports'

// ============================================================================
// Search Params Schema
// ============================================================================

const reviewsSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  pageSize: z.number().int().positive().max(100).catch(10),
  search: z.string().optional(),
  status: z
    .enum(['PENDING', 'APPROVED', 'REJECTED'])
    .optional()
    .catch(undefined),
  rating: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .catch(undefined),
  sortBy: z.enum(['createdAt', 'rating', 'helpfulCount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('desc'),
})

// ============================================================================
// Route
// ============================================================================

export const Route = createFileRoute('/_authenticated/reviews/')({
  component: Reviews,
  validateSearch: (search) => reviewsSearchSchema.parse(search),
})

