import { can, canWithContext } from '@/lib/permission-utils'

export const WorkLocationPermissions = {
  READ: { resource: 'work-locations', action: 'read' },
  CREATE: { resource: 'work-locations', action: 'create' },
  UPDATE: { resource: 'work-locations', action: 'update' },
  DELETE: { resource: 'work-locations', action: 'delete' },
  MANAGE: { resource: 'work-locations', action: 'manage' },
} as const

export function canReadWorkLocations(): boolean {
  return can('work-locations', 'read')
}

export function canCreateWorkLocations(): boolean {
  return can('work-locations', 'create')
}

export function canUpdateWorkLocations(): boolean {
  return can('work-locations', 'update')
}

export function canDeleteWorkLocations(): boolean {
  return can('work-locations', 'delete')
}

export function canManageWorkLocations(): boolean {
  return can('work-locations', 'manage')
}

export function canEditWorkLocation(
  context?: Record<string, unknown>
): boolean {
  return canWithContext('work-locations', 'update', context)
}

export function canDeleteWorkLocation(
  context?: Record<string, unknown>
): boolean {
  return canWithContext('work-locations', 'delete', context)
}

export function getWorkLocationActions() {
  return {
    canRead: canReadWorkLocations(),
    canCreate: canCreateWorkLocations(),
    canUpdate: canUpdateWorkLocations(),
    canDelete: canDeleteWorkLocations(),
    canManage: canManageWorkLocations(),
  }
}
