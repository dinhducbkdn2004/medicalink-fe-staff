/**
 * Group Manager Table Columns
 * Column definitions for permission groups table
 */
import { type ColumnDef } from '@tanstack/react-table'
import type { PermissionGroup } from '@/api/types/permission.types'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { PermissionStatusBadge } from '../../components/permission-badge'
import { DataTableRowActions } from './data-table-row-actions'

export const groupColumns: ColumnDef<PermissionGroup>[] = [
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
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Group Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-2'>
          <span className='font-medium'>{row.getValue('name')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const description = row.getValue('description') as string | undefined
      return (
        <div className='max-w-md truncate'>
          {description || (
            <span className='text-muted-foreground italic'>No description</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'memberCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Members' />
    ),
    cell: ({ row }) => {
      const count = row.getValue('memberCount') as number
      return (
        <Badge variant='secondary' className='font-mono'>
          {count || 0}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'permissionCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Permissions' />
    ),
    cell: ({ row }) => {
      const count = row.getValue('permissionCount') as number
      return (
        <Badge variant='secondary' className='font-mono'>
          {count || 0}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return <PermissionStatusBadge isActive={isActive} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return (
        <span className='text-muted-foreground text-sm'>
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
    meta: {
      className: 'w-[50px]',
    },
  },
]
