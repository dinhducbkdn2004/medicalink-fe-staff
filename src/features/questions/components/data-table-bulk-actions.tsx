
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
import { canUpdateQuestions, canDeleteQuestion } from '../utils/permissions'

interface DataTableBulkActionsProps {
  table: Table<Question>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm] = useState(false)

  
  const hasUpdatePermission = canUpdateQuestions()
  const hasDeletePermission = canDeleteQuestion()

  
  if (!hasUpdatePermission && !hasDeletePermission) {
    return null
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='question'>
        {hasUpdatePermission && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => {
                    
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
          </>
        )}

        {hasDeletePermission && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='destructive'
                size='icon'
                onClick={() => {
                  
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
        )}
      </BulkActionsToolbar>

      {}
      {showDeleteConfirm && <div>Multi-delete dialog placeholder</div>}
    </>
  )
}
