import { can, canWithContext } from '@/lib/permission-utils'

export const DoctorPermissions = {
  READ: { resource: 'doctors', action: 'read' },
  CREATE: { resource: 'doctors', action: 'create' },
  UPDATE: { resource: 'doctors', action: 'update' },
  DELETE: { resource: 'doctors', action: 'delete' },
  MANAGE: { resource: 'doctors', action: 'manage' },
} as const

export function canReadDoctors(): boolean {
  return can('doctors', 'read')
}

export function canCreateDoctors(): boolean {
  return can('doctors', 'create')
}

export function canUpdateDoctors(): boolean {
  return can('doctors', 'update')
}

export function canDeleteDoctors(): boolean {
  return can('doctors', 'delete')
}

export function canManageDoctors(): boolean {
  return can('doctors', 'manage')
}

export function canEditDoctorProfile(isSelf: boolean): boolean {
  return canWithContext('doctors', 'update', { isSelf })
}

export function canEditOwnProfile(
  user: { id: string } | null | undefined,
  doctorId?: string
): boolean {
  if (!user || !doctorId) {
    return can('doctors', 'update')
  }

  const isSelf = user.id === doctorId

  return canEditDoctorProfile(isSelf)
}

export function canDeleteDoctor(isSelf: boolean): boolean {
  return canWithContext('doctors', 'delete', { isSelf })
}

export function canToggleActive(): boolean {
  return can('doctors', 'update')
}

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

export function getDoctorRowActions(isSelf: boolean) {
  return {
    canEdit: canEditDoctorProfile(isSelf),
    canDelete: canDeleteDoctor(isSelf),
    canToggleActive: canToggleActive(),
  }
}
