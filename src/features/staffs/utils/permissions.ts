/**
 * Staff Permissions Utility
 * Helper functions to check user permissions for staff operations
 */
import { can, canWithContext } from '@/lib/permission-utils'

/**
 * Staff resource permissions
 */
export const StaffPermissions = {
  READ: { resource: 'staff', action: 'read' },
  CREATE: { resource: 'staff', action: 'create' },
  UPDATE: { resource: 'staff', action: 'update' },
  DELETE: { resource: 'staff', action: 'delete' },
  MANAGE: { resource: 'staff', action: 'manage' },
} as const

/**
 * Check if user can read staff
 */
export function canReadStaff(): boolean {
  return can('staff', 'read')
}

/**
 * Check if user can create staff
 */
export function canCreateStaff(): boolean {
  return can('staff', 'create')
}

/**
 * Check if user can update staff
 */
export function canUpdateStaff(): boolean {
  return can('staff', 'update')
}

/**
 * Check if user can delete staff
 */
export function canDeleteStaff(): boolean {
  return can('staff', 'delete')
}

/**
 * Check if user can manage staff (full CRUD)
 */
export function canManageStaff(): boolean {
  return can('staff', 'manage')
}

/**
 * Check if user can edit a specific staff
 * Takes into account conditional permissions
 */
export function canEditStaff(context?: Record<string, unknown>): boolean {
  return canWithContext('staff', 'update', context)
}

/**
 * Check if user can delete a specific staff
 * Takes into account conditional permissions
 */
export function canDeleteSpecificStaff(
  context?: Record<string, unknown>
): boolean {
  return canWithContext('staff', 'delete', context)
}

/**
 * Get accessible staff management actions
 */
export function getStaffActions() {
  return {
    canRead: canReadStaff(),
    canCreate: canCreateStaff(),
    canUpdate: canUpdateStaff(),
    canDelete: canDeleteStaff(),
    canManage: canManageStaff(),
  }
}
