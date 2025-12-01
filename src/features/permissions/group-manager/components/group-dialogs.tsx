/**
 * Group Dialogs
 * Container for all group management dialogs
 */
import { GroupDeleteDialog } from './group-delete-dialog'
import { GroupFormDialog } from './group-form-dialog'
import { GroupPermissionsDialog } from './group-permissions-dialog'
import { useGroupManager } from './use-group-manager'

export function GroupDialogs() {
  const { open, setOpen } = useGroupManager()

  return (
    <>
      <GroupFormDialog
        open={open === 'create' || open === 'edit'}
        onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
      />
      <GroupDeleteDialog
        open={open === 'delete'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)}
      />
      <GroupPermissionsDialog
        open={open === 'permissions'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'permissions' : null)}
      />
    </>
  )
}
