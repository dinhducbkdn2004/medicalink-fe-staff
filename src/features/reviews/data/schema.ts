import type {
  Review as ApiReview,
  Doctor as ApiDoctor,
  ReviewQueryParams as ApiReviewQueryParams,
  CreateReviewRequest as ApiCreateReviewRequest,
  ReviewListResponse as ApiReviewListResponse,
  DoctorReviewsResponse as ApiDoctorReviewsResponse,
  ReviewSummary as ApiReviewSummary,
} from '@/api/services'

export type Review = ApiReview
export type Doctor = ApiDoctor
export type ReviewQueryParams = ApiReviewQueryParams
export type CreateReviewRequest = ApiCreateReviewRequest
export type ReviewListResponse = ApiReviewListResponse
export type DoctorReviewsResponse = ApiDoctorReviewsResponse
export type ReviewSummary = ApiReviewSummary

export type ReviewWithActions = Review

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
