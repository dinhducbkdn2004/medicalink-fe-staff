/**
 * Reviews Feature - Data Schema
 * TypeScript types and interfaces for reviews
 */
import type {
  Review as ApiReview,
  Doctor as ApiDoctor,
  ReviewQueryParams as ApiReviewQueryParams,
  CreateReviewRequest as ApiCreateReviewRequest,
  ReviewListResponse as ApiReviewListResponse,
  DoctorReviewsResponse as ApiDoctorReviewsResponse,
  ReviewSummary as ApiReviewSummary,
} from '@/api/services'

// ============================================================================
// Re-export Types from API Services
// ============================================================================

export type Review = ApiReview
export type Doctor = ApiDoctor
export type ReviewQueryParams = ApiReviewQueryParams
export type CreateReviewRequest = ApiCreateReviewRequest
export type ReviewListResponse = ApiReviewListResponse
export type DoctorReviewsResponse = ApiDoctorReviewsResponse
export type ReviewSummary = ApiReviewSummary

// ============================================================================
// UI-specific Types
// ============================================================================

export type ReviewWithActions = Review

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
