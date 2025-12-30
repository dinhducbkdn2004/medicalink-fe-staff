import { apiClient } from '../core/client'
import type { PaginatedResponse, PaginationParams } from '../types/common.types'

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
  authorFullName?: string
  doctor?: Doctor
  publicIds?: string[]
  isAccepted: boolean
  upvotes?: number
  createdAt: string
  updatedAt: string
}

export type AnswerQueryParams = PaginationParams

export interface CreateAnswerRequest {
  body: string
  publicIds?: string[]
}

export interface UpdateAnswerRequest {
  body?: string
  isAccepted?: boolean
}

export type AnswerListResponse = PaginatedResponse<Answer>

class AnswerService {
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

  async getAnswer(answerId: string): Promise<Answer> {
    const response = await apiClient.get<Answer>(
      `/questions/answers/${answerId}`
    )
    return response.data
  }

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

  async acceptAnswer(answerId: string): Promise<Answer> {
    const response = await apiClient.patch<Answer>(
      `/questions/answers/${answerId}/accept`
    )
    return response.data
  }

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
