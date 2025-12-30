import { create } from 'zustand'
import type {
  UserPermissionItem,
  PermissionCondition,
} from '@/api/types/permission.types'

export type PermissionEntry = {
  effect: 'ALLOW' | 'DENY'
  conditions?: PermissionCondition[]
}

export type PermissionMap = {
  [resource: string]: {
    [action: string]: PermissionEntry
  }
}

const MANAGE_ACTIONS = ['create', 'read', 'update', 'delete'] as const

interface PermissionState {
  permissions: UserPermissionItem[]

  permissionMap: PermissionMap

  isLoading: boolean
  isLoaded: boolean

  setPermissions: (permissions: UserPermissionItem[]) => void
  clearPermissions: () => void
  setLoading: (loading: boolean) => void

  can: (resource: string, action: string) => boolean
  canWithContext: (
    resource: string,
    action: string,
    context?: Record<string, unknown>
  ) => boolean
  getPermissionEntry: (
    resource: string,
    action: string
  ) => PermissionEntry | null
}

function normalizePermissions(
  permissions: UserPermissionItem[]
): PermissionMap {
  const map: PermissionMap = {}

  for (const perm of permissions) {
    if (!map[perm.resource]) {
      map[perm.resource] = {}
    }

    map[perm.resource][perm.action] = {
      effect: perm.effect,
      conditions: perm.conditions,
    }
  }

  return map
}

function evaluateCondition(
  condition: PermissionCondition,
  context: Record<string, unknown>
): boolean {
  const contextValue = context[condition.field]

  switch (condition.operator) {
    case 'eq':
      return contextValue === condition.value

    case 'ne':
      return contextValue !== condition.value

    case 'in':
      if (Array.isArray(condition.value)) {
        return condition.value.includes(contextValue)
      }
      return false

    case 'contains':
      if (Array.isArray(contextValue)) {
        return contextValue.includes(condition.value)
      }
      return false

    default:
      return false
  }
}

function evaluateConditions(
  conditions: PermissionCondition[] | undefined,
  context?: Record<string, unknown>
): boolean {
  if (!conditions || conditions.length === 0) {
    return true
  }

  if (!context) {
    return false
  }

  return conditions.every((condition) => evaluateCondition(condition, context))
}

export const usePermissionStore = create<PermissionState>()((set, get) => ({
  permissions: [],
  permissionMap: {},
  isLoading: false,
  isLoaded: false,

  setPermissions: (permissions) => {
    const permissionMap = normalizePermissions(permissions)
    set({
      permissions,
      permissionMap,
      isLoaded: true,
      isLoading: false,
    })
  },

  clearPermissions: () => {
    set({
      permissions: [],
      permissionMap: {},
      isLoaded: false,
      isLoading: false,
    })
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  getPermissionEntry: (resource, action) => {
    const { permissionMap } = get()

    if (permissionMap[resource]?.[action]) {
      return permissionMap[resource][action]
    }

    if (MANAGE_ACTIONS.includes(action as (typeof MANAGE_ACTIONS)[number])) {
      if (permissionMap[resource]?.['manage']) {
        return permissionMap[resource]['manage']
      }
    }

    return null
  },

  can: (resource, action) => {
    const entry = get().getPermissionEntry(resource, action)

    if (!entry) {
      return false
    }
    return entry.effect === 'ALLOW'
  },

  canWithContext: (resource, action, context) => {
    const entry = get().getPermissionEntry(resource, action)

    if (!entry) {
      return false
    }

    if (entry.effect === 'DENY') {
      return false
    }

    return evaluateConditions(entry.conditions, context)
  },
}))

export const useIsPermissionLoaded = () =>
  usePermissionStore((state) => state.isLoaded)

export const useIsPermissionLoading = () =>
  usePermissionStore((state) => state.isLoading)

export const usePermissionMap = () =>
  usePermissionStore((state) => state.permissionMap)
