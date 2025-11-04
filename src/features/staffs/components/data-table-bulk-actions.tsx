import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import type { Staff } from '../data/schema'
import { StaffsMultiDeleteDialog } from './staffs-multi-delete-dialog'

type DataTableBulkActionsProps = {
  table: Table<Staff>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='staff'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected staffs'
              title='Delete selected staffs'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected staffs</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected staffs</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <StaffsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
