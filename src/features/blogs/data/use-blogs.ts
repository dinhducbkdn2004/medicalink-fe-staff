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
      toast.success('Đã tạo bài viết thành công')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể tạo bài viết')
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
      toast.success('Đã cập nhật bài viết thành công')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể cập nhật bài viết')
    },
  })
}

export function useUpdateBlogAsDoctor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Pick<UpdateBlogRequest, 'title' | 'content'>
    }) => blogService.updateBlogAsDoctor(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogPostKeys.posts() })
      queryClient.invalidateQueries({
        queryKey: blogPostKeys.post(variables.id),
      })
      toast.success('Đã cập nhật bài viết thành công')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể cập nhật bài viết')
    },
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogPostKeys.posts() })
      toast.success('Đã xóa bài viết thành công')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể xóa bài viết')
    },
  })
}

export function usePublishBlog() {
  const { mutateAsync: updateBlog } = useUpdateBlog()

  return (id: string, status: BlogStatus) =>
    updateBlog({ id, data: { status } })
}
