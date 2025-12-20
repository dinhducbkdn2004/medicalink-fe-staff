/**
 * Doctors Dialogs Wrapper
 * Renders all doctor management dialogs
 */
import { DoctorsCreateDialog } from './doctors-create-dialog'
import { DoctorsDeleteDialog } from './doctors-delete-dialog'
import { DoctorsEditDialog } from './doctors-edit-dialog'
import { DoctorsStatsDialogWrapper } from './doctors-stats-dialog-wrapper'
import { DoctorsToggleActiveDialog } from './doctors-toggle-active-dialog'

export function DoctorsDialogs() {
  return (
    <>
      <DoctorsCreateDialog />
      <DoctorsEditDialog />
      <DoctorsDeleteDialog />
      <DoctorsToggleActiveDialog />
      <DoctorsStatsDialogWrapper />
    </>
  )
}
