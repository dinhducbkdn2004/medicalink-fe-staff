/**
 * Review Analysis API Types
 * Types for AI-powered review analysis functionality
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Date range types for review analysis
 */
export type DateRangeType = 'mtd' | 'ytd'

// ============================================================================
// Core Types
// ============================================================================

/**
 * Review Analysis entity
 * Contains AI-generated analysis of doctor reviews
 */
export interface ReviewAnalysis {
  id: string
  doctorId: string
  dateRange: DateRangeType
  includeNonPublic: boolean
  period1Total: number
  period1Avg: number
  period2Total: number
  period2Avg: number
  totalChange: number
  avgChange: number
  summary: string // HTML content
  advantages: string // HTML content
  disadvantages: string // HTML content
  changes: string // HTML content
  recommendations: string // HTML content
  createdBy: string
  createdAt: string
}

/**
 * Review Analysis list item
 * Minimal data for list display with creator name composition
 */
export interface ReviewAnalysisListItem {
  id: string
  doctorId: string
  dateRange: DateRangeType
  includeNonPublic: boolean
  summary: string // HTML content (first 150 chars typically)
  createdBy: string
  createdAt: string
  creatorName: string // Composed from accounts service
}

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * Create review analysis request
 */
export interface CreateReviewAnalysisRequest {
  doctorId: string
  dateRange: DateRangeType
  includeNonPublic?: boolean
}

/**
 * List review analyses query parameters
 */
export interface ListReviewAnalysesParams {
  page?: number
  limit?: number
  dateRange?: DateRangeType
}
