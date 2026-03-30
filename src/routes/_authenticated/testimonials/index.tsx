import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { TestimonialsManagement } from '@/features/testimonials'

const testimonialsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  isFeatured: z.string().optional().catch(''),
  sortBy: z.string().optional().catch(''),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('asc'),
})

export const Route = createFileRoute('/_authenticated/testimonials/')({
  validateSearch: testimonialsSearchSchema,
  component: TestimonialsManagement,
})
