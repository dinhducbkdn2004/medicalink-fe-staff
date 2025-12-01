import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RatingStars({ rating }: { rating: number }) {
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
