/**
 * Group Delete Dialog
 * Confirmation dialog for deleting permission groups
 */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeletePermissionGroup } from '../../hooks'
import { useGroupManager } from './group-manager-provider'

type GroupDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GroupDeleteDialog({
  open,
  onOpenChange,
}: GroupDeleteDialogProps) {
  const { currentGroup, setCurrentGroup } = useGroupManager()
  const deleteMutation = useDeletePermissionGroup()

  const handleDelete = async () => {
    if (!currentGroup) return

    try {
      await deleteMutation.mutateAsync(currentGroup.id)
      handleClose()
    } catch {
      // Error handling is done in mutation hook
    }
  }

  const handleClose = () => {
    setCurrentGroup(null)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Permission Group</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the group{' '}
            <span className='font-semibold'>{currentGroup?.name}</span>?
            <br />
            <br />
            This action cannot be undone. All permissions assigned to this group
            will be removed, and users in this group will lose inherited
            permissions.
            {currentGroup?.memberCount && currentGroup.memberCount > 0 && (
              <>
                <br />
                <br />
                <span className='text-destructive font-semibold'>
                  Warning: This group has {currentGroup.memberCount} member(s).
                </span>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Group'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
