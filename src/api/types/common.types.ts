/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

/**
 * Pagination metadata (matches backend response)
 */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false
  message: string
  error: string
  statusCode: number
  timestamp: string
  path: string
  method: string
}

/**
 * API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  message: string
  data?: T
}
