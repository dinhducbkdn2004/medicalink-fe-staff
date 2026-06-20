import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Staff } from '../data/schema'
import { useDeleteStaff } from '../data/use-staffs'

type StaffDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Staff
}

export function StaffsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: StaffDeleteDialogProps) {
  const [value, setValue] = useState('')
  const deleteMutation = useDeleteStaff()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.email) return

    try {
      await deleteMutation.mutateAsync(currentRow.id)
      onOpenChange(false)
      setValue('')
    } catch (error) {
      
      console.error('Xóa nhân viên thất bại:', error)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) setValue('')
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.email || deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Xóa nhân viên
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Bạn có chắc chắn muốn xóa{' '}
            <span className='font-bold'>{currentRow.fullName}</span>?
            <br />
            Thao tác này sẽ xóa vĩnh viễn nhân viên có vai trò
            là <span className='font-bold'>{currentRow.role}</span> khỏi
            hệ thống. Hành động này không thể hoàn tác.
          </p>

          <Label className='my-2'>
            Địa chỉ email:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Nhập địa chỉ email để xác nhận xóa.'
              disabled={deleteMutation.isPending}
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
      confirmText={deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
      destructive
    />
  )
}
