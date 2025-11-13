/**
 * Questions Data Table Bulk Actions
 * Bulk actions for selected questions
 */
import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Question } from '../data/schema'

interface DataTableBulkActionsProps {
  table: Table<Question>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='question'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => {
                // TODO: Implement bulk approve
              }}
              className='size-8'
              aria-label='Approve selected questions'
              title='Approve selected questions'
            >
              <CheckCircle />
              <span className='sr-only'>Approve selected questions</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Approve selected questions</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => {
                // TODO: Implement bulk reject
              }}
              className='size-8'
              aria-label='Reject selected questions'
              title='Reject selected questions'
            >
              <XCircle />
              <span className='sr-only'>Reject selected questions</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reject selected questions</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => {
                // TODO: Implement bulk delete dialog
              }}
              className='size-8'
              aria-label='Delete selected questions'
              title='Delete selected questions'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected questions</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected questions</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      {/* TODO: Add Multi-Delete Dialog */}
      {showDeleteConfirm && <div>Multi-delete dialog placeholder</div>}
    </>
  )
}
