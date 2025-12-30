
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'

interface QuestionsPrimaryButtonsProps {
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function QuestionsPrimaryButtons({
  onRefresh,
  isRefreshing = false,
}: QuestionsPrimaryButtonsProps) {
  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCcw className={`mr-2 size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  )
}

