import { can, canWithContext } from '@/lib/permission-utils'

export const StaffPermissions = {
  READ: { resource: 'staff', action: 'read' },
  CREATE: { resource: 'staff', action: 'create' },
  UPDATE: { resource: 'staff', action: 'update' },
  DELETE: { resource: 'staff', action: 'delete' },
  MANAGE: { resource: 'staff', action: 'manage' },
} as const

export function canReadStaff(): boolean {
  return can('staff', 'read')
}

export function canCreateStaff(): boolean {
  return can('staff', 'create')
}

export function canUpdateStaff(): boolean {
  return can('staff', 'update')
}

export function canDeleteStaff(): boolean {
  return can('staff', 'delete')
}

export function canManageStaff(): boolean {
  return can('staff', 'manage')
}

export function canEditStaff(context?: Record<string, unknown>): boolean {
  return canWithContext('staff', 'update', context)
}

export function canDeleteSpecificStaff(
  context?: Record<string, unknown>
): boolean {
  return canWithContext('staff', 'delete', context)
}

export function getStaffActions() {
  return {
    canRead: canReadStaff(),
    canCreate: canCreateStaff(),
    canUpdate: canUpdateStaff(),
    canDelete: canDeleteStaff(),
    canManage: canManageStaff(),
  }
}
