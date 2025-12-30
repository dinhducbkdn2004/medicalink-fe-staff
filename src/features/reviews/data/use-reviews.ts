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
    queryFn: () => reviewService.getDoctorReviews(doctorId, params),
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
      toast.success('Review submitted successfully', {
        description:
          'Your review will be reviewed and published by our administrators',
      })
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error('Failed to submit review', {
        description: error.message || 'Please try again later',
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
      toast.success('Review status updated successfully')
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error('Failed to update review', {
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
      toast.success('Review deleted successfully')
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { status?: number; data?: { message?: string } }
        message?: string
      }

      if (err?.response?.status === 404) {
        toast.error('Cannot delete review', {
          description:
            'This review was not found. It may be an unverified review (no confirmed appointments) that is not accessible through the API.',
        })
      } else {
        toast.error('Failed to delete review', {
          description:
            err?.response?.data?.message ||
            err?.message ||
            'Please try again later',
        })
      }
    },
  })
}
