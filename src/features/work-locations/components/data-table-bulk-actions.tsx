
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

  
  const hasDeletePermission = canDeleteWorkLocation()

  
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

      {}
      {showDeleteConfirm && <div>Multi-delete dialog placeholder</div>}
    </>
  )
}
