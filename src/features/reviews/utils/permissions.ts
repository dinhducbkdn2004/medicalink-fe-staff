import { can, canWithContext } from '@/lib/permission-utils'

export const ReviewPermissions = {
  READ: { resource: 'reviews', action: 'read' },
  CREATE: { resource: 'reviews', action: 'create' },
  UPDATE: { resource: 'reviews', action: 'update' },
  DELETE: { resource: 'reviews', action: 'delete' },
  MANAGE: { resource: 'reviews', action: 'manage' },
} as const

export function canReadReviews(): boolean {
  return can('reviews', 'read')
}

export function canCreateReviews(): boolean {
  return can('reviews', 'create')
}

export function canUpdateReviews(): boolean {
  return can('reviews', 'update')
}

export function canDeleteReviews(): boolean {
  return can('reviews', 'delete')
}

export function canManageReviews(): boolean {
  return can('reviews', 'manage')
}

export function canEditReview(context?: Record<string, unknown>): boolean {
  return canWithContext('reviews', 'update', context)
}

export function canDeleteReview(context?: Record<string, unknown>): boolean {
  return canWithContext('reviews', 'delete', context)
}

export function getReviewActions() {
  return {
    canRead: canReadReviews(),
    canCreate: canCreateReviews(),
    canUpdate: canUpdateReviews(),
    canDelete: canDeleteReviews(),
    canManage: canManageReviews(),
  }
}
