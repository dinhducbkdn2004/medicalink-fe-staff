/**
 * Doctors Dialogs Wrapper
 * Renders all doctor management dialogs
 */

import { DoctorsCreateDialog } from './doctors-create-dialog'
import { DoctorsEditDialog } from './doctors-edit-dialog'
import { DoctorsDeleteDialog } from './doctors-delete-dialog'
import { DoctorsToggleActiveDialog } from './doctors-toggle-active-dialog'

export function DoctorsDialogs() {
  return (
    <>
      <DoctorsCreateDialog />
      <DoctorsEditDialog />
      <DoctorsDeleteDialog />
      <DoctorsToggleActiveDialog />
    </>
  )
}

