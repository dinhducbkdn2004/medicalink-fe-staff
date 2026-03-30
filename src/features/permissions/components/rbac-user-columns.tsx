import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { staffRoles } from '@/features/staffs/data/data'
import { type Staff } from '@/features/staffs/data/schema'
import { RbacUserRowActions } from './rbac-user-row-actions'

type RbacUserColumnsOptions = {
  manageTo: '/user-permission/$userId' | '/user-group/$userId'
  manageLabel: string
}

export function createRbacUserColumns({
  manageTo,
  manageLabel,
}: RbacUserColumnsOptions): ColumnDef<Staff>[] {
  return [
    {
      accessorKey: 'fullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Full name' />
      ),
      cell: ({ row }) => (
        <span className='max-w-[280px] truncate font-medium'>
          {row.getValue('fullName')}
        </span>
      ),
      enableSorting: true,
      meta: { className: 'min-w-[150px]' },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground max-w-[280px] truncate'>
          {row.getValue('email')}
        </span>
      ),
      enableSorting: true,
      meta: { className: 'min-w-[200px]' },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Role' />
      ),
      cell: ({ row }) => {
        const value = row.getValue<string>('role')
        const role = staffRoles.find((r) => r.value === value)
        const Icon = role?.icon
        return (
          <div className='flex items-center gap-2'>
            {Icon ? <Icon className='text-muted-foreground h-4 w-4' /> : null}
            <span>{role?.label ?? value}</span>
          </div>
        )
      },
      filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
      enableSorting: false,
      meta: { className: 'min-w-[140px]' },
    },
    {
      accessorKey: 'phone',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Phone' />
      ),
      cell: ({ row }) => {
        const phone = row.getValue<string | null>('phone')
        return (
          <span className='text-muted-foreground'>{phone?.trim() || '—'}</span>
        )
      },
      enableSorting: false,
      meta: { className: 'min-w-[120px]' },
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created' />
      ),
      cell: ({ row }) => {
        const dateString = row.getValue<string>('createdAt')
        if (!dateString) return <span className='text-muted-foreground'>—</span>
        return (
          <span className='text-muted-foreground'>
            {new Date(dateString).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )
      },
      enableSorting: true,
      meta: { className: 'min-w-[120px]' },
    },
    {
      id: 'actions',
      enablePinning: true,
      cell: ({ row }) => (
        <RbacUserRowActions
          row={row}
          manageTo={manageTo}
          manageLabel={manageLabel}
        />
      ),
      meta: {
        className: 'w-[50px] sticky right-0 bg-background',
      },
    },
  ]
}
