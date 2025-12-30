
import type { ColumnDef } from '@tanstack/react-table'
import { Clock, XCircle, MessageCircle, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import type { Question } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { SpecialtyCell } from './specialty-cell'





export const columns: ColumnDef<Question>[] = [
  
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
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Question Title' />
    ),
    cell: ({ row }) => {
      const title = row.original.title
      return (
        <div className='flex flex-col gap-1'>
          <div
            className='max-w-[220px] overflow-hidden font-medium text-ellipsis whitespace-nowrap'
            title={title}
          >
            {title}
          </div>
          {row.original.authorName && (
            <div className='text-muted-foreground max-w-[220px] truncate text-xs'>
              by {row.original.authorName}
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[220px] max-w-[220px]',
      thClassName:
        'sticky left-[32px] z-20 bg-background shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]',
      tdClassName:
        'sticky left-[32px] z-10 bg-background shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
    },
  },
  
  {
    accessorKey: 'authorEmail',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Author Email' />
    ),
    filterFn: (row, id, value: string) => {
      return value === row.getValue(id)
    },
    meta: {
      className: 'min-w-[200px]',
    },
  },
  
  {
    accessorKey: 'specialtyId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Specialty' />
    ),
    cell: ({ row }) => (
      <SpecialtyCell
        specialtyId={row.original.specialtyId}
        specialty={row.original.specialty}
      />
    ),
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id)
      if (typeof value === 'string') return rowValue === value
      if (Array.isArray(value)) return value.includes(rowValue)
      return false
    },
    meta: {
      className: 'min-w-[140px]',
    },
  },
  
  {
    accessorKey: 'answersCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Answers' />
    ),
    cell: ({ row }) => {
      const count = row.original.answersCount
      return (
        <div className='flex items-center gap-2'>
          <MessageCircle className='text-muted-foreground size-4' />
          <span className='font-medium'>{count}</span>
        </div>
      )
    },
    meta: {
      className: 'w-[140px]',
    },
  },
  
  {
    accessorKey: 'viewCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Views' />
    ),
    cell: ({ row }) => {
      const count = row.original.viewCount
      return (
        <div className='flex items-center gap-2'>
          <Eye className='text-muted-foreground size-4' />
          <span>{count}</span>
        </div>
      )
    },
    meta: {
      className: 'w-[100px]',
    },
  },
  
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const statusConfig: Record<
        string,
        { label: string; icon: typeof Clock; className: string }
      > = {
        PENDING: {
          label: 'Pending',
          icon: Clock,
          className:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        },
        ANSWERED: {
          label: 'Answered',
          icon: MessageCircle,
          className:
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        },
        CLOSED: {
          label: 'Closed',
          icon: XCircle,
          className:
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        },
      }

      const config = statusConfig[status]

      
      if (!config) {
        return (
          <div className='flex justify-center'>
            <Badge variant='outline' className='text-xs'>
              {status || 'Unknown'}
            </Badge>
          </div>
        )
      }

      const Icon = config.icon

      return (
        <div className='flex justify-center'>
          <Badge variant='default' className={cn(config.className)}>
            <Icon className='mr-1 size-3' />
            {config.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, _id, value: string[]) => {
      if (!value || value.length === 0) return true
      return value.includes(row.original.status)
    },
    meta: {
      className: 'w-[120px]',
    },
  },
  
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
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
      className: 'w-[120px]',
    },
  },
  
  {
    id: 'actions',
    enablePinning: true,
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: 'w-[60px] sticky right-0 bg-background',
    },
  },
]
