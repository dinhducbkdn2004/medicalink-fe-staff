import { can, canWithContext } from '@/lib/permission-utils'

export const SpecialtyPermissions = {
  READ: { resource: 'specialties', action: 'read' },
  CREATE: { resource: 'specialties', action: 'create' },
  UPDATE: { resource: 'specialties', action: 'update' },
  DELETE: { resource: 'specialties', action: 'delete' },
  MANAGE: { resource: 'specialties', action: 'manage' },
} as const

export function canReadSpecialties(): boolean {
  return can('specialties', 'read')
}

export function canCreateSpecialties(): boolean {
  return can('specialties', 'create')
}

export function canUpdateSpecialties(): boolean {
  return can('specialties', 'update')
}

export function canDeleteSpecialties(): boolean {
  return can('specialties', 'delete')
}

export function canManageSpecialties(): boolean {
  return can('specialties', 'manage')
}

export function canEditSpecialty(context?: Record<string, unknown>): boolean {
  return canWithContext('specialties', 'update', context)
}

export function canDeleteSpecialty(context?: Record<string, unknown>): boolean {
  return canWithContext('specialties', 'delete', context)
}

export function getSpecialtyActions() {
  return {
    canRead: canReadSpecialties(),
    canCreate: canCreateSpecialties(),
    canUpdate: canUpdateSpecialties(),
    canDelete: canDeleteSpecialties(),
    canManage: canManageSpecialties(),
  }
}
