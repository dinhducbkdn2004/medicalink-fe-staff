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
import type { Patient } from '../types'
import { canDeletePatient } from '../utils/permissions'
import { PatientsMultiDeleteDialog } from './patients-multi-delete-dialog'

type DataTableBulkActionsProps = {
  table: Table<Patient>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  
  const hasDeletePermission = canDeletePatient()

  
  if (!hasDeletePermission) {
    return null
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='patient'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Xóa các bệnh nhân đã chọn'
              title='Xóa các bệnh nhân đã chọn'
            >
              <Trash2 />
              <span className='sr-only'>Xóa các bệnh nhân đã chọn</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xóa các bệnh nhân đã chọn</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <PatientsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
