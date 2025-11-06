/**
 * Group Manager Bulk Actions Component
 * Bulk actions for selected groups
 */
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
              aria-label='Delete selected groups'
              title='Delete selected groups'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected groups</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected groups</p>
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

