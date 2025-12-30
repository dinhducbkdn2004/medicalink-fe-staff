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

export type QuestionStatus = 'PENDING' | 'ANSWERED' | 'CLOSED'
