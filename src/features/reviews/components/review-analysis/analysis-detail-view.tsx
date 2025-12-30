import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { reviewService } from '@/api/services'
import { sanitizeHTML } from '@/lib/sanitize-html'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useReviewAnalysis } from './use-review-analysis'

interface AnalysisDetailViewProps {
  className?: string
}

export function AnalysisDetailView({ className }: AnalysisDetailViewProps) {
  const { currentAnalysis } = useReviewAnalysis()

  const { data: fullAnalysis, isLoading } = useQuery({
    queryKey: ['review-analysis-detail', currentAnalysis?.id],
    queryFn: () => reviewService.getAnalysisById(currentAnalysis!.id),
    enabled: !!currentAnalysis,
  })

  if (!currentAnalysis) {
    return (
      <Card className={cn('flex items-center justify-center', className)}>
        <CardContent className='py-16 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-800 dark:from-blue-950 dark:to-indigo-950'>
            <BarChart3 className='h-8 w-8 text-blue-600 dark:text-blue-400' />
          </div>
          <h3 className='mb-2 text-base font-semibold text-gray-900 dark:text-gray-100'>
            Select an Analysis
          </h3>
          <p className='text-muted-foreground mx-auto max-w-[280px] text-sm leading-relaxed'>
            Choose an analysis from the list to view detailed AI-powered
            insights and metrics
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading || !fullAnalysis) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-96' />
        </CardHeader>
        <CardContent className='space-y-6'>
          <Skeleton className='h-32 w-full' />
          <Skeleton className='h-64 w-full' />
        </CardContent>
      </Card>
    )
  }

  const changePercent =
    fullAnalysis.period2Avg > 0
      ? ((fullAnalysis.avgChange / fullAnalysis.period2Avg) * 100).toFixed(1)
      : '0'

  const totalPercent =
    fullAnalysis.period2Total > 0
      ? ((fullAnalysis.totalChange / fullAnalysis.period2Total) * 100).toFixed(
          1
        )
      : '0'

  return (
    <Card className={className}>
      <CardHeader className='border-b pb-4'>
        <div className='flex items-start justify-between'>
          <div className='flex-1 space-y-1'>
            <div className='mb-2 flex items-center gap-2'>
              <CardTitle className='text-lg'>
                {fullAnalysis.dateRange.toUpperCase()} Analysis
              </CardTitle>
              <Badge variant='secondary' className='text-xs font-normal'>
                {fullAnalysis.includeNonPublic ? 'All Reviews' : 'Public Only'}
              </Badge>
            </div>
            <div className='text-muted-foreground flex items-center gap-4 text-xs'>
              <span>
                {format(new Date(fullAnalysis.createdAt), 'MMM dd, yyyy')}
              </span>
              <span>by {currentAnalysis.creatorName}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-5 py-5'>
        {}
        <div className='grid grid-cols-3 gap-3'>
          {}
          <Card className='border-muted'>
            <CardContent className='pt-4 pb-4'>
              <div>
                <p className='text-muted-foreground mb-2 text-xs font-medium'>
                  Average Rating
                </p>
                <div className='flex items-end justify-between'>
                  <div>
                    <p className='text-3xl font-bold'>
                      {fullAnalysis.period1Avg.toFixed(1)}
                    </p>
                    <p className='text-muted-foreground mt-0.5 text-xs'>
                      was {fullAnalysis.period2Avg.toFixed(1)}
                    </p>
                  </div>
                  <div className='flex items-center gap-1'>
                    {fullAnalysis.avgChange > 0 ? (
                      <ArrowUp className='h-4 w-4 text-green-600' />
                    ) : fullAnalysis.avgChange < 0 ? (
                      <ArrowDown className='h-4 w-4 text-red-600' />
                    ) : (
                      <Minus className='text-muted-foreground h-4 w-4' />
                    )}
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        fullAnalysis.avgChange > 0 && 'text-green-600',
                        fullAnalysis.avgChange < 0 && 'text-red-600',
                        fullAnalysis.avgChange === 0 && 'text-muted-foreground'
                      )}
                    >
                      {fullAnalysis.avgChange > 0 && '+'}
                      {fullAnalysis.avgChange.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {}
          <Card className='border-muted'>
            <CardContent className='pt-4 pb-4'>
              <div>
                <p className='text-muted-foreground mb-2 text-xs font-medium'>
                  Total Reviews
                </p>
                <div className='flex items-end justify-between'>
                  <div>
                    <p className='text-3xl font-bold'>
                      {fullAnalysis.period1Total}
                    </p>
                    <p className='text-muted-foreground mt-0.5 text-xs'>
                      was {fullAnalysis.period2Total}
                    </p>
                  </div>
                  <div className='flex items-center gap-1'>
                    {fullAnalysis.totalChange > 0 ? (
                      <ArrowUp className='h-4 w-4 text-green-600' />
                    ) : fullAnalysis.totalChange < 0 ? (
                      <ArrowDown className='h-4 w-4 text-red-600' />
                    ) : (
                      <Minus className='text-muted-foreground h-4 w-4' />
                    )}
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        fullAnalysis.totalChange > 0 && 'text-green-600',
                        fullAnalysis.totalChange < 0 && 'text-red-600',
                        fullAnalysis.totalChange === 0 &&
                          'text-muted-foreground'
                      )}
                    >
                      {fullAnalysis.totalChange > 0 && '+'}
                      {fullAnalysis.totalChange}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {}
          <Card className='border-muted'>
            <CardContent className='pt-4 pb-4'>
              <div>
                <p className='text-muted-foreground mb-2 text-xs font-medium'>
                  Change
                </p>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Reviews
                    </span>
                    <div className='flex items-center gap-1'>
                      {fullAnalysis.totalChange > 0 ? (
                        <ArrowUp className='h-3 w-3 text-green-600' />
                      ) : fullAnalysis.totalChange < 0 ? (
                        <ArrowDown className='h-3 w-3 text-red-600' />
                      ) : (
                        <Minus className='text-muted-foreground h-3 w-3' />
                      )}
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          fullAnalysis.totalChange > 0 && 'text-green-600',
                          fullAnalysis.totalChange < 0 && 'text-red-600',
                          fullAnalysis.totalChange === 0 &&
                            'text-muted-foreground'
                        )}
                      >
                        {totalPercent}%
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Rating
                    </span>
                    <div className='flex items-center gap-1'>
                      {fullAnalysis.avgChange > 0 ? (
                        <ArrowUp className='h-3 w-3 text-green-600' />
                      ) : fullAnalysis.avgChange < 0 ? (
                        <ArrowDown className='h-3 w-3 text-red-600' />
                      ) : (
                        <Minus className='text-muted-foreground h-3 w-3' />
                      )}
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          fullAnalysis.avgChange > 0 && 'text-green-600',
                          fullAnalysis.avgChange < 0 && 'text-red-600',
                          fullAnalysis.avgChange === 0 &&
                            'text-muted-foreground'
                        )}
                      >
                        {changePercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {}
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold'>Summary</h3>
          <div
            className='prose prose-sm dark:prose-invert max-w-none text-sm'
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(fullAnalysis.summary),
            }}
          />
        </div>

        <Separator />

        {}
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold text-green-600'>
            Key Strengths
          </h3>
          <div
            className='prose prose-sm dark:prose-invert max-w-none text-sm [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-4'
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(fullAnalysis.advantages),
            }}
          />
        </div>

        <Separator />

        {}
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold text-amber-600'>
            Areas for Improvement
          </h3>
          <div
            className='prose prose-sm dark:prose-invert max-w-none text-sm [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-4'
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(fullAnalysis.disadvantages),
            }}
          />
        </div>

        <Separator />

        {}
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold text-blue-600'>
            Notable Changes
          </h3>
          <div
            className='prose prose-sm dark:prose-invert max-w-none text-sm'
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(fullAnalysis.changes),
            }}
          />
        </div>

        <Separator />

        {}
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold text-purple-600'>
            Recommendations
          </h3>
          <div
            className='prose prose-sm dark:prose-invert max-w-none text-sm [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-4'
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(fullAnalysis.recommendations),
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
