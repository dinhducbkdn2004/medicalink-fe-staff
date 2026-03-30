import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  faqService,
  type CreateFaqRequest,
  type FaqAdminQueryParams,
  type UpdateFaqRequest,
} from '@/api/services/faq.service'

export const faqKeys = {
  all: ['faqs'] as const,
  lists: () => [...faqKeys.all, 'list'] as const,
  list: (params: FaqAdminQueryParams) => [...faqKeys.lists(), params] as const,
  detail: (id: string) => [...faqKeys.all, 'detail', id] as const,
}

export function useFaqsAdmin(params: FaqAdminQueryParams = {}) {
  return useQuery({
    queryKey: faqKeys.list(params),
    queryFn: () => faqService.listAdmin(params),
    staleTime: 30_000,
  })
}

export function useCreateFaq() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFaqRequest) => faqService.create(data),
    onSuccess: () => {
      toast.success('FAQ created successfully')
      void qc.invalidateQueries({ queryKey: faqKeys.lists() })
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to create FAQ'),
  })
}

export function useUpdateFaq() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Omit<UpdateFaqRequest, 'id'>
    }) => faqService.update(id, data),
    onSuccess: () => {
      toast.success('FAQ updated successfully')
      void qc.invalidateQueries({ queryKey: faqKeys.lists() })
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to update FAQ'),
  })
}

export function useToggleFaqActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => faqService.toggleActive(id),
    onSuccess: () => {
      toast.success('Display status changed successfully')
      void qc.invalidateQueries({ queryKey: faqKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Failed to change display status'),
  })
}

export function useDeleteFaq() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => faqService.delete(id),
    onSuccess: () => {
      toast.success('FAQ deleted successfully')
      void qc.invalidateQueries({ queryKey: faqKeys.lists() })
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to delete FAQ'),
  })
}
