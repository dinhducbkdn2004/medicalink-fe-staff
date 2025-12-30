export type Permission = {
  id: string
  resource: string
  action: string
  description?: string
}

export type PermissionCondition = {
  field: string
  operator: 'eq' | 'ne' | 'in' | 'contains'
  value: unknown
}

export type PermissionEffect = 'ALLOW' | 'DENY'

export type UserPermissionItem = {
  resource: string
  action: string
  effect: PermissionEffect
  conditions?: PermissionCondition[]
}

export type UserPermissionSnapshot = UserPermissionItem[]

export type AssignUserPermissionRequest = {
  userId: string
  permissionId: string
  tenantId?: string
  effect?: PermissionEffect
  conditions?: PermissionCondition[]
}

export type RevokeUserPermissionRequest = {
  userId: string
  permissionId: string
  tenantId?: string
}

export type CheckPermissionRequest = {
  userId: string
  resource: string
  action: string
  tenantId?: string
  context?: Record<string, unknown>
}

export type CheckPermissionResponse = boolean

export type PermissionGroup = {
  id: string
  name: string
  description?: string
  tenantId: string
  isActive: boolean
  memberCount?: number
  permissionCount?: number
  createdAt: string
  updatedAt: string
}

export type CreatePermissionGroupRequest = {
  name: string
  description?: string
  tenantId?: string
  isActive?: boolean
}

export type UpdatePermissionGroupRequest = {
  name?: string
  description?: string
  isActive?: boolean
  tenantId?: string
}

export type PermissionGroupListResponse = PermissionGroup[]

export type GroupPermission = {
  id: string
  permissionId: string
  resource: string
  action: string
  description?: string
  effect: PermissionEffect
  conditions?: PermissionCondition[]
  createdAt: string
}

export type AssignGroupPermissionRequest = {
  permissionId: string
  tenantId?: string
  effect?: PermissionEffect
  conditions?: PermissionCondition[]
}

export type RevokeGroupPermissionRequest = {
  permissionId: string
  tenantId?: string
}

export type UserGroupMembership = {
  id: string
  groupId: string
  groupName: string
  groupDescription?: string
  tenantId: string
  createdAt: string
}

export type AddUserToGroupRequest = {
  groupId: string
  tenantId?: string
}

export type UserGroupMembershipListResponse = UserGroupMembership[]

export type MostUsedPermission = {
  permissionId: string
  resource: string
  action: string
  usageCount: number
}

export type LargestGroup = {
  groupId: string
  groupName: string
  memberCount: number
}

export type PermissionStats = {
  totalPermissions: number
  totalGroups: number
  totalUserPermissions: number
  totalGroupPermissions: number
  totalUserGroupMemberships: number
  mostUsedPermissions: MostUsedPermission[]
  largestGroups: LargestGroup[]
}

export type SuccessResponse = {
  success: boolean
  message: string
}

export type CacheResponse = {
  success: boolean
  message: string
  cacheKey?: string
}

export type PermissionQueryParams = {
  tenantId?: string
}

export type UserPermissionQueryParams = {
  userId: string
  tenantId?: string
}

export const RESOURCES = [
  'doctors',
  'patients',
  'staff',
  'specialties',
  'work-locations',
  'blogs',
  'questions',
  'reviews',
  'permissions',
] as const

export type Resource = (typeof RESOURCES)[number]

export const ACTIONS = ['read', 'create', 'update', 'delete', 'manage'] as const

export type Action = (typeof ACTIONS)[number]
