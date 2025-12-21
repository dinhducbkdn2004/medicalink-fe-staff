/**
 * Work Location Permissions Utility
 * Helper functions to check user permissions for work location operations
 */
import { can, canWithContext } from '@/lib/permission-utils'

/**
 * Work Location resource permissions
 */
export const WorkLocationPermissions = {
  READ: { resource: 'work-locations', action: 'read' },
  CREATE: { resource: 'work-locations', action: 'create' },
  UPDATE: { resource: 'work-locations', action: 'update' },
  DELETE: { resource: 'work-locations', action: 'delete' },
  MANAGE: { resource: 'work-locations', action: 'manage' },
} as const

/**
 * Check if user can read work locations
 */
export function canReadWorkLocations(): boolean {
  return can('work-locations', 'read')
}

/**
 * Check if user can create work locations
 */
export function canCreateWorkLocations(): boolean {
  return can('work-locations', 'create')
}

/**
 * Check if user can update work locations
 */
export function canUpdateWorkLocations(): boolean {
  return can('work-locations', 'update')
}

/**
 * Check if user can delete work locations
 */
export function canDeleteWorkLocations(): boolean {
  return can('work-locations', 'delete')
}

/**
 * Check if user can manage work locations (full CRUD)
 */
export function canManageWorkLocations(): boolean {
  return can('work-locations', 'manage')
}

/**
 * Check if user can edit a specific work location
 * Takes into account conditional permissions
 */
export function canEditWorkLocation(
  context?: Record<string, unknown>
): boolean {
  return canWithContext('work-locations', 'update', context)
}

/**
 * Check if user can delete a specific work location
 * Takes into account conditional permissions
 */
export function canDeleteWorkLocation(
  context?: Record<string, unknown>
): boolean {
  return canWithContext('work-locations', 'delete', context)
}

/**
 * Get accessible work location management actions
 */
export function getWorkLocationActions() {
  return {
    canRead: canReadWorkLocations(),
    canCreate: canCreateWorkLocations(),
    canUpdate: canUpdateWorkLocations(),
    canDelete: canDeleteWorkLocations(),
    canManage: canManageWorkLocations(),
  }
}
