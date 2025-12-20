/**
 * Stats API Types
 * Based on API specification for stats endpoints
 */

/**
 * Staff stats by role
 */
export interface StaffStatsByRole {
  SUPER_ADMIN: number
  ADMIN: number
  DOCTOR: number
}

/**
 * Staff stats response
 */
export interface StaffStats {
  total: number
  byRole: StaffStatsByRole
  recentlyCreated: number
  deleted: number
}

/**
 * Doctor stats by role (all should be DOCTOR)
 */
export interface DoctorStatsByRole {
  DOCTOR: number
  ADMIN: number
  SUPER_ADMIN: number
}

/**
 * Doctor stats response
 */
export interface DoctorStats {
  total: number
  byRole: DoctorStatsByRole
  recentlyCreated: number
  deleted: number
}

export interface RevenueStats {
  name: string
  total: {
    VND?: number
    $?: number
  }
}

export interface RevenueByDoctorStats {
  doctorId: string
  total: {
    VND?: number
    $?: number
  }
  doctor: {
    id: string
    staffAccountId: string
    fullName: string
    isActive: boolean
    avatarUrl: string
  }
}

export interface PatientStats {
  totalPatients: number
  currentMonthPatients: number
  previousMonthPatients: number
  growthPercent: number
}

export interface AppointmentStats {
  totalAppointments: number
  currentMonthAppointments: number
  previousMonthAppointments: number
  growthPercent: number
}

export interface ReviewsOverviewStats {
  totalReviews: number
  ratingCounts: Record<string, number>
}

export interface QAOverviewStats {
  totalQuestions: number
  answeredQuestions: number
  answerRate: number
}

// ============================================================================
// Doctor Stats Types (New endpoints from API_DOCTOR_STATS.md)
// ============================================================================

/**
 * Booking stats for a doctor
 */
export interface DoctorBookingStats {
  total: number
  bookedCount: number
  confirmedCount: number
  cancelledCount: number
  completedCount: number
  completedRate: number
}

/**
 * Content stats for a doctor (reviews, answers, blogs)
 */
export interface DoctorContentStats {
  totalReviews: number
  averageRating: number
  totalAnswers: number
  totalAcceptedAnswers: number
  answerAcceptedRate: number
  totalBlogs: number
}

/**
 * Complete stats for a doctor (booking + content)
 */
export interface DoctorStats {
  booking: DoctorBookingStats
  content: DoctorContentStats
}

/**
 * Doctor info for stats responses
 */
export interface DoctorStatsInfo {
  id: string
  fullName: string
}

/**
 * Deleted doctor placeholder
 */
export interface DeletedDoctorInfo {
  id: 'invalid-id'
  fullName: 'Deleted Doctor'
}

/**
 * Doctor booking stats item (for admin list)
 */
export interface DoctorBookingStatsItem {
  doctorStaffAccountId: string
  total: number
  bookedCount: number
  confirmedCount: number
  cancelledCount: number
  completedCount: number
  completedRate: number
  doctor: DoctorStatsInfo | DeletedDoctorInfo
}

/**
 * Doctor content stats item (for admin list)
 */
export interface DoctorContentStatsItem {
  doctorStaffAccountId: string
  totalReviews: number
  averageRating: number
  totalAnswers: number
  totalAcceptedAnswers: number
  answerAcceptedRate: number
  totalBlogs: number
  doctor: DoctorStatsInfo | DeletedDoctorInfo
}

/**
 * Pagination metadata for stats lists
 */
export interface StatsPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Sort options for doctor booking stats
 */
export type DoctorBookingSortBy =
  | 'booked'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'completedRate'

/**
 * Sort options for doctor content stats
 */
export type DoctorContentSortBy =
  | 'totalReviews'
  | 'averageRating'
  | 'totalAnswers'
  | 'totalAcceptedAnswers'
  | 'totalBlogs'

/**
 * Query parameters for doctor booking stats
 */
export interface DoctorBookingStatsParams {
  page?: number
  limit?: number
  sortBy?: DoctorBookingSortBy
  sortOrder?: 'ASC' | 'DESC'
}

/**
 * Query parameters for doctor content stats
 */
export interface DoctorContentStatsParams {
  page?: number
  limit?: number
  sortBy?: DoctorContentSortBy
  sortOrder?: 'ASC' | 'DESC'
}

/**
 * Response for doctor booking stats list
 */
export interface DoctorBookingStatsResponse {
  data: DoctorBookingStatsItem[]
  meta: StatsPaginationMeta
}

/**
 * Response for doctor content stats list
 */
export interface DoctorContentStatsResponse {
  data: DoctorContentStatsItem[]
  meta: StatsPaginationMeta
}
