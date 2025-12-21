/**
 * Review Permissions Utility
 * Helper functions to check user permissions for review operations
 */
import { can, canWithContext } from '@/lib/permission-utils'

/**
 * Review resource permissions
 */
export const ReviewPermissions = {
  READ: { resource: 'reviews', action: 'read' },
  CREATE: { resource: 'reviews', action: 'create' },
  UPDATE: { resource: 'reviews', action: 'update' },
  DELETE: { resource: 'reviews', action: 'delete' },
  MANAGE: { resource: 'reviews', action: 'manage' },
} as const

/**
 * Check if user can read reviews
 */
export function canReadReviews(): boolean {
  return can('reviews', 'read')
}

/**
 * Check if user can create reviews
 */
export function canCreateReviews(): boolean {
  return can('reviews', 'create')
}

/**
 * Check if user can update reviews
 */
export function canUpdateReviews(): boolean {
  return can('reviews', 'update')
}

/**
 * Check if user can delete reviews
 */
export function canDeleteReviews(): boolean {
  return can('reviews', 'delete')
}

/**
 * Check if user can manage reviews (full CRUD)
 */
export function canManageReviews(): boolean {
  return can('reviews', 'manage')
}

/**
 * Check if user can edit a specific review
 * Takes into account conditional permissions
 */
export function canEditReview(context?: Record<string, unknown>): boolean {
  return canWithContext('reviews', 'update', context)
}

/**
 * Check if user can delete a specific review
 * Takes into account conditional permissions
 */
export function canDeleteReview(context?: Record<string, unknown>): boolean {
  return canWithContext('reviews', 'delete', context)
}

/**
 * Get accessible review management actions
 */
export function getReviewActions() {
  return {
    canRead: canReadReviews(),
    canCreate: canCreateReviews(),
    canUpdate: canUpdateReviews(),
    canDelete: canDeleteReviews(),
    canManage: canManageReviews(),
  }
}
