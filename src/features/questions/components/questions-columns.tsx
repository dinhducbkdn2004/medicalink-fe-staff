/**
 * Questions Table Columns
 * Column definitions for the questions data table
 */
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Question } from '../data/schema'
import { CheckCircle2, Clock, XCircle, MessageCircle, Eye } from 'lucide-react'

// ============================================================================
// Column Definitions
// ============================================================================

export const columns: ColumnDef<Question>[] = [
  // Select checkbox
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
      className: 'w-[40px]',
    },
  },
  // Title
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Question Title' />
    ),
    cell: ({ row }) => {
      const title = row.original.title
      return (
        <div className='flex flex-col gap-1'>
          <div className='font-medium'>{title}</div>
          {row.original.authorName && (
            <div className='text-xs text-muted-foreground'>
              by {row.original.authorName}
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[300px]',
    },
  },
  // Specialty
  {
    accessorKey: 'specialty',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Specialty' />
    ),
    cell: ({ row }) => {
      const specialty = row.original.specialty
      if (!specialty)
        return <span className='text-muted-foreground text-sm'>-</span>
      return (
        <Badge variant='outline' className='font-normal'>
          {specialty.name}
        </Badge>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[140px]',
    },
  },
  // Answer Count
  {
    accessorKey: 'answerCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Answers' />
    ),
    cell: ({ row }) => {
      const count = row.original.answerCount
      const acceptedCount = row.original.acceptedAnswerCount || 0
      return (
        <div className='flex items-center gap-2'>
          <MessageCircle className='size-4 text-muted-foreground' />
          <span className='font-medium'>{count}</span>
          {acceptedCount > 0 && (
            <Badge
              variant='default'
              className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            >
              {acceptedCount} accepted
            </Badge>
          )}
        </div>
      )
    },
    meta: {
      className: 'w-[140px]',
    },
  },
  // View Count
  {
    accessorKey: 'viewCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Views' />
    ),
    cell: ({ row }) => {
      const count = row.original.viewCount
      return (
        <div className='flex items-center gap-2'>
          <Eye className='size-4 text-muted-foreground' />
          <span>{count}</span>
        </div>
      )
    },
    meta: {
      className: 'w-[100px]',
    },
  },
  // Status
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      const statusConfig = {
        PENDING: {
          label: 'Pending',
          icon: Clock,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        },
        APPROVED: {
          label: 'Approved',
          icon: CheckCircle2,
          className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        },
        ANSWERED: {
          label: 'Answered',
          icon: MessageCircle,
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        },
        REJECTED: {
          label: 'Rejected',
          icon: XCircle,
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        },
      }

      const config = statusConfig[status]
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
    filterFn: (row, id, value: string[]) => {
      if (!value || value.length === 0) return true
      return value.includes(row.original.status)
    },
    meta: {
      className: 'w-[120px]',
    },
  },
  // Created At
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt
      return (
        <div className='text-sm text-muted-foreground'>
          {formatDate(date, 'MMM dd, yyyy')}
        </div>
      )
    },
    meta: {
      className: 'w-[120px]',
    },
  },
]

