import { can, canWithContext } from '@/lib/permission-utils'

export const PatientPermissions = {
  READ: { resource: 'patients', action: 'read' },
  CREATE: { resource: 'patients', action: 'create' },
  UPDATE: { resource: 'patients', action: 'update' },
  DELETE: { resource: 'patients', action: 'delete' },
  MANAGE: { resource: 'patients', action: 'manage' },
} as const

export function canReadPatients(): boolean {
  return can('patients', 'read')
}

export function canCreatePatients(): boolean {
  return can('patients', 'create')
}

export function canUpdatePatients(): boolean {
  return can('patients', 'update')
}

export function canDeletePatients(): boolean {
  return can('patients', 'delete')
}

export function canManagePatients(): boolean {
  return can('patients', 'manage')
}

export function canEditPatient(context?: Record<string, unknown>): boolean {
  return canWithContext('patients', 'update', context)
}

export function canDeletePatient(context?: Record<string, unknown>): boolean {
  return canWithContext('patients', 'delete', context)
}

export function getPatientActions() {
  return {
    canRead: canReadPatients(),
    canCreate: canCreatePatients(),
    canUpdate: canUpdatePatients(),
    canDelete: canDeletePatients(),
    canManage: canManagePatients(),
  }
}
