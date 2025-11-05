/**
 * PageLoader Component
 * Full-page loading spinner with optional message
 *
 * Usage:
 * ```tsx
 * if (isLoading) {
 *   return <PageLoader message="Loading data..." />
 * }
 * ```
 */
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageLoaderProps {
  /**
   * Loading message to display
   * @default "Loading..."
   */
  message?: string

  /**
   * Size of the spinner
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg'

  /**
   * Full screen height
   * @default true
   */
  fullScreen?: boolean

  /**
   * Custom className
   */
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  default: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function PageLoader({
  message = 'Loading...',
  size = 'default',
  fullScreen = true,
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center',
        fullScreen ? 'h-screen' : 'h-full min-h-[400px]',
        className
      )}
    >
      <div className='flex flex-col items-center gap-3'>
        <Loader2
          className={cn('text-primary animate-spin', sizeClasses[size])}
        />
        {message && <p className='text-muted-foreground text-sm'>{message}</p>}
      </div>
    </div>
  )
}

/**
 * Inline spinner for buttons or smaller areas
 */
export function InlineLoader({
  message,
  size = 'sm',
  className,
}: Omit<PageLoaderProps, 'fullScreen'>) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('text-primary animate-spin', sizeClasses[size])} />
      {message && (
        <span className='text-muted-foreground text-sm'>{message}</span>
      )}
    </div>
  )
}
