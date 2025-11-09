/**
 * Questions Feature - Data Schema
 * TypeScript types and interfaces for questions and answers
 */
import type {
  Question as ApiQuestion,
  Answer as ApiAnswer,
  Specialty as ApiSpecialty,
  Doctor as ApiDoctor,
  QuestionQueryParams as ApiQuestionQueryParams,
  CreateQuestionRequest as ApiCreateQuestionRequest,
  UpdateQuestionRequest as ApiUpdateQuestionRequest,
  CreateAnswerRequest as ApiCreateAnswerRequest,
  UpdateAnswerRequest as ApiUpdateAnswerRequest,
  QuestionListResponse as ApiQuestionListResponse,
  AnswerListResponse as ApiAnswerListResponse,
} from '@/api/services'

// ============================================================================
// Re-export Types from API Services
// ============================================================================

export type Question = ApiQuestion
export type Answer = ApiAnswer
export type Specialty = ApiSpecialty
export type Doctor = ApiDoctor

export type QuestionQueryParams = ApiQuestionQueryParams
export type CreateQuestionRequest = ApiCreateQuestionRequest
export type UpdateQuestionRequest = ApiUpdateQuestionRequest
export type CreateAnswerRequest = ApiCreateAnswerRequest
export type UpdateAnswerRequest = ApiUpdateAnswerRequest

export type QuestionListResponse = ApiQuestionListResponse
export type AnswerListResponse = ApiAnswerListResponse

// ============================================================================
// UI-specific Types
// ============================================================================

export type QuestionWithActions = Question

export type AnswerWithActions = Answer

export type QuestionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ANSWERED'
