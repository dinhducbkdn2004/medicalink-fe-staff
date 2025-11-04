/**
 * Doctors Table Columns Definition
 * Column definitions for doctor account management table
 */
import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import type { DoctorWithProfile } from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const doctorsColumns: ColumnDef<DoctorWithProfile>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
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
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Full Name' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-[500px] truncate font-medium'>
          {row.getValue('fullName')}
        </span>
      </div>
    ),
    enableSorting: true, // API supports sorting
    meta: {
      className: 'min-w-[150px]',
      thClassName:
        'sticky left-[32px] z-20 bg-background shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]',
      tdClassName:
        'sticky left-[32px] z-10 bg-background shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='text-muted-foreground max-w-[500px] truncate'>
          {row.getValue('email')}
        </span>
      </div>
    ),
    enableSorting: true, // API supports sorting
    meta: {
      className: 'min-w-[200px]',
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null
      if (!phone) return <span className='text-muted-foreground'>-</span>
      return <span className='text-muted-foreground'>{phone}</span>
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[140px]',
    },
  },
  {
    id: 'specialties',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Specialties' />
    ),
    cell: ({ row }) => {
      // Backend returns flat structure with specialties at root level
      const specialties = row.original.specialties || []
      if (specialties.length === 0)
        return <span className='text-muted-foreground'>-</span>

      return (
        <div className='flex flex-wrap gap-1'>
          {specialties.slice(0, 2).map((specialty) => (
            <Badge key={specialty.id} variant='secondary' className='text-xs'>
              {specialty.name}
            </Badge>
          ))}
          {specialties.length > 2 && (
            <Badge variant='outline' className='text-xs'>
              +{specialties.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'workLocations',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Work Locations' />
    ),
    cell: ({ row }) => {
      // Backend returns flat structure with workLocations at root level
      const locations = row.original.workLocations || []
      if (locations.length === 0)
        return <span className='text-muted-foreground'>-</span>

      return (
        <div className='flex flex-wrap gap-1'>
          {locations.slice(0, 2).map((location) => (
            <Badge key={location.id} variant='outline' className='text-xs'>
              {location.name}
            </Badge>
          ))}
          {locations.length > 2 && (
            <Badge variant='outline' className='text-xs'>
              +{locations.length - 2}
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'isMale',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gender' />
    ),
    cell: ({ row }) => {
      const isMale = row.getValue('isMale') as boolean | null
      if (isMale === null)
        return <span className='text-muted-foreground'>-</span>
      return (
        <Badge variant='outline' className='text-xs'>
          {isMale ? 'Male' : 'Female'}
        </Badge>
      )
    },
    filterFn: (row, _id, value) => {
      const isMale = row.original.isMale
      return value.includes(isMale)
    },
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      // Backend returns flat structure with isActive at root level
      const isActive = row.getValue('isActive') as boolean
      return (
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
      )
    },
    filterFn: (row, _id, value) => {
      // Backend returns flat structure with isActive at root level
      const isActive = row.original.isActive ?? false
      return value.includes(isActive)
    },
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt', // Map to API sortBy field (API expects 'createdAt', not 'createdAt')
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      if (!date) return <div className='text-muted-foreground text-sm'>-</div>

      return (
        <div className='text-muted-foreground text-sm'>
          {format(new Date(date), 'MMM dd, yyyy')}
        </div>
      )
    },
    enableSorting: true, // API supports sorting
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
    meta: {
      className: 'w-[60px]',
      thClassName:
        'sticky right-0 z-20 bg-background shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]',
      tdClassName:
        'sticky right-0 z-10 bg-background shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)] group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
    },
  },
]
