/**
 * Review View Dialog
 * Dialog for viewing review details
 */
import { format } from 'date-fns'
import { X, Star, User, Calendar, ThumbsUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useReviews } from './reviews-provider'

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
            'size-5',
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-muted-foreground'
          )}
        />
      ))}
      <span className='ml-2 text-lg font-semibold'>{rating}/5</span>
    </div>
  )
}

// ============================================================================
// Component
// ============================================================================

export function ReviewViewDialog() {
  const { openDialog, setOpen, currentReview } = useReviews()
  const isOpen = openDialog === 'view'

  if (!currentReview) return null

  const statusConfig: Record<
    string,
    { label: string; className: string }
  > = {
    PENDING: {
      label: 'Pending',
      className:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    APPROVED: {
      label: 'Approved',
      className:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    REJECTED: {
      label: 'Rejected',
      className:
        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
  }

  const config = statusConfig[currentReview.status]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setOpen(null)}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <div className='flex items-start justify-between'>
            <DialogTitle className='text-xl'>Review Details</DialogTitle>
            {config && (
              <Badge variant='default' className={cn(config.className)}>
                {config.label}
              </Badge>
            )}
          </div>
          <DialogDescription className='sr-only'>
            View detailed information about this review including doctor info, patient feedback, rating, and comments
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Doctor Info */}
          <div>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Doctor
            </h3>
            <div className='flex items-center gap-4'>
              <Avatar className='size-14'>
                <AvatarImage
                  src={currentReview.doctor.avatarUrl}
                  alt={currentReview.doctor.fullName}
                />
                <AvatarFallback>
                  {currentReview.doctor.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className='font-semibold'>
                  {currentReview.doctor.fullName}
                </div>
                {currentReview.doctor.specialty && (
                  <div className='text-muted-foreground text-sm'>
                    {currentReview.doctor.specialty}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Patient Info */}
          <div>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Patient Information
            </h3>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <User className='text-muted-foreground size-4' />
                <span>{currentReview.patientName}</span>
              </div>
              {currentReview.appointmentDate && (
                <div className='flex items-center gap-2'>
                  <Calendar className='text-muted-foreground size-4' />
                  <span className='text-muted-foreground text-sm'>
                    Appointment:{' '}
                    {format(
                      new Date(currentReview.appointmentDate),
                      'MMM dd, yyyy'
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Rating
            </h3>
            <RatingStars rating={currentReview.rating} />
          </div>

          <Separator />

          {/* Comment */}
          <div>
            <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
              Review Comment
            </h3>
            <div className='rounded-lg bg-muted p-4'>
              <p className='whitespace-pre-wrap text-sm leading-relaxed'>
                {currentReview.comment}
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className='flex items-center justify-between text-muted-foreground text-sm'>
            <div className='flex items-center gap-2'>
              <ThumbsUp className='size-4' />
              <span>{currentReview.helpfulCount} people found this helpful</span>
            </div>
            <div>
              Submitted on{' '}
              {format(new Date(currentReview.createdAt), 'MMM dd, yyyy')}
            </div>
          </div>
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setOpen(null)}>
            <X className='mr-2 size-4' />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

