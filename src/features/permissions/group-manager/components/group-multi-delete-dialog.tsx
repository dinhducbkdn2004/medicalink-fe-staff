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
          <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ xóa vĩnh viễn {selectedCount} nhóm. Không thể hoàn tác.
            <br />
            <br />
            <strong>Các nhóm sẽ bị xóa:</strong>
            <ul className='mt-2 list-inside list-disc'>
              {selectedRows.slice(0, 5).map((row) => (
                <li key={row.original.id} className='text-sm'>
                  {row.original.name}
                </li>
              ))}
              {selectedRows.length > 5 && (
                <li className='text-sm'>
                  và {selectedRows.length - 5} nhóm khác...
                </li>
              )}
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteMutation.isPending
              ? 'Đang xóa...'
              : `Xóa ${selectedCount} nhóm`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
