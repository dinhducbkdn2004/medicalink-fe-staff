/**
 * Specialty Permissions Utility
 * Helper functions to check user permissions for specialty operations
 */
import { can, canWithContext } from '@/lib/permission-utils'

/**
 * Specialty resource permissions
 */
export const SpecialtyPermissions = {
  READ: { resource: 'specialties', action: 'read' },
  CREATE: { resource: 'specialties', action: 'create' },
  UPDATE: { resource: 'specialties', action: 'update' },
  DELETE: { resource: 'specialties', action: 'delete' },
  MANAGE: { resource: 'specialties', action: 'manage' },
} as const

/**
 * Check if user can read specialties
 */
export function canReadSpecialties(): boolean {
  return can('specialties', 'read')
}

/**
 * Check if user can create specialties
 */
export function canCreateSpecialties(): boolean {
  return can('specialties', 'create')
}

/**
 * Check if user can update specialties
 */
export function canUpdateSpecialties(): boolean {
  return can('specialties', 'update')
}

/**
 * Check if user can delete specialties
 */
export function canDeleteSpecialties(): boolean {
  return can('specialties', 'delete')
}

/**
 * Check if user can manage specialties (full CRUD)
 */
export function canManageSpecialties(): boolean {
  return can('specialties', 'manage')
}

/**
 * Check if user can edit a specific specialty
 * Takes into account conditional permissions
 */
export function canEditSpecialty(context?: Record<string, unknown>): boolean {
  return canWithContext('specialties', 'update', context)
}

/**
 * Check if user can delete a specific specialty
 * Takes into account conditional permissions
 */
export function canDeleteSpecialty(context?: Record<string, unknown>): boolean {
  return canWithContext('specialties', 'delete', context)
}

/**
 * Get accessible specialty management actions
 */
export function getSpecialtyActions() {
  return {
    canRead: canReadSpecialties(),
    canCreate: canCreateSpecialties(),
    canUpdate: canUpdateSpecialties(),
    canDelete: canDeleteSpecialties(),
    canManage: canManageSpecialties(),
  }
}
