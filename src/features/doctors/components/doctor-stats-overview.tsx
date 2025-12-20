/**
 * Doctor Stats Overview Component
 * Displays comprehensive statistics for a specific doctor
 */
import { useQuery } from '@tanstack/react-query'
import {
  Calendar,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { getDoctorStatsById } from '@/api/services/stats.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// ============================================================================
// Component
// ============================================================================

interface DoctorStatsOverviewProps {
  readonly doctorId: string
}

export function DoctorStatsOverview({ doctorId }: DoctorStatsOverviewProps) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['doctor-stats', doctorId],
    queryFn: () => getDoctorStatsById(doctorId),
  })

  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='mb-1 h-8 w-16' />
              <Skeleton className='h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className='py-16 text-center'>
          <p className='text-muted-foreground'>No statistics available</p>
        </CardContent>
      </Card>
    )
  }

  const booking = stats.booking || {}
  const content = stats.content || {}

  return (
    <div className='space-y-5'>
      {/* Booking Stats Section */}
      <div>
        <h3 className='mb-3 text-sm font-semibold'>Appointment Statistics</h3>
        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Appointments
              </CardTitle>
              <Calendar className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{booking.total || 0}</div>
              <p className='text-muted-foreground text-xs'>All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Completed</CardTitle>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {booking.completedCount || 0}
              </div>
              <p className='text-muted-foreground text-xs'>
                Successfully completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Confirmed</CardTitle>
              <Clock className='h-4 w-4 text-blue-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {booking.confirmedCount || 0}
              </div>
              <p className='text-muted-foreground text-xs'>
                Awaiting completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Completion Rate
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {booking.completedRate || 0}%
              </div>
              <p className='text-muted-foreground text-xs'>Success rate</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Stats Section */}
      <div>
        <h3 className='mb-3 text-sm font-semibold'>Content & Engagement</h3>
        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Reviews</CardTitle>
              <MessageSquare className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {content.totalReviews || 0}
              </div>
              <div className='mt-1 flex items-center gap-2'>
                <span className='text-lg font-semibold text-yellow-600'>
                  {content.averageRating
                    ? content.averageRating.toFixed(1)
                    : '0.0'}
                </span>
                <span className='text-muted-foreground text-xs'>
                  ★ avg rating
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Blog Posts</CardTitle>
              <FileText className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {content.totalBlogs || 0}
              </div>
              <p className='text-muted-foreground text-xs'>
                Published articles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Q&A Answers</CardTitle>
              <MessageSquare className='h-4 w-4 text-blue-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {content.totalAnswers || 0}
              </div>
              <p className='text-muted-foreground text-xs'>
                Questions answered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Accepted Answers
              </CardTitle>
              <CheckCircle className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {content.totalAcceptedAnswers || 0}
              </div>
              <p className='text-muted-foreground text-xs'>
                {content.answerAcceptedRate || 0}% acceptance rate
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Overview */}
      {content.averageRating && content.averageRating > 0 && (
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-sm font-semibold'>
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 md:grid-cols-3'>
              <div className='bg-muted/50 rounded-lg p-4 text-center'>
                <div className='text-3xl font-bold text-yellow-600'>
                  {content.averageRating.toFixed(1)}
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Average Rating
                </p>
              </div>
              <div className='bg-muted/50 rounded-lg p-4 text-center'>
                <div className='text-3xl font-bold text-blue-600'>
                  {content.totalReviews || 0}
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Total Reviews
                </p>
              </div>
              <div className='bg-muted/50 rounded-lg p-4 text-center'>
                <div className='text-3xl font-bold text-green-600'>
                  {booking.completedCount || 0}
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Completed Visits
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
