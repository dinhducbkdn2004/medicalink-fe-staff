/**
 * Question API Service
 * Handles all API calls related to questions
 * API Base: /api/questions
 */
import { apiClient } from '../core/client'
import type { PaginatedResponse, PaginationParams } from '../types/common.types'

// ============================================================================
// Types
// ============================================================================

export interface Specialty {
  id: string
  name: string
  slug: string
}

export interface Question {
  id: string
  title: string
  slug: string
  body: string
  authorName?: string
  authorEmail?: string
  specialtyId?: string
  specialty?: Specialty
  publicIds?: string[]
  answerCount: number
  acceptedAnswerCount?: number
  viewCount: number
  status: 'PENDING' | 'ANSWERED' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

export interface QuestionQueryParams extends PaginationParams {
  search?: string
  specialtyId?: string
  authorEmail?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateQuestionRequest {
  title: string
  body: string
  authorName?: string
  authorEmail?: string
  specialtyId?: string
  publicIds?: string[]
}

export interface UpdateQuestionRequest {
  title?: string
  body?: string
  status?: 'PENDING' | 'ANSWERED' | 'CLOSED'
  specialtyId?: string | null
}

export type QuestionListResponse = PaginatedResponse<Question>

// ============================================================================
// Service Class
// ============================================================================

class QuestionService {
  // --------------------------------------------------------------------------
  // Question CRUD
  // --------------------------------------------------------------------------

  /**
   * Get all questions with pagination and filtering
   * GET /api/questions
   */
  async getQuestions(
    params: QuestionQueryParams = {}
  ): Promise<QuestionListResponse> {
    const response = await apiClient.get<QuestionListResponse>('/questions', {
      params,
    })
    return response.data
  }

  /**
   * Get a single question by ID
   * GET /api/questions/:id
   */
  async getQuestion(id: string): Promise<Question> {
    const response = await apiClient.get<Question>(`/questions/${id}`)
    return response.data
  }

  /**
   * Create a new question (public, rate-limited)
   * POST /api/questions
   */
  async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    const response = await apiClient.post<Question>('/questions', data)
    return response.data
  }

  /**
   * Update a question (admin only)
   * PATCH /api/questions/:id
   */
  async updateQuestion(
    id: string,
    data: UpdateQuestionRequest
  ): Promise<Question> {
    const response = await apiClient.patch<Question>(`/questions/${id}`, data)
    return response.data
  }

  /**
   * Delete a question (admin only)
   * DELETE /api/questions/:id
   */
  async deleteQuestion(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{
      success: boolean
      message: string
    }>(`/questions/${id}`)
    return response.data
  }
}

export const questionService = new QuestionService()
