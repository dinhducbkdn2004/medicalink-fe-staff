/**
 * Questions Dialogs
 * All dialog components for questions management
 */
import { QuestionsDeleteDialog } from './questions-delete-dialog'
import { QuestionsApproveDialog } from './questions-approve-dialog'
import { QuestionsRejectDialog } from './questions-reject-dialog'

export function QuestionsDialogs() {
  return (
    <>
      <QuestionsDeleteDialog />
      <QuestionsApproveDialog />
      <QuestionsRejectDialog />
      {/* TODO: Add View Dialog */}
      {/* TODO: Add Edit Dialog */}
      {/* TODO: Add View Answers Dialog */}
    </>
  )
}

