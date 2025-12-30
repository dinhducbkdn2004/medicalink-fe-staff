import { can, canWithContext } from '@/lib/permission-utils'

export const OfficeHoursPermissions = {
  READ: { resource: 'office-hours', action: 'read' },
  CREATE: { resource: 'office-hours', action: 'create' },
  UPDATE: { resource: 'office-hours', action: 'update' },
  DELETE: { resource: 'office-hours', action: 'delete' },
  MANAGE: { resource: 'office-hours', action: 'manage' },
} as const

export function canReadOfficeHours(): boolean {
  return can('office-hours', 'read')
}

export function canCreateOfficeHours(): boolean {
  return can('office-hours', 'create')
}

export function canUpdateOfficeHours(): boolean {
  return can('office-hours', 'update')
}

export function canDeleteOfficeHours(): boolean {
  return can('office-hours', 'delete')
}

export function canManageOfficeHours(): boolean {
  return can('office-hours', 'manage')
}

export function canDeleteOfficeHour(
  context?: Record<string, unknown>
): boolean {
  return canWithContext('office-hours', 'delete', context)
}

export function getOfficeHoursActions() {
  return {
    canRead: canReadOfficeHours(),
    canCreate: canCreateOfficeHours(),
    canUpdate: canUpdateOfficeHours(),
    canDelete: canDeleteOfficeHours(),
    canManage: canManageOfficeHours(),
  }
}
