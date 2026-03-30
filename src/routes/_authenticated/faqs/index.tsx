import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { FaqsManagement } from '@/features/faqs'

const faqsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  isActive: z.string().optional().catch(''),
  sortBy: z.string().optional().catch(''),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('asc'),
})

export const Route = createFileRoute('/_authenticated/faqs/')({
  validateSearch: faqsSearchSchema,
  component: FaqsManagement,
})
