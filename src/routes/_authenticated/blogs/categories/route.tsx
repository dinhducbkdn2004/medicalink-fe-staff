import { createFileRoute } from '@tanstack/react-router'
import { BlogCategories } from '@/features/blogs'

export const Route = createFileRoute('/_authenticated/blogs/categories')({
  component: BlogCategories,
})
