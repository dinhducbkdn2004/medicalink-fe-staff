
import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Questions } from '@/features/questions/exports'

const questionsSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  pageSize: z.number().int().positive().max(100).catch(10),
  search: z.string().optional(),
  status: z.enum(['PENDING', 'ANSWERED', 'CLOSED']).optional().catch(undefined),
  authorEmail: z.string().optional(),
  specialtyId: z.string().optional(),
  sortBy: z.enum(['createdAt', 'viewCount', 'answerCount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().catch('desc'),
})

export const Route = createFileRoute('/_authenticated/questions/')({
  component: Questions,
  validateSearch: (search) => questionsSearchSchema.parse(search),
})
