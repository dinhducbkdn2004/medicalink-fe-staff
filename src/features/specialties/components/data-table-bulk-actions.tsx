/**
 * Data Table Bulk Actions
 * Actions for multiple selected rows
 */
import { Table } from '@tanstack/react-table'
import { Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type Specialty } from '../data/schema'

interface DataTableBulkActionsProps {
  table: Table<Specialty>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length

  if (selectedCount === 0) return null

  return (
    <div className='fixed inset-x-0 bottom-4 z-50 mx-auto w-fit'>
      <div className='bg-background border-border shadow-2xl ring-ring/20 flex items-center gap-4 rounded-lg border px-4 py-3 ring-1 backdrop-blur-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full font-semibold'>
            {selectedCount}
          </div>
          <span className='text-sm font-medium'>
            {selectedCount === 1
              ? '1 specialty selected'
              : `${selectedCount} specialties selected`}
          </span>
        </div>

        <div className='bg-border h-6 w-px' />

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='hover:bg-destructive/10 hover:text-destructive h-8'
            onClick={() => {
              // TODO: Implement bulk delete
              // eslint-disable-next-line no-console
              console.log('Bulk delete:', selectedRows.map((r) => r.original))
            }}
          >
            <Trash2 className='mr-2 size-3.5' />
            Delete
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='h-8'
            onClick={() => table.toggleAllPageRowsSelected(false)}
          >
            <X className='mr-2 size-3.5' />
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}

