/**
 * Reviews Feature - React Query Hooks
 * Data fetching and mutations for reviews
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  reviewService,
  type CreateReviewRequest,
  type ReviewQueryParams,
} from '@/api/services'

// ============================================================================
// Query Keys
// ============================================================================

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (params: ReviewQueryParams) => [...reviewKeys.lists(), params] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
  doctorReviews: (doctorId: string, params: ReviewQueryParams) =>
    [...reviewKeys.all, 'doctor', doctorId, params] as const,
}

// ============================================================================
// Queries
// ============================================================================

/**
 * Get paginated list of reviews
 */
export function useReviews(params: ReviewQueryParams = {}) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: async () => {
      try {
        return await reviewService.getReviews(params)
      } catch (error: unknown) {
        // Handle 404 specifically
        const err = error as { response?: { status?: number } }
        if (err?.response?.status === 404) {
          // Return empty data structure to prevent UI crashes
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
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error: unknown) => {
      // Don't retry on 404 errors
      const err = error as { response?: { status?: number } }
      if (err?.response?.status === 404) {
        return false
      }
      return failureCount < 2
    },
  })
}

/**
 * Get reviews for a specific doctor
 */
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

/**
 * Get a single review by ID
 */
export function useReview(id: string) {
  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: () => reviewService.getReview(id),
    enabled: !!id,
  })
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Create a new review (public)
 */
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

/**
 * Update review status (admin only - for approve/reject)
 * Note: Since API doesn't have explicit update endpoint, we simulate it
 * In real implementation, you'd call reviewService.updateReview
 */
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
      // TODO: Replace with actual API call when endpoint is available
      // return reviewService.updateReview(id, { status })
      // Update review: id, status
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

/**
 * Delete a review (admin only)
 */
export function useDeleteReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      toast.success('Review deleted successfully')
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
    },
    onError: (error: Error) => {
      toast.error('Failed to delete review', {
        description: error.message,
      })
    },
  })
}
