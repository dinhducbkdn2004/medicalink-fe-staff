export type DateRangeType = 'mtd' | 'ytd'

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
  summary: string
  advantages: string
  disadvantages: string
  changes: string
  recommendations: string
  createdBy: string
  createdAt: string
}

export interface ReviewAnalysisListItem {
  id: string
  doctorId: string
  dateRange: DateRangeType
  includeNonPublic: boolean
  summary: string
  createdBy: string
  createdAt: string
  creatorName: string
}

export interface CreateReviewAnalysisRequest {
  doctorId: string
  dateRange: DateRangeType
  includeNonPublic?: boolean
}

export interface ListReviewAnalysesParams {
  page?: number
  limit?: number
  dateRange?: DateRangeType
}
