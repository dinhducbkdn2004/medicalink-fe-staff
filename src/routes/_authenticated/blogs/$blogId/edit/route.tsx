import { createFileRoute } from '@tanstack/react-router'
import { BlogDetailsPage } from '@/features/blogs/pages/blog-details-page'

export const Route = createFileRoute('/_authenticated/blogs/$blogId/edit')({
  component: BlogDetailsPage,
})
