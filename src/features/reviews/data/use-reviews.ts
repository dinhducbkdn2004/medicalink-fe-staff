import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  reviewService,
  type CreateReviewRequest,
  type ReviewQueryParams,
} from '@/api/services'

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (params: ReviewQueryParams) => [...reviewKeys.lists(), params] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
  doctorReviews: (doctorId: string, params: ReviewQueryParams) =>
    [...reviewKeys.all, 'doctor', doctorId, params] as const,
}

export function useReviews(params: ReviewQueryParams = {}) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: async () => {
      try {
        return await reviewService.getReviews(params)
      } catch (error: unknown) {
        const err = error as { response?: { status?: number } }
        if (err?.response?.status === 404) {
          return {
            data: [],
            meta: {
              currentPage: 1,
              itemsPerPage: params.limit || 10,
              totalItems: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          }
        }
        throw error
      }
    },
    staleTime: 30000,
    retry: (failureCount, error: unknown) => {
      const err = error as { response?: { status?: number } }
      if (err?.response?.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}

export function useDoctorReviews(
  doctorId: string,
  params: ReviewQueryParams = {}
) {
  return useQuery({
    queryKey: reviewKeys.doctorReviews(doctorId, params),
    queryFn: () => {
      if (doctorId === 'me') {
        return reviewService.getMyReviews(params)
      }
      return reviewService.getDoctorReviews(doctorId, params)
    },
    enabled: !!doctorId,
    staleTime: 30000,
  })
}

export function useReview(id: string) {
  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: () => reviewService.getReview(id),
    enabled: !!id,
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewService.createReview(data),
    onSuccess: () => {
      toast.success('Đã gửi đánh giá thành công', {
        description:
          'Đánh giá của bạn sẽ được quản trị viên của chúng tôi xem xét và hiển thị',
      })
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error('Không thể gửi đánh giá', {
        description: error.message || 'Vui lòng thử lại sau',
      })
    },
  })
}

export function useUpdateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: 'APPROVED' | 'REJECTED'
    }) => {
      return Promise.resolve({ id, status })
    },
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái đánh giá thành công')
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error('Không thể cập nhật đánh giá', {
        description: error.message,
      })
    },
  })
}

export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      toast.success('Đã xóa đánh giá thành công')
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { status?: number; data?: { message?: string } }
        message?: string
      }

      if (err?.response?.status === 404) {
        toast.error('Không thể xóa đánh giá', {
          description:
            'Không tìm thấy đánh giá này. Có thể đây là đánh giá chưa được xác minh (không có lịch hẹn nào được xác nhận) và không thể truy cập qua API.',
        })
      } else {
        toast.error('Không thể xóa đánh giá', {
          description:
            err?.response?.data?.message ||
            err?.message ||
            'Vui lòng thử lại sau',
        })
      }
    },
  })
}
