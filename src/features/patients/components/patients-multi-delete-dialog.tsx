
import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useBulkDeletePatients } from '../data/use-patients'
import type { Patient } from '../types'

type PatientsMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<Patient>
}

const CONFIRM_TEXT = 'delete all'

export function PatientsMultiDeleteDialog({
  open,
  onOpenChange,
  table,
}: PatientsMultiDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { mutate: bulkDelete, isPending } = useBulkDeletePatients()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim().toLowerCase() !== CONFIRM_TEXT) return

    const ids = selectedRows.map((row) => row.original.id)
    bulkDelete(ids, {
      onSuccess: () => {
        table.toggleAllPageRowsSelected(false)
        onOpenChange(false)
        setValue('')
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) setValue('')
      }}
      handleConfirm={handleDelete}
      disabled={value.trim().toLowerCase() !== CONFIRM_TEXT || isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Delete Multiple Patients
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{selectedRows.length}</span> patient(s)?
            <br />
            This action will soft delete all selected patients. They can be
            restored later if needed.
          </p>

          <div className='max-h-[200px] overflow-y-auto rounded-md border p-3'>
            <p className='mb-2 text-sm font-semibold'>Selected patients:</p>
            <ul className='list-inside list-disc space-y-1 text-sm'>
              {selectedRows.map((row) => (
                <li key={row.id}>
                  {row.original.fullName}
                  {row.original.email && ` (${row.original.email})`}
                </li>
              ))}
            </ul>
          </div>

          <Label className='my-2'>
            Type <span className='font-bold'>&quot;{CONFIRM_TEXT}&quot;</span>{' '}
            to confirm:
          </Label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={CONFIRM_TEXT}
          />
        </div>
      }
      confirmText={isPending ? 'Deleting...' : 'Delete All'}
    />
  )
}
