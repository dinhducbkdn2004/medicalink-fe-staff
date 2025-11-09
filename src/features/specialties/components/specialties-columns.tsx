/**
 * Specialties Table Columns
 * Column definitions for specialties data table
 */
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Specialty } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const specialtiesColumns: ColumnDef<Specialty>[] = [
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
      className: 'w-[50px]',
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-2'>
          {row.original.iconUrl && (
            <img
              src={row.original.iconUrl}
              alt={row.original.name}
              className='size-6 rounded object-cover'
            />
          )}
          <div className='flex flex-col'>
            <span className='font-medium'>{row.original.name}</span>
            {row.original.slug && (
              <span className='text-muted-foreground text-xs'>
                {row.original.slug}
              </span>
            )}
          </div>
        </div>
      )
    },
    meta: {
      className: 'min-w-[200px]',
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.original.description
      return (
        <div className='max-w-[300px] truncate' title={description || ''}>
          {description || '—'}
        </div>
      )
    },
    meta: {
      className: 'min-w-[200px]',
    },
  },
  {
    accessorKey: 'infoSectionsCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Info Sections' />
    ),
    cell: ({ row }) => {
      const count = row.original.infoSectionsCount || 0
      return (
        <div className='text-center'>
          <Badge variant='secondary' className='font-mono'>
            {count}
          </Badge>
        </div>
      )
    },
    meta: {
      className: 'w-[120px] text-center',
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
