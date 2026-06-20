import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  testimonialService,
  type CreateTestimonialRequest,
  type TestimonialAdminQueryParams,
  type UpdateTestimonialRequest,
} from '@/api/services/testimonial.service'

export const testimonialKeys = {
  all: ['testimonials'] as const,
  lists: () => [...testimonialKeys.all, 'list'] as const,
  list: (params: TestimonialAdminQueryParams) =>
    [...testimonialKeys.lists(), params] as const,
  detail: (id: string) => [...testimonialKeys.all, 'detail', id] as const,
}

export function useTestimonialsAdmin(params: TestimonialAdminQueryParams = {}) {
  return useQuery({
    queryKey: testimonialKeys.list(params),
    queryFn: () => testimonialService.listAdmin(params),
    staleTime: 30_000,
  })
}

export function useCreateTestimonial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTestimonialRequest) =>
      testimonialService.create(data),
    onSuccess: () => {
      toast.success('Đã tạo nhận xét thành công')
      void qc.invalidateQueries({ queryKey: testimonialKeys.lists() })
    },
    onError: (e: Error) => toast.error(e.message || 'Không thể tạo nhận xét'),
  })
}

export function useUpdateTestimonial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Omit<UpdateTestimonialRequest, 'id'>
    }) => testimonialService.update(id, data),
    onSuccess: () => {
      toast.success('Đã cập nhật nhận xét thành công')
      void qc.invalidateQueries({ queryKey: testimonialKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Không thể cập nhật nhận xét'),
  })
}

export function useToggleTestimonialFeatured() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => testimonialService.toggleFeatured(id),
    onSuccess: () => {
      toast.success('Đã thay đổi trạng thái nổi bật thành công')
      void qc.invalidateQueries({ queryKey: testimonialKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Không thể thay đổi trạng thái nổi bật'),
  })
}

export function useDeleteTestimonial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => testimonialService.delete(id),
    onSuccess: () => {
      toast.success('Đã xóa nhận xét thành công')
      void qc.invalidateQueries({ queryKey: testimonialKeys.lists() })
    },
    onError: (e: Error) => toast.error(e.message || 'Không thể xóa nhận xét'),
  })
}
