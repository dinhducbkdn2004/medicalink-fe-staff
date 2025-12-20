/**
 * Doctor Module Permissions
 * Permission checking utilities for doctor management features
 * Uses the new permission-driven system from API
 */
import { can, canWithContext } from '@/lib/permission-utils'

/**
 * Doctor resource permissions
 */
export const DoctorPermissions = {
  READ: { resource: 'doctors', action: 'read' },
  CREATE: { resource: 'doctors', action: 'create' },
  UPDATE: { resource: 'doctors', action: 'update' },
  DELETE: { resource: 'doctors', action: 'delete' },
  MANAGE: { resource: 'doctors', action: 'manage' },
} as const

/**
 * Check if user can read doctor information
 */
export function canReadDoctors(): boolean {
  return can('doctors', 'read')
}

/**
 * Check if user can create doctors
 */
export function canCreateDoctors(): boolean {
  return can('doctors', 'create')
}

/**
 * Check if user can update doctors (any doctor)
 */
export function canUpdateDoctors(): boolean {
  return can('doctors', 'update')
}

/**
 * Check if user can delete doctors
 */
export function canDeleteDoctors(): boolean {
  return can('doctors', 'delete')
}

/**
 * Check if user can manage doctors (full CRUD)
 */
export function canManageDoctors(): boolean {
  return can('doctors', 'manage')
}

/**
 * Check if user can edit a specific doctor profile
 * Takes into account conditional permissions (isSelf)
 */
export function canEditDoctorProfile(isSelf: boolean): boolean {
  // Check with context for conditional permissions
  return canWithContext('doctors', 'update', { isSelf })
}

/**
 * Check if user can edit own profile
 * Kept for backward compatibility with existing code
 *
 * @param user - User object (can be null)
 * @param doctorId - Doctor ID to check
 */
export function canEditOwnProfile(
  user: { id: string } | null | undefined,
  doctorId?: string
): boolean {
  // If no user or doctorId, check basic permission
  if (!user || !doctorId) {
    return can('doctors', 'update')
  }

  // Check if this is self-edit
  const isSelf = user.id === doctorId

  // Use permission with context
  return canEditDoctorProfile(isSelf)
}

/**
 * Check if user can delete a specific doctor
 * Takes into account conditional permissions
 */
export function canDeleteDoctor(isSelf: boolean): boolean {
  return canWithContext('doctors', 'delete', { isSelf })
}

/**
 * Check if user can toggle doctor active status
 */
export function canToggleActive(): boolean {
  return can('doctors', 'update')
}

/**
 * Get accessible doctor management actions
 */
export function getDoctorActions() {
  return {
    canRead: canReadDoctors(),
    canCreate: canCreateDoctors(),
    canUpdate: canUpdateDoctors(),
    canDelete: canDeleteDoctors(),
    canManage: canManageDoctors(),
    canToggleActive: canToggleActive(),
  }
}

/**
 * Get doctor row actions with context
 * Used for table row actions that may depend on ownership
 */
export function getDoctorRowActions(isSelf: boolean) {
  return {
    canEdit: canEditDoctorProfile(isSelf),
    canDelete: canDeleteDoctor(isSelf),
    canToggleActive: canToggleActive(),
  }
}
