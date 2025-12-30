import { can, canWithContext } from '@/lib/permission-utils'

export const QuestionPermissions = {
  READ: { resource: 'questions', action: 'read' },
  CREATE: { resource: 'questions', action: 'create' },
  UPDATE: { resource: 'questions', action: 'update' },
  DELETE: { resource: 'questions', action: 'delete' },
  MANAGE: { resource: 'questions', action: 'manage' },
} as const

export function canReadQuestions(): boolean {
  return can('questions', 'read')
}

export function canCreateQuestions(): boolean {
  return can('questions', 'create')
}

export function canUpdateQuestions(): boolean {
  return can('questions', 'update')
}

export function canDeleteQuestions(): boolean {
  return can('questions', 'delete')
}

export function canManageQuestions(): boolean {
  return can('questions', 'manage')
}

export function canEditQuestion(context?: Record<string, unknown>): boolean {
  return canWithContext('questions', 'update', context)
}

export function canDeleteQuestion(context?: Record<string, unknown>): boolean {
  return canWithContext('questions', 'delete', context)
}

export function getQuestionActions() {
  return {
    canRead: canReadQuestions(),
    canCreate: canCreateQuestions(),
    canUpdate: canUpdateQuestions(),
    canDelete: canDeleteQuestions(),
    canManage: canManageQuestions(),
  }
}
