import { useQAOverviewStats, useReviewsOverviewStats } from '@/hooks/use-stats'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminDoctorBookingStats } from './admin-doctor-booking-stats'
import { AdminDoctorContentStats } from './admin-doctor-content-stats'
import { DoctorBookingChart } from './doctor-booking-chart'
import { DoctorContentChart } from './doctor-content-chart'

export function Analytics() {
  const { data: reviewsStats, isLoading: isLoadingReviews } =
    useReviewsOverviewStats()
  const { data: qaStats, isLoading: isLoadingQA } = useQAOverviewStats()

  return (
    <div className='space-y-6'>
      {}
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

      {}
      <div className='space-y-6'>
        <div>
          <h2 className='mb-1 text-xl font-bold'>
            Doctor Performance Analytics
          </h2>
          <p className='text-muted-foreground text-sm'>
            Comprehensive booking and content statistics for all doctors
          </p>
        </div>

        {}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Booking Performance</h3>
          <DoctorBookingChart />
        </div>

        {}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Content Performance</h3>
          <DoctorContentChart />
        </div>

        {}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Detailed Statistics</h3>
          <AdminDoctorBookingStats />
          <AdminDoctorContentStats />
        </div>
      </div>
    </div>
  )
}
