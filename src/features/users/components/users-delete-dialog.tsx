import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')

  const handleDelete = () => {
    if (value.trim() !== currentRow.username) return

    onOpenChange(false)
    showSubmittedData(currentRow, 'Người dùng sau đã bị xóa:')
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.username}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Xóa người dùng
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Bạn có chắc chắn muốn xóa{' '}
            <span className='font-bold'>{currentRow.username}</span>?
            <br />
            Thao tác này sẽ xóa vĩnh viễn người dùng có vai trò{' '}
            <span className='font-bold'>
              {currentRow.role.toUpperCase()}
            </span>{' '}
            khỏi hệ thống. Hành động này không thể hoàn tác.
          </p>

          <Label className='my-2'>
            Tên người dùng:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Nhập tên người dùng để xác nhận xóa.'
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
      confirmText='Xóa'
      destructive
    />
  )
}
