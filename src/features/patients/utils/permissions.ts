/**
 * Patient Permissions Utility
 * Helper functions to check user permissions for patient operations
 * Uses the new permission-driven system from API
 */
import { can, canWithContext } from '@/lib/permission-utils'

/**
 * Patient resource permissions
 */
export const PatientPermissions = {
  READ: { resource: 'patients', action: 'read' },
  CREATE: { resource: 'patients', action: 'create' },
  UPDATE: { resource: 'patients', action: 'update' },
  DELETE: { resource: 'patients', action: 'delete' },
  MANAGE: { resource: 'patients', action: 'manage' },
} as const

/**
 * Check if user can read patients
 */
export function canReadPatients(): boolean {
  return can('patients', 'read')
}

/**
 * Check if user can create patients
 */
export function canCreatePatients(): boolean {
  return can('patients', 'create')
}

/**
 * Check if user can update patients
 */
export function canUpdatePatients(): boolean {
  return can('patients', 'update')
}

/**
 * Check if user can delete patients
 */
export function canDeletePatients(): boolean {
  return can('patients', 'delete')
}

/**
 * Check if user can manage patients (full CRUD)
 */
export function canManagePatients(): boolean {
  return can('patients', 'manage')
}

/**
 * Check if user can edit a specific patient
 * Takes into account conditional permissions
 */
export function canEditPatient(context?: Record<string, unknown>): boolean {
  return canWithContext('patients', 'update', context)
}

/**
 * Check if user can delete a specific patient
 * Takes into account conditional permissions
 */
export function canDeletePatient(context?: Record<string, unknown>): boolean {
  return canWithContext('patients', 'delete', context)
}

/**
 * Get accessible patient management actions
 */
export function getPatientActions() {
  return {
    canRead: canReadPatients(),
    canCreate: canCreatePatients(),
    canUpdate: canUpdatePatients(),
    canDelete: canDeletePatients(),
    canManage: canManagePatients(),
  }
}
