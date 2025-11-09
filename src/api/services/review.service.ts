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

export interface Doctor {
  id: string
  fullName: string
  specialty?: string
  avatarUrl?: string
}

export interface Review {
  id: string
  doctorId: string
  doctor: Doctor
  patientName: string
  patientEmail?: string
  rating: number
  comment: string
  appointmentDate?: string
  publicIds?: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface DoctorReviewsResponse extends PaginatedResponse<Review> {
  summary: ReviewSummary
}

export interface ReviewQueryParams extends PaginationParams {
  doctorId?: string
  rating?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateReviewRequest {
  doctorId: string
  patientName: string
  patientEmail?: string
  rating: number
  comment: string
  appointmentDate?: string
  publicIds?: string[]
}

export type ReviewListResponse = PaginatedResponse<Review>

// ============================================================================
// Service Class
// ============================================================================

class ReviewService {
  // --------------------------------------------------------------------------
  // Review CRUD
  // --------------------------------------------------------------------------

  /**
   * Get all reviews with pagination and filtering
   * GET /api/reviews
   */
  async getReviews(
    params: ReviewQueryParams = {}
  ): Promise<ReviewListResponse> {
    const response = await apiClient.get<ReviewListResponse>('/reviews', {
      params,
    })
    return response.data
  }

  /**
   * Get all reviews for a specific doctor
   * GET /api/reviews/doctors/:doctorId
   */
  async getDoctorReviews(
    doctorId: string,
    params: ReviewQueryParams = {}
  ): Promise<DoctorReviewsResponse> {
    const response = await apiClient.get<DoctorReviewsResponse>(
      `/reviews/doctors/${doctorId}`,
      { params }
    )
    return response.data
  }

  /**
   * Get a single review by ID
   * GET /api/reviews/:id
   */
  async getReview(id: string): Promise<Review> {
    const response = await apiClient.get<Review>(`/reviews/${id}`)
    return response.data
  }

  /**
   * Create a new review (public, rate-limited)
   * POST /api/reviews
   */
  async createReview(data: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post<Review>('/reviews', data)
    return response.data
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
    }>(`/reviews/${id}`)
    return response.data
  }
}

export const reviewService = new ReviewService()
