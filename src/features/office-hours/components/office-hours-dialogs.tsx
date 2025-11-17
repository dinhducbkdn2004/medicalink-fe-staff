/**
 * Office Hours Dialogs
 * Container for all office hours dialogs
 */
import { OfficeHoursActionDialog } from './office-hours-action-dialog'
import { OfficeHoursDeleteDialog } from './office-hours-delete-dialog'

export function OfficeHoursDialogs() {
  return (
    <>
      <OfficeHoursActionDialog />
      <OfficeHoursDeleteDialog />
    </>
  )
}
