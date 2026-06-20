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
import { canDeleteSpecificStaff } from '../utils/permissions'
import { StaffsMultiDeleteDialog } from './staffs-multi-delete-dialog'

type DataTableBulkActionsProps = {
  table: Table<Staff>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  
  const hasDeletePermission = canDeleteSpecificStaff()

  
  if (!hasDeletePermission) {
    return null
  }

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
              aria-label='Xóa các nhân viên đã chọn'
              title='Xóa các nhân viên đã chọn'
            >
              <Trash2 />
              <span className='sr-only'>Xóa các nhân viên đã chọn</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xóa các nhân viên đã chọn</p>
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
