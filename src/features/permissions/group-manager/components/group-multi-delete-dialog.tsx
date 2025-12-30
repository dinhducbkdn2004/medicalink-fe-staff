import { type Table } from '@tanstack/react-table'
import { type PermissionGroup } from '@/api/types/permission.types'
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

type GroupMultiDeleteDialogProps = {
  table: Table<PermissionGroup>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GroupMultiDeleteDialog({
  table,
  open,
  onOpenChange,
}: GroupMultiDeleteDialogProps) {
  const deleteMutation = useDeletePermissionGroup()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const handleDelete = async () => {
    try {
      for (const row of selectedRows) {
        await deleteMutation.mutateAsync(row.original.id)
      }

      table.resetRowSelection()
      onOpenChange(false)
    } catch {
      void 0
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {selectedCount}{' '}
            {selectedCount === 1 ? 'group' : 'groups'}. This action cannot be
            undone.
            <br />
            <br />
            <strong>Groups to be deleted:</strong>
            <ul className='mt-2 list-inside list-disc'>
              {selectedRows.slice(0, 5).map((row) => (
                <li key={row.original.id} className='text-sm'>
                  {row.original.name}
                </li>
              ))}
              {selectedRows.length > 5 && (
                <li className='text-sm'>
                  and {selectedRows.length - 5} more...
                </li>
              )}
            </ul>
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
            {deleteMutation.isPending
              ? 'Deleting...'
              : `Delete ${selectedCount} ${selectedCount === 1 ? 'Group' : 'Groups'}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
