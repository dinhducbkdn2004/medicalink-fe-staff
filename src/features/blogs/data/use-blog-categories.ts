import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { blogService } from '@/api/services'
import type {
  BlogCategoryQueryParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/api/services/blog.service'

export const blogKeys = {
  all: ['blogs'] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  categoryList: (params: BlogCategoryQueryParams) =>
    [...blogKeys.categories(), 'list', params] as const,
}

export function useBlogCategories(params: BlogCategoryQueryParams = {}) {
  return useQuery({
    queryKey: blogKeys.categoryList(params),
    queryFn: () => blogService.getAllCategories(params),
  })
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      blogService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() })
      toast.success('Category created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category')
    },
  })
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      blogService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() })
      toast.success('Category updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category')
    },
  })
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blogService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.categories() })
      toast.success('Category deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category')
    },
  })
}
