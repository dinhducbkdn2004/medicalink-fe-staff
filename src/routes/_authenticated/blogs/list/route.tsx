import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BlogsPage } from '@/features/blogs/pages/blogs-page'

const blogsSearchSchema = z.object({
  categoryId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/blogs/list')({
  validateSearch: (search) => blogsSearchSchema.parse(search),
  component: BlogsPage,
})
