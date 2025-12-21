/**
 * Question Permissions Utility
 * Helper functions to check user permissions for question operations
 */
import { can, canWithContext } from '@/lib/permission-utils'

/**
 * Question resource permissions
 */
export const QuestionPermissions = {
  READ: { resource: 'questions', action: 'read' },
  CREATE: { resource: 'questions', action: 'create' },
  UPDATE: { resource: 'questions', action: 'update' },
  DELETE: { resource: 'questions', action: 'delete' },
  MANAGE: { resource: 'questions', action: 'manage' },
} as const

/**
 * Check if user can read questions
 */
export function canReadQuestions(): boolean {
  return can('questions', 'read')
}

/**
 * Check if user can create questions
 */
export function canCreateQuestions(): boolean {
  return can('questions', 'create')
}

/**
 * Check if user can update questions
 */
export function canUpdateQuestions(): boolean {
  return can('questions', 'update')
}

/**
 * Check if user can delete questions
 */
export function canDeleteQuestions(): boolean {
  return can('questions', 'delete')
}

/**
 * Check if user can manage questions (full CRUD)
 */
export function canManageQuestions(): boolean {
  return can('questions', 'manage')
}

/**
 * Check if user can edit a specific question
 * Takes into account conditional permissions
 */
export function canEditQuestion(context?: Record<string, unknown>): boolean {
  return canWithContext('questions', 'update', context)
}

/**
 * Check if user can delete a specific question
 * Takes into account conditional permissions
 */
export function canDeleteQuestion(context?: Record<string, unknown>): boolean {
  return canWithContext('questions', 'delete', context)
}

/**
 * Get accessible question management actions
 */
export function getQuestionActions() {
  return {
    canRead: canReadQuestions(),
    canCreate: canCreateQuestions(),
    canUpdate: canUpdateQuestions(),
    canDelete: canDeleteQuestions(),
    canManage: canManageQuestions(),
  }
}
