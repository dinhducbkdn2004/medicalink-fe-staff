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
