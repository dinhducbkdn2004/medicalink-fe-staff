import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { DoctorWithProfile } from '../types'

type DoctorsMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<DoctorWithProfile>
}

const CONFIRM_TEXT = 'xóa tất cả'

export function DoctorsMultiDeleteDialog({
  open,
  onOpenChange,
  table,
}: DoctorsMultiDeleteDialogProps) {
  const [value, setValue] = useState('')
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim().toLowerCase() !== CONFIRM_TEXT) return

    table.toggleAllPageRowsSelected(false)
    onOpenChange(false)
    showSubmittedData(
      selectedRows.map((row) => row.original),
      `Đã xóa thành công ${selectedRows.length} bác sĩ:`
    )
    setValue('')
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) setValue('')
      }}
      handleConfirm={handleDelete}
      disabled={value.trim().toLowerCase() !== CONFIRM_TEXT}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Xóa nhiều Bác sĩ
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Bạn có chắc chắn muốn xóa{' '}
            <span className='font-bold'>{selectedRows.length}</span> bác sĩ không?
            <br />
            Hành động này sẽ xóa vĩnh viễn tất cả các bác sĩ đã chọn khỏi hệ thống.
            Không thể hoàn tác.
          </p>

          <div className='max-h-[200px] overflow-y-auto rounded-md border p-3'>
            <p className='mb-2 text-sm font-semibold'>Các bác sĩ đã chọn:</p>
            <ul className='list-inside list-disc space-y-1 text-sm'>
              {selectedRows.map((row) => (
                <li key={row.id}>
                  {row.original.fullName} ({row.original.email})
                </li>
              ))}
            </ul>
          </div>

          <Label className='my-2'>
            Nhập &quot;{CONFIRM_TEXT}&quot; để xác nhận:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Nhập "${CONFIRM_TEXT}" để xác nhận`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Cảnh báo!</AlertTitle>
            <AlertDescription>
              Vui lòng cẩn thận, thao tác này không thể hoàn tác.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Xóa tất cả'
      destructive
    />
  )
}
