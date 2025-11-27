/**
 * Work Locations Table Columns
 * Column definitions for work locations data table
 */
import { type ColumnDef } from '@tanstack/react-table'
import { MapPin, Phone, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type WorkLocation } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const workLocationsColumns: ColumnDef<WorkLocation>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-0.5'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-0.5'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'w-[50px] max-w-[50px]',
      thClassName:
        'sticky left-0 z-20 bg-background shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]',
      tdClassName:
        'sticky left-0 z-10 bg-background shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Location Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>{row.original.name}</span>
          {row.original.slug && (
            <span className='text-muted-foreground text-xs'>
              {row.original.slug}
            </span>
          )}
        </div>
      )
    },
    meta: {
      className: 'min-w-[200px]',
      thClassName:
        'sticky left-[32px] z-20 bg-background shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]',
      tdClassName:
        'sticky left-[32px] z-10 bg-background shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
    },
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      const address = row.original.address
      return (
        <div className='flex items-start gap-2'>
          {address && (
            <MapPin className='text-muted-foreground mt-0.5 size-4 shrink-0' />
          )}
          <div className='max-w-[300px] truncate' title={address || ''}>
            {address || '-'}
          </div>
        </div>
      )
    },
    meta: {
      className: 'min-w-[250px]',
    },
  },
  {
    accessorKey: 'phone',
    header: 'Contact',
    cell: ({ row }) => {
      const phone = row.original.phone
      return (
        <div className='flex items-center gap-2'>
          {phone && <Phone className='text-muted-foreground size-4' />}
          <span className='text-sm'>{phone || '-'}</span>
        </div>
      )
    },
    meta: {
      className: 'w-[150px]',
    },
  },
  {
    accessorKey: 'timezone',
    header: 'Timezone',
    cell: ({ row }) => {
      const timezone = row.original.timezone
      return (
        <div className='flex items-center gap-2'>
          <Clock className='text-muted-foreground size-4' />
          <span className='text-muted-foreground text-sm'>
            {timezone || 'Asia/Ho_Chi_Minh'}
          </span>
        </div>
      )
    },
    meta: {
      className: 'w-[180px]',
    },
  },
  {
    accessorKey: 'doctorsCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Doctors' />
    ),
    cell: ({ row }) => {
      const count = row.original.doctorsCount || 0
      return (
        <div className='text-center'>
          <Badge variant='secondary' className='font-mono'>
            {count}
          </Badge>
        </div>
      )
    },
    meta: {
      className: 'w-[100px] text-center',
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <div className='flex justify-center'>
          <Badge
            variant={isActive ? 'default' : 'secondary'}
            className={cn(
              isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
            )}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      )
    },
    filterFn: (row, _id, value: string[]) => {
      if (!value || value.length === 0) return true
      const isActive = row.original.isActive
      return value.includes(isActive ? 'true' : 'false')
    },
    meta: {
      className: 'w-[100px]',
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created Date' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <div className='text-muted-foreground text-sm'>
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )
    },
    meta: {
      className: 'w-[140px]',
    },
  },
  {
    id: 'actions',
    enablePinning: true,
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: 'w-[70px] sticky right-0 bg-background',
    },
  },
]
