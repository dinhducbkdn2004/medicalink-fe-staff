/**
 * Answer API Service
 * Handles all API calls related to answers
 * API Base: /api/questions/:id/answers and /api/questions/answers/:answerId
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

export interface Answer {
  id: string
  questionId: string
  body: string
  authorId: string
  authorFullName?: string // API response field
  doctor?: Doctor // Keeping purely for backward compat if needed, but API seems to use authorFullName
  publicIds?: string[]
  isAccepted: boolean
  upvotes?: number
  createdAt: string
  updatedAt: string
}

export type AnswerQueryParams = PaginationParams
// Reserved for future filters - can extend with additional properties when needed

export interface CreateAnswerRequest {
  body: string
  publicIds?: string[]
}

export interface UpdateAnswerRequest {
  body?: string
  isAccepted?: boolean
}

export type AnswerListResponse = PaginatedResponse<Answer>

// ============================================================================
// Service Class
// ============================================================================

class AnswerService {
  // --------------------------------------------------------------------------
  // Answer CRUD
  // --------------------------------------------------------------------------

  /**
   * Get accepted answers for a question (public)
   * GET /api/questions/:id/answers
   */
  async getAnswersForQuestion(
    questionId: string,
    params: AnswerQueryParams = {}
  ): Promise<AnswerListResponse> {
    const response = await apiClient.get<AnswerListResponse>(
      `/questions/${questionId}/answers`,
      { params }
    )
    return response.data
  }

  /**
   * Get a single answer by ID (public, must be accepted)
   * GET /api/questions/answers/:answerId
   */
  async getAnswer(answerId: string): Promise<Answer> {
    const response = await apiClient.get<Answer>(
      `/questions/answers/${answerId}`
    )
    return response.data
  }

  /**
   * Create an answer to a question (doctors only)
   * POST /api/questions/:id/answers
   */
  async createAnswer(
    questionId: string,
    data: CreateAnswerRequest
  ): Promise<Answer> {
    const response = await apiClient.post<Answer>(
      `/questions/${questionId}/answers`,
      data
    )
    return response.data
  }

  /**
   * Update an answer (admin only)
   * PATCH /api/questions/answers/:answerId
   */
  async updateAnswer(
    answerId: string,
    data: UpdateAnswerRequest
  ): Promise<Answer> {
    const response = await apiClient.patch<Answer>(
      `/questions/answers/${answerId}`,
      data
    )
    return response.data
  }

  /**
   * Accept an answer (admin only)
   * PATCH /api/questions/answers/:answerId/accept
   */
  async acceptAnswer(answerId: string): Promise<Answer> {
    const response = await apiClient.patch<Answer>(
      `/questions/answers/${answerId}/accept`
    )
    return response.data
  }

  /**
   * Delete an answer (admin only)
   * DELETE /api/questions/answers/:answerId
   */
  async deleteAnswer(
    answerId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean
      message: string
    }>(`/questions/answers/${answerId}`)
    return response.data
  }
}

export const answerService = new AnswerService()
