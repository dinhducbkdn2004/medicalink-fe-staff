
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type PermissionGroup } from '@/api/types/permission.types'
import { GroupMultiDeleteDialog } from './group-multi-delete-dialog'

type DataTableBulkActionsProps = {
  table: Table<PermissionGroup>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='group'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteDialog(true)}
              className='size-8'
              aria-label='Xóa các nhóm đã chọn'
              title='Xóa các nhóm đã chọn'
            >
              <Trash2 />
              <span className='sr-only'>Xóa các nhóm đã chọn</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xóa các nhóm đã chọn</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <GroupMultiDeleteDialog
        table={table}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}

