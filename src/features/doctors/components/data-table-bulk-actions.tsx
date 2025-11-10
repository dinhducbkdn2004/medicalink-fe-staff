import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import type { DoctorWithProfile } from '../types'
import { DoctorsMultiDeleteDialog } from './doctors-multi-delete-dialog'
import { useDoctors } from './doctors-provider'

type DataTableBulkActionsProps = {
  table: Table<DoctorWithProfile>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { setOpen, setCurrentRow } = useDoctors()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkToggleActive = (_isActive: boolean) => {
    // For now, just show the first selected doctor in dialog
    // You can enhance this to support bulk status update in the future
    const firstDoctor = selectedRows[0]?.original
    if (firstDoctor) {
      setCurrentRow(firstDoctor)
      setOpen('toggleActive')
      table.resetRowSelection()
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='doctor'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkToggleActive(false)}
              className='size-8'
              aria-label='Deactivate selected doctors'
              title='Deactivate selected doctors'
            >
              <Power />
              <span className='sr-only'>Deactivate selected doctors</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deactivate selected doctors</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected doctors'
              title='Delete selected doctors'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected doctors</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected doctors</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <DoctorsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
