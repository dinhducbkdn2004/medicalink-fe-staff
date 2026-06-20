import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Staff } from '../data/schema'

type StaffMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<Staff>
}

const CONFIRM_TEXT = 'xóa tất cả'

export function StaffsMultiDeleteDialog({
  open,
  onOpenChange,
  table,
}: StaffMultiDeleteDialogProps) {
  const [value, setValue] = useState('')
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim().toLowerCase() !== CONFIRM_TEXT) return

    table.toggleAllPageRowsSelected(false)
    onOpenChange(false)
    showSubmittedData(
      selectedRows.map((row) => row.original),
      `Xóa thành công ${selectedRows.length} nhân viên:`
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
          Xóa nhiều nhân viên
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Bạn có chắc chắn muốn xóa{' '}
            <span className='font-bold'>{selectedRows.length}</span> nhân
            viên?
            <br />
            Thao tác này sẽ xóa vĩnh viễn tất cả nhân viên đã chọn khỏi hệ thống.
            Hành động này không thể hoàn tác.
          </p>

          <div className='max-h-[200px] overflow-y-auto rounded-md border p-3'>
            <p className='mb-2 text-sm font-semibold'>
              Các nhân viên đã chọn:
            </p>
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
