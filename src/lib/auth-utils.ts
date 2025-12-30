import type { User, UserRole } from '@/api/types/auth.types'

export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user) return false
  return user.role === role
}

export function hasAnyRole(user: User | null, roles: UserRole[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

export function isAdmin(user: User | null): boolean {
  return hasAnyRole(user, ['ADMIN', 'SUPER_ADMIN'])
}

export function isSuperAdmin(user: User | null): boolean {
  return hasRole(user, 'SUPER_ADMIN')
}

export function isDoctor(user: User | null): boolean {
  return hasRole(user, 'DOCTOR')
}

export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest'
  return user.fullName || user.email
}

export function getUserInitials(user: User | null): string {
  if (!user || !user.fullName) return '??'

  const names = user.fullName.trim().split(' ')
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase()
  }

  return (names[0][0] + names[names.length - 1][0]).toUpperCase()
}

export function formatRole(role: UserRole): string {
  const roleMap: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    DOCTOR: 'Doctor',
  }
  return roleMap[role] || role
}

export function hasStoredTokens(): boolean {
  if (typeof window === 'undefined') return false

  const accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')

  return !!(accessToken && refreshToken)
}

export function getGenderDisplay(isMale: boolean | null | undefined): string {
  if (isMale === null || isMale === undefined) return 'Not specified'
  return isMale ? 'Male' : 'Female'
}
