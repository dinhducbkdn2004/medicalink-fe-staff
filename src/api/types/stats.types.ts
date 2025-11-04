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
