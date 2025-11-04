/**
 * Doctor Module Permissions
 * Permission checking utilities for doctor management features
 */
import type { User, UserRole } from '@/api/types/auth.types'

/**
 * Doctor module permissions
 */
export const DoctorPermissions = {
  READ: 'doctors:read',
  UPDATE: 'doctors:update',
  DELETE: 'doctors:delete',
} as const

export type DoctorPermission =
  (typeof DoctorPermissions)[keyof typeof DoctorPermissions]

/**
 * Roles allowed to manage doctors
 */
export const DOCTOR_MANAGEMENT_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN']

/**
 * Roles allowed to edit own profile
 */
export const DOCTOR_SELF_EDIT_ROLES: UserRole[] = ['DOCTOR']

/**
 * Check if user can read doctor information
 */
export function canReadDoctors(user: User | null): boolean {
  if (!user) return false
  return DOCTOR_MANAGEMENT_ROLES.includes(user.role) || user.role === 'DOCTOR'
}

/**
 * Check if user can create/update doctors
 */
export function canManageDoctors(user: User | null): boolean {
  if (!user) return false
  return DOCTOR_MANAGEMENT_ROLES.includes(user.role)
}

/**
 * Check if user can delete doctors
 */
export function canDeleteDoctors(user: User | null): boolean {
  if (!user) return false
  return DOCTOR_MANAGEMENT_ROLES.includes(user.role)
}

/**
 * Check if user can edit their own profile
 */
export function canEditOwnProfile(
  user: User | null,
  doctorId?: string
): boolean {
  if (!user) return false

  // Admins can edit any profile
  if (DOCTOR_MANAGEMENT_ROLES.includes(user.role)) {
    return true
  }

  // Doctors can only edit their own profile
  if (user.role === 'DOCTOR' && doctorId) {
    return user.id === doctorId
  }

  return false
}

/**
 * Check if user can toggle doctor active status
 */
export function canToggleActive(user: User | null): boolean {
  if (!user) return false
  return DOCTOR_MANAGEMENT_ROLES.includes(user.role)
}

/**
 * Get accessible doctor management actions for user
 */
export function getDoctorActions(user: User | null) {
  return {
    canRead: canReadDoctors(user),
    canCreate: canManageDoctors(user),
    canUpdate: canManageDoctors(user),
    canDelete: canDeleteDoctors(user),
    canToggleActive: canToggleActive(user),
  }
}
