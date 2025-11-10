/**
 * Reviews Table Columns
 * Column definitions for the reviews data table
 */
import type { ColumnDef } from '@tanstack/react-table'
import { CheckCircle2, Clock, XCircle, Star, User, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Review } from '../data/schema'

// ============================================================================
// Helper Components
// ============================================================================

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'size-4',
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground'
          )}
        />
      ))}
      <span className='ml-1.5 font-medium'>{rating}</span>
    </div>
  )
}

// ============================================================================
// Column Definitions
// ============================================================================

export const columns: ColumnDef<Review>[] = [
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
      className: 'w-[40px]',
    },
  },
  // Doctor
  {
    accessorKey: 'doctor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Doctor' />
    ),
    cell: ({ row }) => {
      const doctor = row.original.doctor
      if (!doctor) return <span className='text-muted-foreground text-sm'>-</span>
      
      return (
        <div className='flex items-center gap-3'>
          <Avatar className='size-9'>
            <AvatarImage src={doctor.avatarUrl || undefined} alt={doctor.fullName || 'Doctor'} />
            <AvatarFallback>
              {doctor.fullName
                ? doctor.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : 'DR'}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <div className='font-medium'>{doctor.fullName || 'Unknown Doctor'}</div>
            {doctor.specialty && (
              <div className='text-muted-foreground text-xs'>
                {doctor.specialty}
              </div>
            )}
          </div>
        </div>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[220px]',
    },
  },
  // Patient
  {
    accessorKey: 'patientName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Patient' />
    ),
    cell: ({ row }) => {
      const name = row.original.patientName
      return (
        <div className='flex items-center gap-2'>
          <User className='text-muted-foreground size-4' />
          <span className='font-medium'>{name}</span>
        </div>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[160px]',
    },
  },
  // Rating
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rating' />
    ),
    cell: ({ row }) => <RatingStars rating={row.original.rating} />,
    filterFn: (row, _id, value: string[]) => {
      if (!value || value.length === 0) return true
      return value.includes(String(row.original.rating))
    },
    meta: {
      className: 'w-[140px]',
    },
  },
  // Comment Preview
  {
    accessorKey: 'comment',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Comment' />
    ),
    cell: ({ row }) => {
      const comment = row.original.comment
      const preview = comment.length > 80 ? comment.slice(0, 80) + '...' : comment
      return (
        <div className='max-w-[300px] text-sm'>
          <p className='line-clamp-2'>{preview}</p>
        </div>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[300px]',
    },
  },
  // Helpful Count
  {
    accessorKey: 'helpfulCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Helpful' />
    ),
    cell: ({ row }) => {
      const count = row.original.helpfulCount
      return (
        <div className='flex items-center gap-2'>
          <ThumbsUp className='text-muted-foreground size-4' />
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
        APPROVED: {
          label: 'Approved',
          icon: CheckCircle2,
          className:
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        },
        REJECTED: {
          label: 'Rejected',
          icon: XCircle,
          className:
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        },
      }

      const config = statusConfig[status]

      // Handle unknown status
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
  // Created At
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Submitted' />
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
]

