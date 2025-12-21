/**
 * Work Locations Data Table Bulk Actions
 * Bulk actions for selected work locations
 */
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
import { type WorkLocation } from '../data/schema'
import { canDeleteWorkLocation } from '../utils/permissions'

interface DataTableBulkActionsProps {
  table: Table<WorkLocation>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm] = useState(false)

  // Check if user has delete permission
  const hasDeletePermission = canDeleteWorkLocation()

  // Don't show bulk actions if user doesn't have delete permission
  if (!hasDeletePermission) {
    return null
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='work location'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => {
                // TODO: Implement bulk delete dialog
              }}
              className='size-8'
              aria-label='Delete selected work locations'
              title='Delete selected work locations'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected work locations</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected work locations</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      {/* TODO: Add Multi-Delete Dialog */}
      {showDeleteConfirm && <div>Multi-delete dialog placeholder</div>}
    </>
  )
}
