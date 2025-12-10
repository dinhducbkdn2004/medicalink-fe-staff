/**
 * Review API Service
 * Handles all API calls related to reviews
 * API Base: /api/reviews
 */
import { apiClient } from '../core/client'
import type { PaginatedResponse, PaginationParams } from '../types/common.types'

// ============================================================================
// Types
// ============================================================================

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
   */
  async getDoctorReviews(
    doctorId: string,
    params: PaginationParams = {}
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
   */
  async deleteReview(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean
      message: string
      data: null
    }>(`/reviews/${id}`)
    return {
      success: response.data.success,
      message: response.data.message,
    }
  }
}

export const reviewService = new ReviewService()
