/**
 * Work Locations Data Table Bulk Actions
 * Bulk actions for selected work locations
 */
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type WorkLocation } from '../data/schema'

interface DataTableBulkActionsProps {
  table: Table<WorkLocation>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows

  if (selectedRows.length === 0) {
    return null
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        className='text-destructive hover:text-destructive'
        onClick={() => {
          // TODO: Implement bulk delete functionality
          const ids = selectedRows.map((row) => row.original.id)
          console.log('Bulk delete:', ids)
          // You can implement a bulk delete dialog here
        }}
      >
        <Trash2 className='mr-2 size-4' />
        Delete ({selectedRows.length})
      </Button>
    </div>
  )
}

