import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { staffRoles } from '../data/data'
import { type Staff } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const staffsColumns: ColumnDef<Staff>[] = [
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
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
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
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('fullName')}
          </span>
        </div>
      )
    },
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
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='text-muted-foreground max-w-[500px] truncate'>
            {row.getValue('email')}
          </span>
        </div>
      )
    },
    enableSorting: true, // API supports sorting
    meta: {
      className: 'min-w-[200px]',
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const role = staffRoles.find(
        (role) => role.value === row.getValue('role')
      )

      if (!role) {
        return null
      }

      const Icon = role.icon

      return (
        <div className='flex items-center'>
          <Icon className='text-muted-foreground me-2 h-4 w-4' />
          <span>{role.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false, // API does not support sorting by role
    meta: {
      className: 'min-w-[140px]',
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => {
      const phone = row.getValue<string | null>('phone')
      return (
        <span className='text-muted-foreground'>
          {phone || <span className='text-muted-foreground'>-</span>}
        </span>
      )
    },
    enableSorting: false, // API does not support sorting by phone
    meta: {
      className: 'min-w-[140px]',
    },
  },
  {
    accessorKey: 'isMale',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gender' />
    ),
    cell: ({ row }) => {
      const isMale = row.getValue<boolean | null>('isMale')
      if (isMale === null || isMale === undefined) {
        return <span className='text-muted-foreground'>-</span>
      }
      return (
        <Badge variant='outline' className='font-normal'>
          {isMale ? 'Male' : 'Female'}
        </Badge>
      )
    },
    filterFn: (row, _id, value) => {
      if (!value?.length) return true
      const isMale = row.original.isMale
      return value.includes(isMale)
    },
    enableSorting: false, // API does not support sorting by gender
    meta: {
      className: 'min-w-[100px]',
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt', // Map to API sortBy field
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const dateString = row.getValue<string>('createdAt')
      if (!dateString) return <span className='text-muted-foreground'>-</span>

      const date = new Date(dateString)
      return (
        <span className='text-muted-foreground'>
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      )
    },
    enableSorting: true, // API supports sorting
    meta: {
      className: 'min-w-[130px]',
    },
  },
  {
    id: 'actions',
    enablePinning: true,
    cell: DataTableRowActions,
    meta: {
      className: 'w-[50px] sticky right-0 bg-background',
    },
  },
]
