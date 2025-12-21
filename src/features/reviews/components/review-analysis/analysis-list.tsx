/**
 * Analysis List Component
 * Left column displaying list of review analyses
 */
import { useState } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, Plus } from 'lucide-react'
import { reviewService } from '@/api/services'
import type { DateRangeType } from '@/api/types'
import { sanitizeHTML } from '@/lib/sanitize-html'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useReviewAnalysis } from './use-review-analysis'

// ============================================================================
// Component
// ============================================================================

interface AnalysisListProps {
  className?: string
}

export function AnalysisList({ className }: AnalysisListProps) {
  const { doctorId, setOpen, currentAnalysis, setCurrentAnalysis } =
    useReviewAnalysis()
  const [filter, setFilter] = useState<DateRangeType | 'all'>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['review-analyses', doctorId, filter],
    queryFn: () =>
      reviewService.listAnalyses(doctorId, {
        page: 1,
        limit: 50,
        dateRange: filter === 'all' ? undefined : filter,
      }),
  })

  const handleCreateClick = () => {
    setOpen('create')
  }

  const truncateSummary = (html: string, maxLength = 150): string => {
    const sanitized = sanitizeHTML(html)
    const text = sanitized.replace(/<[^>]+>/g, '')
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className='border-b pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-base'>Analysis History</CardTitle>
          <Button size='sm' onClick={handleCreateClick}>
            <Plus className='mr-1 h-4 w-4' />
            New
          </Button>
        </div>
        <div className='pt-2'>
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as DateRangeType | 'all')}
          >
            <SelectTrigger className='h-8 w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Periods</SelectItem>
              <SelectItem value='mtd'>Month to Date</SelectItem>
              <SelectItem value='ytd'>Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className='space-y-2 p-3'>
        {isLoading ? (
          // Loading skeleton
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className='p-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-32' />
                </div>
              </Card>
            ))}
          </>
        ) : data?.data.length === 0 ? (
          // Empty state
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-full'>
              <BarChart3 className='text-muted-foreground h-6 w-6' />
            </div>
            <h3 className='mb-1 text-sm font-medium'>No analyses yet</h3>
            <p className='text-muted-foreground mb-4 text-xs'>
              Generate your first AI-powered review analysis
            </p>
            <Button size='sm' onClick={handleCreateClick}>
              <Plus className='mr-2 h-4 w-4' />
              Create Analysis
            </Button>
          </div>
        ) : (
          // Analysis list
          data?.data.map((analysis) => (
            <Card
              key={analysis.id}
              className={cn(
                'hover:border-primary/50 cursor-pointer transition-colors',
                currentAnalysis?.id === analysis.id &&
                  'border-primary bg-accent'
              )}
              onClick={() => setCurrentAnalysis(analysis)}
            >
              <CardContent className='p-3'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between gap-2'>
                    <Badge variant='secondary' className='text-xs font-normal'>
                      {analysis.dateRange.toUpperCase()}
                    </Badge>
                    <span className='text-muted-foreground text-xs'>
                      {format(new Date(analysis.createdAt), 'MMM dd')}
                    </span>
                  </div>
                  <p className='line-clamp-3 text-xs leading-relaxed'>
                    {truncateSummary(analysis.summary)}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    By {analysis.creatorName}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
