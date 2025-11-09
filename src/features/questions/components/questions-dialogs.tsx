/**
 * Questions Dialogs
 * All dialog components for questions management
 */
import { QuestionsDeleteDialog } from './questions-delete-dialog'
import { QuestionsApproveDialog } from './questions-approve-dialog'
import { QuestionsRejectDialog } from './questions-reject-dialog'
import { QuestionViewDialog } from './questions-view-dialog'
import { QuestionAnswersDialog } from './questions-answers-dialog'

export function QuestionsDialogs() {
  return (
    <>
      <QuestionViewDialog />
      <QuestionAnswersDialog />
      <QuestionsDeleteDialog />
      <QuestionsApproveDialog />
      <QuestionsRejectDialog />
    </>
  )
}

