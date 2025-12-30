export * from './auth.service'
export * from './stats.service'
export * from './staff.service'
export * from './doctor.service'
export * from './doctor-profile.service'
export * from './specialty.service'
export * from './work-location.service'
export * from './blog.service'
export * from './cloudinary.service'

export * from './office-hour.service'
export * from './permission.service'
export * from './patient.service'
export * from './appointment.service'

export type {
  Specialty as QuestionSpecialty,
  Question,
  QuestionQueryParams,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionListResponse,
} from './question.service'
export { questionService } from './question.service'

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
