/**
 * API Services
 * Central export point for all API service modules
 */

export * from './auth.service'
export * from './stats.service'
export * from './staff.service'
export * from './doctor.service'
export * from './doctor-profile.service'
export * from './specialty.service'
export * from './work-location.service'
export * from './permission.service'

// Question service - rename Specialty to QuestionSpecialty to avoid conflict with specialty.service
export type {
  Specialty as QuestionSpecialty,
  Question,
  QuestionQueryParams,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionListResponse,
} from './question.service'
export { questionService } from './question.service'

// Answer service - rename Doctor to AnswerDoctor to avoid conflict with review.service
export type {
  Doctor as AnswerDoctor,
  Answer,
  AnswerQueryParams,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  AnswerListResponse,
} from './answer.service'
export { answerService } from './answer.service'

export * from './review.service'
