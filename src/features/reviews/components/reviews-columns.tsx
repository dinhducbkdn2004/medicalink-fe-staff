/**
 * Reviews Table Columns
 * Column definitions for the reviews data table
 */
import type { ColumnDef } from '@tanstack/react-table'
import { User } from 'lucide-react'
import type { Review } from '@/api/services/review.service'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { RatingStars } from './rating-stars'

// ============================================================================
// Column Definitions
// ============================================================================

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
  // Author
  {
    accessorKey: 'authorName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Author' />
    ),
    cell: ({ row }) => {
      const name = row.original.authorName
      const email = row.original.authorEmail
      return (
        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <User className='text-muted-foreground size-4' />
            <span className='font-medium'>{name}</span>
          </div>
          {email && (
            <span className='text-muted-foreground ml-6 text-xs'>{email}</span>
          )}
        </div>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[180px]',
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
  // Title & Body Preview
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Review' />
    ),
    cell: ({ row }) => {
      const title = row.original.title
      const body = row.original.body
      const preview = body.length > 80 ? body.slice(0, 80) + '...' : body
      return (
        <div className='max-w-[400px]'>
          <div className='font-medium'>{title}</div>
          <div className='text-muted-foreground line-clamp-2 text-sm'>
            {preview}
          </div>
        </div>
      )
    },
    enableSorting: false,
    meta: {
      className: 'min-w-[300px]',
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
