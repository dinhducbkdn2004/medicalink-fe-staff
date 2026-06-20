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
      toast.success('Đã tạo câu hỏi thường gặp thành công')
      void qc.invalidateQueries({ queryKey: faqKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Không thể tạo câu hỏi thường gặp'),
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
      toast.success('Đã cập nhật câu hỏi thường gặp thành công')
      void qc.invalidateQueries({ queryKey: faqKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Không thể cập nhật câu hỏi thường gặp'),
  })
}

export function useToggleFaqActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => faqService.toggleActive(id),
    onSuccess: () => {
      toast.success('Đã thay đổi trạng thái hiển thị thành công')
      void qc.invalidateQueries({ queryKey: faqKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Không thể thay đổi trạng thái hiển thị'),
  })
}

export function useDeleteFaq() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => faqService.delete(id),
    onSuccess: () => {
      toast.success('Đã xóa câu hỏi thường gặp thành công')
      void qc.invalidateQueries({ queryKey: faqKeys.lists() })
    },
    onError: (e: Error) =>
      toast.error(e.message || 'Không thể xóa câu hỏi thường gặp'),
  })
}
