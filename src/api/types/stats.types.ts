export interface StaffStatsByRole {
  SUPER_ADMIN: number
  ADMIN: number
  DOCTOR: number
}

export interface StaffStats {
  total: number
  byRole: StaffStatsByRole
  recentlyCreated: number
  deleted: number
}

export interface DoctorStatsByRole {
  DOCTOR: number
  ADMIN: number
  SUPER_ADMIN: number
}

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

export interface DoctorBookingStats {
  total: number
  bookedCount: number
  confirmedCount: number
  cancelledCount: number
  completedCount: number
  completedRate: number
}

export interface DoctorContentStats {
  totalReviews: number
  averageRating: number
  totalAnswers: number
  totalAcceptedAnswers: number
  answerAcceptedRate: number
  totalBlogs: number
}

export interface DoctorStats {
  booking: DoctorBookingStats
  content: DoctorContentStats
}

export interface DoctorStatsInfo {
  id: string
  fullName: string
}

export interface DeletedDoctorInfo {
  id: 'invalid-id'
  fullName: 'Deleted Doctor'
}

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

export interface StatsPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type DoctorBookingSortBy =
  | 'booked'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'completedRate'

export type DoctorContentSortBy =
  | 'totalReviews'
  | 'averageRating'
  | 'totalAnswers'
  | 'totalAcceptedAnswers'
  | 'totalBlogs'

export interface DoctorBookingStatsParams {
  page?: number
  limit?: number
  sortBy?: DoctorBookingSortBy
  sortOrder?: 'ASC' | 'DESC'
}

export interface DoctorContentStatsParams {
  page?: number
  limit?: number
  sortBy?: DoctorContentSortBy
  sortOrder?: 'ASC' | 'DESC'
}

export interface DoctorBookingStatsResponse {
  data: DoctorBookingStatsItem[]
  meta: StatsPaginationMeta
}

export interface DoctorContentStatsResponse {
  data: DoctorContentStatsItem[]
  meta: StatsPaginationMeta
}
