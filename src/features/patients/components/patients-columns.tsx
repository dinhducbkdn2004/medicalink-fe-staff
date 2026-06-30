
import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import type { Patient } from '../types'
import { DataTableRowActions } from './data-table-row-actions'

export const patientsColumns: ColumnDef<Patient>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Chọn tất cả'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Chọn hàng'
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
      <DataTableColumnHeader column={column} title='Họ và tên' />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        <span className='max-w-[500px] truncate font-medium'>
          {row.getValue('fullName')}
        </span>
      </div>
    ),
    enableSorting: true,
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
      const email = row.getValue<string | null>('email')
      if (!email) return <span className='text-muted-foreground'>-</span>
      return (
        <div className='flex space-x-2'>
          <span className='text-muted-foreground max-w-[500px] truncate'>
            {email}
          </span>
        </div>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[200px]',
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số điện thoại' />
    ),
    cell: ({ row }) => {
      const phone = row.getValue<string | null>('phone')
      if (!phone) return <span className='text-muted-foreground'>-</span>
      return <span className='text-muted-foreground'>{phone}</span>
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[140px]',
    },
  },
  {
    accessorKey: 'isMale',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Giới tính' />
    ),
    cell: ({ row }) => {
      const isMale = row.getValue<boolean | null>('isMale')
      if (isMale === null || isMale === undefined)
        return <span className='text-muted-foreground'>-</span>
      return (
        <Badge variant={isMale ? 'default' : 'secondary'}>
          {isMale ? 'Nam' : 'Nữ'}
        </Badge>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[100px]',
    },
  },
  {
    accessorKey: 'dateOfBirth',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày sinh' />
    ),
    cell: ({ row }) => {
      const dateOfBirth = row.getValue<string | null>('dateOfBirth')
      if (!dateOfBirth) return <span className='text-muted-foreground'>-</span>
      try {
        return (
          <span className='text-muted-foreground'>
            {format(new Date(dateOfBirth), 'dd/MM/yyyy')}
          </span>
        )
      } catch {
        return <span className='text-muted-foreground'>-</span>
      }
    },
    enableSorting: true,
    meta: {
      className: 'min-w-[120px]',
    },
  },
  {
    accessorKey: 'province',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tỉnh/Thành phố' />
    ),
    cell: ({ row }) => {
      const province = row.getValue<string | null>('province')
      if (!province) return <span className='text-muted-foreground'>-</span>
      return <span className='text-muted-foreground'>{province}</span>
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[120px]',
    },
  },
  {
    accessorKey: 'district',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quận/Huyện' />
    ),
    cell: ({ row }) => {
      const district = row.getValue<string | null>('district')
      if (!district) return <span className='text-muted-foreground'>-</span>
      return <span className='text-muted-foreground'>{district}</span>
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[120px]',
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue<string>('createdAt')
      try {
        return (
          <span className='text-muted-foreground'>
            {format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}
          </span>
        )
      } catch {
        return <span className='text-muted-foreground'>-</span>
      }
    },
    enableSorting: true,
    meta: {
      className: 'min-w-[160px]',
    },
  },
  {
    accessorKey: 'deletedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => {
      const deletedAt = row.getValue<string | null>('deletedAt')
      return (
        <Badge variant={deletedAt ? 'destructive' : 'secondary'}>
          {deletedAt ? 'Đã xóa' : 'Hoạt động'}
        </Badge>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[100px]',
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: 'w-[80px]',
      thClassName:
        'sticky right-0 z-20 bg-background shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]',
      tdClassName:
        'sticky right-0 z-10 bg-background shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)] group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
    },
  },
]
