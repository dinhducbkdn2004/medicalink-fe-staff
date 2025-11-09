/**
 * Questions Feature - Data Schema
 * TypeScript types and interfaces for questions and answers
 */
export type {
  Question,
  Answer,
  Specialty,
  Doctor,
  QuestionQueryParams,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  QuestionListResponse,
  AnswerListResponse,
  Question as QuestionWithActions,
  Answer as AnswerWithActions,
} from '@/api/services'

// ============================================================================
// UI-specific Types
// ============================================================================

export type QuestionStatus = 'PENDING' | 'ANSWERED' | 'CLOSED'
