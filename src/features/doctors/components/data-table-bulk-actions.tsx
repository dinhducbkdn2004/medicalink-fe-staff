import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import type { DoctorWithProfile } from '../types'
import { canDeleteDoctor, canToggleActive } from '../utils/permissions'
import { DoctorsMultiDeleteDialog } from './doctors-multi-delete-dialog'
import { useDoctors } from './doctors-provider'

type DataTableBulkActionsProps = {
  table: Table<DoctorWithProfile>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { setOpen, setCurrentRow } = useDoctors()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  
  const hasDeletePermission = canDeleteDoctor(false)
  const hasTogglePermission = canToggleActive()

  
  if (!hasDeletePermission && !hasTogglePermission) {
    return null
  }

  const handleBulkToggleActive = (_isActive: boolean) => {
    
    
    const firstDoctor = selectedRows[0]?.original
    if (firstDoctor) {
      setCurrentRow(firstDoctor)
      setOpen('toggleActive')
      table.resetRowSelection()
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='doctor'>
        {hasTogglePermission && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleBulkToggleActive(false)}
                className='size-8'
                aria-label='Ngừng hoạt động các bác sĩ đã chọn'
                title='Ngừng hoạt động các bác sĩ đã chọn'
              >
                <Power />
                <span className='sr-only'>Ngừng hoạt động các bác sĩ đã chọn</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ngừng hoạt động các bác sĩ đã chọn</p>
            </TooltipContent>
          </Tooltip>
        )}

        {hasDeletePermission && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='destructive'
                size='icon'
                onClick={() => setShowDeleteConfirm(true)}
                className='size-8'
                aria-label='Xóa các bác sĩ đã chọn'
                title='Xóa các bác sĩ đã chọn'
              >
                <Trash2 />
                <span className='sr-only'>Xóa các bác sĩ đã chọn</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Xóa các bác sĩ đã chọn</p>
            </TooltipContent>
          </Tooltip>
        )}
      </BulkActionsToolbar>

      <DoctorsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
