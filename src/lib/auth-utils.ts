/**
 * Authentication Utilities
 * Helper functions for authentication checks and role-based access control
 */
import type { User, UserRole } from '@/api/types/auth.types'

/**
 * Check if user has specific role
 */
export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user) return false
  return user.role === role
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

/**
 * Check if user is admin (ADMIN or SUPER_ADMIN)
 */
export function isAdmin(user: User | null): boolean {
  return hasAnyRole(user, ['ADMIN', 'SUPER_ADMIN'])
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(user: User | null): boolean {
  return hasRole(user, 'SUPER_ADMIN')
}

/**
 * Check if user is doctor
 */
export function isDoctor(user: User | null): boolean {
  return hasRole(user, 'DOCTOR')
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest'
  return user.fullName || user.email
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(user: User | null): string {
  if (!user || !user.fullName) return '??'

  const names = user.fullName.trim().split(' ')
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase()
  }

  return (names[0][0] + names[names.length - 1][0]).toUpperCase()
}

/**
 * Format user role for display
 */
export function formatRole(role: UserRole): string {
  const roleMap: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    DOCTOR: 'Doctor',
  }
  return roleMap[role] || role
}

/**
 * Check if tokens are present in localStorage
 */
export function hasStoredTokens(): boolean {
  if (typeof window === 'undefined') return false

  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')

  return !!(accessToken && refreshToken)
}

/**
 * Get gender display text
 */
export function getGenderDisplay(isMale: boolean | null | undefined): string {
  if (isMale === null || isMale === undefined) return 'Not specified'
  return isMale ? 'Male' : 'Female'
}
