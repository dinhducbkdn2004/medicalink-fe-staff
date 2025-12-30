import { apiClient } from '../core/client'
import type { PaginatedResponse, PaginationParams } from '../types/common.types'
import type {
  ReviewAnalysis,
  ReviewAnalysisListItem,
  CreateReviewAnalysisRequest,
  ListReviewAnalysesParams,
} from '../types/review-analysis.types'

export interface ReviewQueryParams extends PaginationParams {
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

class ReviewService {
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

  async getReview(id: string): Promise<Review> {
    const response = await apiClient.get<{
      success: boolean
      message: string
      data: Review
    }>(`/reviews/${id}`)
    return response.data.data
  }

  async createReview(data: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post<{
      success: boolean
      message: string
      data: Review
    }>('/reviews', data)
    return response.data.data
  }

  async deleteReview(id: string): Promise<void> {
    await apiClient.delete(`/reviews/${id}`)
  }

  async createAnalysis(
    data: CreateReviewAnalysisRequest
  ): Promise<ReviewAnalysis> {
    const response = await apiClient.post<ReviewAnalysis>(
      '/reviews/analyze',
      data
    )
    return response.data
  }

  async listAnalyses(
    doctorId: string,
    params: ListReviewAnalysesParams = {}
  ): Promise<PaginatedResponse<ReviewAnalysisListItem>> {
    const response = await apiClient.get<
      PaginatedResponse<ReviewAnalysisListItem>
    >(`/reviews/${doctorId}/analyses`, { params })
    return response.data
  }

  async getAnalysisById(id: string): Promise<ReviewAnalysis> {
    const response = await apiClient.get<ReviewAnalysis>(
      `/reviews/analyses/${id}`
    )
    return response.data
  }
}

export const reviewService = new ReviewService()
