
import { PatientsCreateDialog } from './patients-create-dialog'
import { PatientsDeleteDialog } from './patients-delete-dialog'
import { PatientsEditDialog } from './patients-edit-dialog'
import { PatientsRestoreDialog } from './patients-restore-dialog'

export function PatientsDialogs() {
  return (
    <>
      <PatientsCreateDialog />
      <PatientsEditDialog />
      <PatientsDeleteDialog />
      <PatientsRestoreDialog />
    </>
  )
}
