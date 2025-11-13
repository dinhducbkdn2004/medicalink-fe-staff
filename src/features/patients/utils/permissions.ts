/**
 * Patient Permissions Utility
 * Helper functions to check user permissions for patient operations
 */
import type { User } from '@/api/types/auth.types'

/**
 * Check if user can read patients
 */
export function canReadPatients(user?: User | null): boolean {
  if (!user) return false

  // Super Admin and Admin have full access
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    return true
  }

  // For now, allow all authenticated users to read patients
  return true
}

/**
 * Check if user can create patients
 */
export function canCreatePatients(user?: User | null): boolean {
  if (!user) return false

  // Only Super Admin and Admin can create
  return user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'
}

/**
 * Check if user can update patients
 */
export function canUpdatePatients(user?: User | null): boolean {
  if (!user) return false

  // Only Super Admin and Admin can update
  return user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'
}

/**
 * Check if user can delete patients
 */
export function canDeletePatients(user?: User | null): boolean {
  if (!user) return false

  // Only Super Admin can delete
  return user.role === 'SUPER_ADMIN'
}
