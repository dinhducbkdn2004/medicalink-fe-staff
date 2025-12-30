
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'





interface ReviewsPrimaryButtonsProps {
  onRefresh?: () => void
  isRefreshing?: boolean
}





export function ReviewsPrimaryButtons({
  onRefresh,
  isRefreshing = false,
}: ReviewsPrimaryButtonsProps) {
  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw
          className={`mr-2 size-4 ${isRefreshing ? 'animate-spin' : ''}`}
        />
        Refresh
      </Button>
    </div>
  )
}

