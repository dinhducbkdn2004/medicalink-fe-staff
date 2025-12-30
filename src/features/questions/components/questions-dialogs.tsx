
import { QuestionAnswersDialog } from './questions-answers-dialog'
import { QuestionsApproveDialog } from './questions-approve-dialog'
import { QuestionsDeleteDialog } from './questions-delete-dialog'
import { QuestionsEditDialog } from './questions-edit-dialog'
import { QuestionsRejectDialog } from './questions-reject-dialog'
import { QuestionViewDialog } from './questions-view-dialog'

export function QuestionsDialogs() {
  return (
    <>
      <QuestionViewDialog />
      <QuestionsEditDialog />
      <QuestionAnswersDialog />
      <QuestionsDeleteDialog />
      <QuestionsApproveDialog />
      <QuestionsRejectDialog />
    </>
  )
}
