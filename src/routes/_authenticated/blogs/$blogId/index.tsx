import { createFileRoute } from '@tanstack/react-router'
import { BlogViewPage } from '@/features/blogs/pages/blog-view-page'

export const Route = createFileRoute('/_authenticated/blogs/$blogId/')({
  component: BlogViewPage,
})
