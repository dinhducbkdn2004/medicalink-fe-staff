/**
 * Office Hours Data Table Bulk Actions
 * Bulk actions for selected office hours
 */
import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type OfficeHour } from '../data/schema'
import { useBulkDeleteOfficeHours } from '../data/use-office-hours'

interface DataTableBulkActionsProps {
  table: Table<OfficeHour>
}

export function DataTableBulkActions({
  table,
}: Readonly<DataTableBulkActionsProps>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteMutation = useBulkDeleteOfficeHours()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row) => row.original.id)

  const handleBulkDelete = async () => {
    await deleteMutation.mutateAsync(selectedIds)
    setShowDeleteDialog(false)
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='office hour'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteDialog(true)}
              className='size-8'
              aria-label='Delete selected office hours'
              title='Delete selected office hours'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected office hours</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected office hours</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Office Hours</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} office hour
              {selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={deleteMutation.isPending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
