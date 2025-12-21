/**
 * Office Hours Permissions Utility
 * Helper functions to check user permissions for office hours operations
 */
import { can, canWithContext } from '@/lib/permission-utils'

/**
 * Office Hours resource permissions
 */
export const OfficeHoursPermissions = {
  READ: { resource: 'office-hours', action: 'read' },
  CREATE: { resource: 'office-hours', action: 'create' },
  UPDATE: { resource: 'office-hours', action: 'update' },
  DELETE: { resource: 'office-hours', action: 'delete' },
  MANAGE: { resource: 'office-hours', action: 'manage' },
} as const

/**
 * Check if user can read office hours
 */
export function canReadOfficeHours(): boolean {
  return can('office-hours', 'read')
}

/**
 * Check if user can create office hours
 */
export function canCreateOfficeHours(): boolean {
  return can('office-hours', 'create')
}

/**
 * Check if user can update office hours
 */
export function canUpdateOfficeHours(): boolean {
  return can('office-hours', 'update')
}

/**
 * Check if user can delete office hours
 */
export function canDeleteOfficeHours(): boolean {
  return can('office-hours', 'delete')
}

/**
 * Check if user can manage office hours (full CRUD)
 */
export function canManageOfficeHours(): boolean {
  return can('office-hours', 'manage')
}

/**
 * Check if user can delete a specific office hour
 * Takes into account conditional permissions
 */
export function canDeleteOfficeHour(
  context?: Record<string, unknown>
): boolean {
  return canWithContext('office-hours', 'delete', context)
}

/**
 * Get accessible office hours management actions
 */
export function getOfficeHoursActions() {
  return {
    canRead: canReadOfficeHours(),
    canCreate: canCreateOfficeHours(),
    canUpdate: canUpdateOfficeHours(),
    canDelete: canDeleteOfficeHours(),
    canManage: canManageOfficeHours(),
  }
}
