
import { format } from 'date-fns'
import { Star, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useReviews } from './use-reviews'





function RatingStars({ rating }: Readonly<{ rating: number }>) {
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





export function ReviewViewDialog() {
  const { openDialog, setOpen, currentReview } = useReviews()
  const isOpen = openDialog === 'view'

  if (!currentReview) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && setOpen(null)}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {}
          {currentReview.doctor && (
            <>
              <div>
                <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
                  Doctor
                </h3>
                <div className='flex items-center gap-3'>
                  <Avatar className='size-12'>
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
            </>
          )}

          {}
          <div>
            <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
              Author Information
            </h3>
            <div className='space-y-1.5'>
              <div className='flex items-center gap-2'>
                <User className='text-muted-foreground size-4' />
                <span>{currentReview.authorName}</span>
              </div>
              {currentReview.authorEmail && (
                <div className='text-muted-foreground ml-6 text-sm'>
                  {currentReview.authorEmail}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {}
          <div>
            <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
              Rating
            </h3>
            <RatingStars rating={currentReview.rating} />
          </div>

          <Separator />

          {}
          <div>
            <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
              Review Content
            </h3>
            {currentReview.title && (
              <h4 className='mb-2 text-base font-semibold'>
                {currentReview.title}
              </h4>
            )}
            <div className='bg-muted rounded-lg p-3'>
              <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                {currentReview.body}
              </p>
            </div>
          </div>

          {}
          <div className='text-muted-foreground flex items-center justify-between text-xs'>
            <div>
              Submitted on{' '}
              {format(new Date(currentReview.createdAt), 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
