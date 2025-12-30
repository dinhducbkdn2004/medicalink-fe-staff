
import type { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Review } from '../data/schema'





interface DataTableBulkActionsProps {
  table: Table<Review>
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
        className='border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
        onClick={() => {
          
          
        }}
      >
        <Trash2 className='mr-2 size-4' />
        Delete ({selectedRows.length})
      </Button>
    </div>
  )
}
