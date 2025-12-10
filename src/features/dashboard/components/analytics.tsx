import { useQAOverviewStats, useReviewsOverviewStats } from '@/hooks/use-stats'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AnalyticsChart } from './analytics-chart'

export function Analytics() {
  const { data: reviewsStats, isLoading: isLoadingReviews } =
    useReviewsOverviewStats()
  const { data: qaStats, isLoading: isLoadingQA } = useQAOverviewStats()

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Weekly clicks and unique visitors</CardDescription>
        </CardHeader>
        <CardContent className='px-6'>
          <AnalyticsChart />
        </CardContent>
      </Card>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Reviews</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoadingReviews ? (
              <Skeleton className='h-8 w-20' />
            ) : (
              <>
                <div className='text-2xl font-bold'>
                  {reviewsStats?.totalReviews || 0}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Total received reviews
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Average Rating
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <circle cx='12' cy='12' r='10' />
              <path d='M12 6v6l4 2' />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoadingReviews ? (
              <Skeleton className='h-8 w-20' />
            ) : (
              <>
                <div className='text-2xl font-bold'>
                  {(() => {
                    const counts = reviewsStats?.ratingCounts || {}
                    let totalScore = 0
                    let totalCount = 0
                    Object.entries(counts).forEach(([rating, count]) => {
                      totalScore += Number(rating) * count
                      totalCount += count
                    })
                    return totalCount > 0
                      ? (totalScore / totalCount).toFixed(1)
                      : '0.0'
                  })()}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Based on {reviewsStats?.totalReviews || 0} reviews
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Questions
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <circle cx='12' cy='12' r='10' />
              <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
              <path d='M12 17h.01' />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoadingQA ? (
              <Skeleton className='h-8 w-20' />
            ) : (
              <>
                <div className='text-2xl font-bold'>
                  {qaStats?.totalQuestions || 0}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Usually {qaStats?.answeredQuestions || 0} answered
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Answer Rate</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='text-muted-foreground h-4 w-4'
            >
              <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
              <polyline points='22 4 12 14.01 9 11.01' />
            </svg>
          </CardHeader>
          <CardContent>
            {isLoadingQA ? (
              <Skeleton className='h-8 w-20' />
            ) : (
              <>
                <div className='text-2xl font-bold'>
                  {qaStats?.answerRate || 0}%
                </div>
                <p className='text-muted-foreground text-xs'>
                  Q&A response rate
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>Referrers</CardTitle>
            <CardDescription>Top sources driving traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={[
                { name: 'Direct', value: 512 },
                { name: 'Product Hunt', value: 238 },
                { name: 'Twitter', value: 174 },
                { name: 'Blog', value: 104 },
              ]}
              barClass='bg-primary'
              valueFormatter={(n) => `${n}`}
            />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Devices</CardTitle>
            <CardDescription>How users access your app</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarList
              items={[
                { name: 'Desktop', value: 74 },
                { name: 'Mobile', value: 22 },
                { name: 'Tablet', value: 4 },
              ]}
              barClass='bg-muted-foreground'
              valueFormatter={(n) => `${n}%`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SimpleBarList({
  items,
  valueFormatter,
  barClass,
}: {
  items: { name: string; value: number }[]
  valueFormatter: (n: number) => string
  barClass: string
}) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <ul className='space-y-3'>
      {items.map((i) => {
        const width = `${Math.round((i.value / max) * 100)}%`
        return (
          <li key={i.name} className='flex items-center justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='text-muted-foreground mb-1 truncate text-xs'>
                {i.name}
              </div>
              <div className='bg-muted h-2.5 w-full rounded-full'>
                <div
                  className={`h-2.5 rounded-full ${barClass}`}
                  style={{ width }}
                />
              </div>
            </div>
            <div className='ps-2 text-xs font-medium tabular-nums'>
              {valueFormatter(i.value)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
