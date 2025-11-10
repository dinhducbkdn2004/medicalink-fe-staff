/**
 * Reviews Row Actions
 * Actions menu for individual review rows
 */
import type { Row } from '@tanstack/react-table'
import { Eye, Trash2, CheckCircle, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Review } from '../data/schema'
import { useReviews } from './reviews-provider'

// ============================================================================
// Types
// ============================================================================

interface DataTableRowActionsProps {
  row: Row<Review>
}

// ============================================================================
// Component
// ============================================================================

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const review = row.original
  const { setOpen, setCurrentReview } = useReviews()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex size-8 p-0'
        >
          <MoreHorizontal className='size-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentReview(review)
            setOpen('view')
          }}
        >
          <Eye className='mr-2 size-4' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentReview(review)
            setOpen('approve')
          }}
          disabled={review.status === 'APPROVED'}
        >
          <CheckCircle className='mr-2 size-4' />
          Approve
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentReview(review)
            setOpen('delete')
          }}
          className='text-destructive focus:text-destructive'
        >
          <Trash2 className='mr-2 size-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

