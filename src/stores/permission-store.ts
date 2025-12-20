/**
 * Permission Store
 * Manages user permissions state using Zustand
 * Provides permission checking utilities
 */
import { create } from 'zustand'
import type {
  UserPermissionItem,
  PermissionCondition,
} from '@/api/types/permission.types'

// ============================================================================
// Types
// ============================================================================

/**
 * Permission entry with effect and optional conditions
 */
export type PermissionEntry = {
  effect: 'ALLOW' | 'DENY'
  conditions?: PermissionCondition[]
}

/**
 * Normalized permission map structure
 * { resource: { action: { effect, conditions } } }
 */
export type PermissionMap = {
  [resource: string]: {
    [action: string]: PermissionEntry
  }
}

/**
 * Standard CRUD actions that 'manage' permission implies
 */
const MANAGE_ACTIONS = ['create', 'read', 'update', 'delete'] as const

// ============================================================================
// Permission Store
// ============================================================================

interface PermissionState {
  // Raw permissions from API
  permissions: UserPermissionItem[]

  // Normalized permission map for fast lookups
  permissionMap: PermissionMap

  // Loading state
  isLoading: boolean
  isLoaded: boolean

  // Actions
  setPermissions: (permissions: UserPermissionItem[]) => void
  clearPermissions: () => void
  setLoading: (loading: boolean) => void

  // Permission checking
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

/**
 * Normalize permissions array into a map for O(1) lookups
 */
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

/**
 * Check if a condition is satisfied given the context
 */
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

/**
 * Check if all conditions are satisfied
 */
function evaluateConditions(
  conditions: PermissionCondition[] | undefined,
  context?: Record<string, unknown>
): boolean {
  // No conditions = always allowed
  if (!conditions || conditions.length === 0) {
    return true
  }

  // If conditions exist but no context provided, deny access
  if (!context) {
    return false
  }

  // All conditions must be satisfied (AND logic)
  return conditions.every((condition) => evaluateCondition(condition, context))
}

export const usePermissionStore = create<PermissionState>()((set, get) => ({
  // Initial state
  permissions: [],
  permissionMap: {},
  isLoading: false,
  isLoaded: false,

  // Set permissions and normalize
  setPermissions: (permissions) => {
    const permissionMap = normalizePermissions(permissions)
    set({
      permissions,
      permissionMap,
      isLoaded: true,
      isLoading: false,
    })
  },

  // Clear all permissions
  clearPermissions: () => {
    set({
      permissions: [],
      permissionMap: {},
      isLoaded: false,
      isLoading: false,
    })
  },

  // Set loading state
  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  // Get permission entry for a resource:action
  getPermissionEntry: (resource, action) => {
    const { permissionMap } = get()

    // Direct match
    if (permissionMap[resource]?.[action]) {
      return permissionMap[resource][action]
    }

    // Check 'manage' permission (includes all CRUD actions)
    if (MANAGE_ACTIONS.includes(action as (typeof MANAGE_ACTIONS)[number])) {
      if (permissionMap[resource]?.['manage']) {
        return permissionMap[resource]['manage']
      }
    }

    return null
  },

  /**
   * Check if user has permission for resource:action
   * Used for UI-level checks (sidebar, menu, route guard)
   * Does NOT evaluate conditions
   */
  can: (resource, action) => {
    const entry = get().getPermissionEntry(resource, action)

    if (!entry) {
      return false
    }

    // For UI-level checks, ALLOW without conditions = true
    // If permission has conditions, we still allow UI visibility
    // but the actual action should be checked with canWithContext
    return entry.effect === 'ALLOW'
  },

  /**
   * Check if user has permission with context evaluation
   * Used for action-level checks (buttons, forms)
   * Evaluates conditions against provided context
   */
  canWithContext: (resource, action, context) => {
    const entry = get().getPermissionEntry(resource, action)

    if (!entry) {
      return false
    }

    // Check effect
    if (entry.effect === 'DENY') {
      return false
    }

    // Evaluate conditions
    return evaluateConditions(entry.conditions, context)
  },
}))

// ============================================================================
// Selector Hooks (for performance optimization)
// Using primitive selectors to avoid object identity issues
// ============================================================================

/**
 * Get isLoaded state only (primitive)
 */
export const useIsPermissionLoaded = () =>
  usePermissionStore((state) => state.isLoaded)

/**
 * Get isLoading state only (primitive)
 */
export const useIsPermissionLoading = () =>
  usePermissionStore((state) => state.isLoading)

/**
 * Get permissionMap for external computations
 * Note: Returns object reference, use carefully
 */
export const usePermissionMap = () =>
  usePermissionStore((state) => state.permissionMap)
