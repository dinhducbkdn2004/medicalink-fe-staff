
import { GroupDeleteDialog } from './group-delete-dialog'
import { GroupFormDialog } from './group-form-dialog'
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
    </>
  )
}
