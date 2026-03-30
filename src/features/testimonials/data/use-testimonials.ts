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
      toast.success('Testimonial created successfully')
      void qc.invalidateQueries({ queryKey: testimonialKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Failed to create testimonial'),
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
      toast.success('Testimonial updated successfully')
      void qc.invalidateQueries({ queryKey: testimonialKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Failed to update testimonial'),
  })
}

export function useToggleTestimonialFeatured() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => testimonialService.toggleFeatured(id),
    onSuccess: () => {
      toast.success('Featured status changed successfully')
      void qc.invalidateQueries({ queryKey: testimonialKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Failed to change featured status'),
  })
}

export function useDeleteTestimonial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => testimonialService.delete(id),
    onSuccess: () => {
      toast.success('Testimonial deleted successfully')
      void qc.invalidateQueries({ queryKey: testimonialKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Failed to delete testimonial'),
  })
}
