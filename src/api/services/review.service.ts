/**
 * Review API Service
 * Handles all API calls related to reviews
 * API Base: /api/reviews
 */
import { apiClient } from '../core/client'
import type { PaginatedResponse, PaginationParams } from '../types/common.types'
import type {
  ReviewAnalysis,
  ReviewAnalysisListItem,
  CreateReviewAnalysisRequest,
  ListReviewAnalysesParams,
} from '../types/review-analysis.types'

// ============================================================================
// Types
// ============================================================================

export interface ReviewQueryParams extends PaginationParams {
  /**
   * Filter reviews by public status
   * true = reviewer has at least 1 confirmed appointment with the doctor
   * false = reviewer has no confirmed appointments
   */
  isPublic?: boolean
}

export interface Review {
  id: string
  rating: number
  title: string
  body: string
  authorName: string
  authorEmail: string
  doctorId: string
  isPublic: boolean
  createdAt: string
  publicIds: string[]
  // These fields might be populated if the backend joins data,
  // but based on the raw response they aren't there.
  // We'll keep them optional for now to avoid breaking UI that relies on them until we fix components.
  doctor?: {
    id: string
    fullName: string
    specialty?: string
    avatarUrl?: string
  }
}

export interface CreateReviewRequest {
  /**
   * BREAKING CHANGE (15-12-2024):
   * This field now requires staffAccountId instead of profileId
   * When creating a review, use the doctor's staffAccountId (from doctor.staffAccountId in public API)
   */
  doctorId: string
  rating: number
  title: string
  body: string
  authorName: string
  authorEmail: string
}

// ============================================================================
// Service Class
// ============================================================================

class ReviewService {
  // --------------------------------------------------------------------------
  // Review CRUD
  // --------------------------------------------------------------------------

  /**
   * Get all reviews for a specific doctor
   * GET /api/reviews/doctor/:doctorId
   *
   * BREAKING CHANGE (15-12-2024):
   * doctorId parameter now requires staffAccountId instead of profileId
   * Use doctor.staffAccountId from the doctor profile data
   *
   * Query params:
   * - isPublic: Filter by public status (true/false)
   */
  async getDoctorReviews(
    doctorId: string,
    params: ReviewQueryParams = {}
  ): Promise<PaginatedResponse<Review>> {
    const response = await apiClient.get<PaginatedResponse<Review>>(
      `/reviews/doctor/${doctorId}`,
      { params }
    )
    return response.data
  }

  /**
   * Get a single review by ID
   * GET /api/reviews/:id
   */
  async getReview(id: string): Promise<Review> {
    const response = await apiClient.get<{
      success: boolean
      message: string
      data: Review
    }>(`/reviews/${id}`)
    return response.data.data
  }

  /**
   * Create a new review
   * POST /api/reviews
   *
   * BREAKING CHANGE (15-12-2024):
   * data.doctorId must be staffAccountId (from doctor.staffAccountId in public doctor profile)
   * NOT the profileId
   */
  async createReview(data: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post<{
      success: boolean
      message: string
      data: Review
    }>('/reviews', data)
    return response.data.data
  }

  /**
   * Delete a review (admin only)
   * DELETE /api/reviews/:id
   *
   * Note: The API response is auto-unwrapped by the interceptor
   * API returns { success, message, data: null }
   * After unwrapping, response.data will be null
   */
  async deleteReview(id: string): Promise<void> {
    await apiClient.delete(`/reviews/${id}`)
    // Response is successfully unwrapped to null, no need to return anything
  }

  // --------------------------------------------------------------------------
  // Review Analysis
  // --------------------------------------------------------------------------

  /**
   * Create a new review analysis using AI
   * POST /api/reviews/analyze
   *
   * Requires: reviews:analyze permission
   * Rate Limit: 5 requests per hour
   *
   * @throws {429} Rate limit exceeded
   * @throws {503} AI service unavailable
   */
  async createAnalysis(
    data: CreateReviewAnalysisRequest
  ): Promise<ReviewAnalysis> {
    const response = await apiClient.post<ReviewAnalysis>(
      '/reviews/analyze',
      data
    )
    return response.data
  }

  /**
   * List review analyses for a specific doctor
   * GET /api/reviews/:doctorId/analyses
   *
   * Requires: reviews:read permission
   * Returns paginated list with creator names composed from accounts service
   */
  async listAnalyses(
    doctorId: string,
    params: ListReviewAnalysesParams = {}
  ): Promise<PaginatedResponse<ReviewAnalysisListItem>> {
    const response = await apiClient.get<
      PaginatedResponse<ReviewAnalysisListItem>
    >(`/reviews/${doctorId}/analyses`, { params })
    return response.data
  }

  /**
   * Get a single review analysis by ID
   * GET /api/reviews/analyses/:id
   *
   * Requires: reviews:read permission
   * Returns full analysis details without composition
   */
  async getAnalysisById(id: string): Promise<ReviewAnalysis> {
    const response = await apiClient.get<ReviewAnalysis>(
      `/reviews/analyses/${id}`
    )
    return response.data
  }
}

export const reviewService = new ReviewService()
