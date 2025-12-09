import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { blogService } from '@/api/services'
import type {
  BlogQueryParams,
  CreateBlogRequest,
  UpdateBlogRequest,
  BlogStatus,
} from '@/api/services/blog.service'
import { blogKeys } from './use-blog-categories'

// Extend base keys
export const blogPostKeys = {
  ...blogKeys,
  posts: () => [...blogKeys.all, 'posts'] as const,
  postList: (params: BlogQueryParams) =>
    [...blogPostKeys.posts(), 'list', params] as const,
  post: (id: string) => [...blogPostKeys.posts(), 'detail', id] as const,
}

export function useBlogs(params: BlogQueryParams = {}) {
  return useQuery({
    queryKey: blogPostKeys.postList(params),
    queryFn: () => blogService.getAllBlogs(params),
  })
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: blogPostKeys.post(id),
    queryFn: () => blogService.getBlog(id),
    enabled: !!id,
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBlogRequest) => blogService.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogPostKeys.posts() })
      toast.success('Blog post created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create blog post')
    },
  })
}

export function useUpdateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogRequest }) =>
      blogService.updateBlog(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogPostKeys.posts() })
      queryClient.invalidateQueries({
        queryKey: blogPostKeys.post(variables.id),
      })
      toast.success('Blog post updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update blog post')
    },
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogPostKeys.posts() })
      toast.success('Blog post deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete blog post')
    },
  })
}

export function usePublishBlog() {
  const { mutateAsync: updateBlog } = useUpdateBlog()

  return (id: string, status: BlogStatus) =>
    updateBlog({ id, data: { status } })
}
