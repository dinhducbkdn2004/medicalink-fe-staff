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

const CONFIRM_TEXT = 'delete all'

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
      `Successfully deleted ${selectedRows.length} doctor(s):`
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
          Delete Multiple Doctors
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{selectedRows.length}</span> doctor(s)?
            <br />
            This action will permanently remove all selected doctors from the
            system. This cannot be undone.
          </p>

          <div className='max-h-[200px] overflow-y-auto rounded-md border p-3'>
            <p className='mb-2 text-sm font-semibold'>Selected doctors:</p>
            <ul className='list-inside list-disc space-y-1 text-sm'>
              {selectedRows.map((row) => (
                <li key={row.id}>
                  {row.original.fullName} ({row.original.email})
                </li>
              ))}
            </ul>
          </div>

          <Label className='my-2'>
            Type &quot;{CONFIRM_TEXT}&quot; to confirm:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_TEXT}" to confirm`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete All'
      destructive
    />
  )
}
