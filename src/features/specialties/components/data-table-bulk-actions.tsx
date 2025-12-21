/**
 * Specialties Data Table Bulk Actions
 * Bulk actions for selected specialties
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
import { type Specialty } from '../data/schema'
import { canDeleteSpecialty } from '../utils/permissions'

interface DataTableBulkActionsProps {
  table: Table<Specialty>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm] = useState(false)

  // Check if user has delete permission
  const hasDeletePermission = canDeleteSpecialty()

  // Don't show bulk actions if user doesn't have delete permission
  if (!hasDeletePermission) {
    return null
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='specialty'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => {
                // TODO: Implement bulk delete dialog
              }}
              className='size-8'
              aria-label='Delete selected specialties'
              title='Delete selected specialties'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected specialties</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected specialties</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      {/* TODO: Add Multi-Delete Dialog */}
      {showDeleteConfirm && <div>Multi-delete dialog placeholder</div>}
    </>
  )
}
