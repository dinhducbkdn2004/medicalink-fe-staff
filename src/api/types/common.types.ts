export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiErrorResponse {
  success: false
  message: string
  error: string
  statusCode: number
  timestamp: string
  path: string
  method: string
}

export interface ApiSuccessResponse<T = unknown> {
  success: true
  message: string
  data?: T
}
