import { usePermissionStore } from '@/stores/permission-store'

export function can(resource: string, action: string): boolean {
  return usePermissionStore.getState().can(resource, action)
}

export function canWithContext(
  resource: string,
  action: string,
  context?: Record<string, unknown>
): boolean {
  return usePermissionStore.getState().canWithContext(resource, action, context)
}

export function canAny(
  permissions: Array<{ resource: string; action: string }>
): boolean {
  return permissions.some((p) => can(p.resource, p.action))
}

export function canAll(
  permissions: Array<{ resource: string; action: string }>
): boolean {
  return permissions.every((p) => can(p.resource, p.action))
}

export function isSystemAdmin(): boolean {
  return can('system', 'admin')
}

export function canManagePermissions(): boolean {
  return can('permissions', 'manage')
}

export type RoutePermission = {
  resource: string
  action: string
}

export function getRoutePermission(path: string): RoutePermission | null {
  const segments = path.replace(/^\//, '').split('/')
  const baseSegment = segments[0]

  const routePermissionMap: Record<string, RoutePermission> = {
    '': { resource: 'dashboard', action: 'read' },

    staffs: { resource: 'staff', action: 'read' },
    doctors: { resource: 'doctors', action: 'read' },
    patients: { resource: 'patients', action: 'read' },

    'group-manager': { resource: 'permissions', action: 'manage' },
    'user-permission': { resource: 'permissions', action: 'manage' },
    'user-group': { resource: 'groups', action: 'manage' },

    specialties: { resource: 'specialties', action: 'read' },
    'work-locations': { resource: 'work-locations', action: 'read' },
    'office-hours': { resource: 'office-hours', action: 'read' },

    appointments: { resource: 'appointments', action: 'read' },
    questions: { resource: 'questions', action: 'read' },
    reviews: { resource: 'reviews', action: 'read' },

    blogs: { resource: 'blogs', action: 'read' },

    notifications: { resource: 'notifications', action: 'read' },

    schedules: { resource: 'schedules', action: 'read' },

    settings: null as unknown as RoutePermission,
    'help-center': null as unknown as RoutePermission,
  }

  return routePermissionMap[baseSegment] ?? null
}

export function canAccessRoute(path: string): boolean {
  const permission = getRoutePermission(path)

  if (permission === null) {
    return true
  }

  return can(permission.resource, permission.action)
}
