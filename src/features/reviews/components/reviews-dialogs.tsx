/**
 * Reviews Dialogs
 * Container component for all review-related dialogs
 */
import { ReviewViewDialog } from './reviews-view-dialog'
import { ReviewApproveDialog } from './reviews-approve-dialog'
import { ReviewDeleteDialog } from './reviews-delete-dialog'

// ============================================================================
// Component
// ============================================================================

export function ReviewsDialogs() {
  return (
    <>
      <ReviewViewDialog />
      <ReviewApproveDialog />
      <ReviewDeleteDialog />
    </>
  )
}

