
import {
  Calendar,
  Star,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { useDoctorStatsById } from '@/hooks/use-stats'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { type DoctorWithProfile } from '../types'

type DoctorStatsDialogProps = {
  doctor: DoctorWithProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DoctorStatsDialog({
  doctor,
  open,
  onOpenChange,
}: DoctorStatsDialogProps) {
  
  const { data: stats, isLoading } = useDoctorStatsById(
    doctor?.id || '',
    open && !!doctor
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-6xl overflow-y-auto'>
        <DialogHeader className='space-y-3'>
          <DialogTitle className='text-3xl font-bold'>
            Doctor Statistics
          </DialogTitle>
          <DialogDescription className='text-base'>
            Comprehensive performance metrics for{' '}
            <span className='text-foreground font-semibold'>
              {doctor?.fullName}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-8 pt-4'>
          {}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                <Calendar className='text-primary h-5 w-5' />
              </div>
              <div>
                <h3 className='text-xl font-semibold'>Booking Performance</h3>
                <p className='text-muted-foreground text-sm'>
                  Appointment statistics and completion metrics
                </p>
              </div>
            </div>

            {}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <MetricCard
                title='Total Appointments'
                value={stats?.booking.total || 0}
                icon={Calendar}
                color='blue'
                isLoading={isLoading}
              />
              <MetricCard
                title='Pending'
                value={stats?.booking.bookedCount || 0}
                icon={Clock}
                color='orange'
                isLoading={isLoading}
              />
              <MetricCard
                title='Confirmed'
                value={stats?.booking.confirmedCount || 0}
                icon={CheckCircle}
                color='cyan'
                isLoading={isLoading}
              />
              <MetricCard
                title='Completed'
                value={stats?.booking.completedCount || 0}
                icon={CheckCircle}
                color='green'
                isLoading={isLoading}
              />
            </div>

            {}
            <Card className='border-2'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <TrendingUp className='text-primary h-5 w-5' />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {isLoading ? (
                  <div className='space-y-3'>
                    <Skeleton className='h-20 w-full' />
                    <Skeleton className='h-20 w-full' />
                  </div>
                ) : (
                  <>
                    {}
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <CheckCircle className='h-5 w-5 text-green-600' />
                          <span className='font-semibold'>Completion Rate</span>
                        </div>
                        <Badge
                          variant='default'
                          className='bg-green-600 text-lg'
                        >
                          {stats?.booking.completedRate?.toFixed(1) || 0}%
                        </Badge>
                      </div>
                      <Progress
                        value={stats?.booking.completedRate || 0}
                        className='h-3'
                      />
                      <div className='text-muted-foreground flex justify-between text-sm'>
                        <span>
                          {stats?.booking.completedCount || 0} completed
                        </span>
                        <span>of {stats?.booking.total || 0} total</span>
                      </div>
                    </div>

                    <Separator />

                    {}
                    <div className='flex items-center justify-between rounded-lg bg-red-50 p-4 dark:bg-red-950/20'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30'>
                          <XCircle className='h-5 w-5 text-red-600' />
                        </div>
                        <div>
                          <p className='font-semibold text-red-900 dark:text-red-100'>
                            Cancelled Appointments
                          </p>
                          <p className='text-sm text-red-600'>
                            Appointments that were cancelled
                          </p>
                        </div>
                      </div>
                      <div className='text-3xl font-bold text-red-600'>
                        {stats?.booking.cancelledCount || 0}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className='my-8' />

          {}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10'>
                <Star className='h-5 w-5 text-yellow-500' />
              </div>
              <div>
                <h3 className='text-xl font-semibold'>Content Engagement</h3>
                <p className='text-muted-foreground text-sm'>
                  Reviews, ratings, answers, and blog posts
                </p>
              </div>
            </div>

            {}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <MetricCard
                title='Total Reviews'
                value={stats?.content.totalReviews || 0}
                icon={Star}
                color='yellow'
                isLoading={isLoading}
              />
              <MetricCard
                title='Average Rating'
                value={
                  stats?.content.averageRating
                    ? stats.content.averageRating.toFixed(1)
                    : '0.0'
                }
                suffix=' / 5.0'
                icon={Star}
                color='yellow'
                isLoading={isLoading}
              />
              <MetricCard
                title='Total Answers'
                value={stats?.content.totalAnswers || 0}
                icon={MessageSquare}
                color='blue'
                isLoading={isLoading}
              />
              <MetricCard
                title='Published Blogs'
                value={stats?.content.totalBlogs || 0}
                icon={FileText}
                color='purple'
                isLoading={isLoading}
              />
            </div>

            {}
            <Card className='border-2'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <MessageSquare className='text-primary h-5 w-5' />
                  Engagement Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {isLoading ? (
                  <div className='space-y-3'>
                    <Skeleton className='h-20 w-full' />
                    <Skeleton className='h-20 w-full' />
                  </div>
                ) : (
                  <>
                    {}
                    <div className='flex items-center justify-between rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950/20'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30'>
                          <Star className='h-5 w-5 fill-yellow-500 text-yellow-500' />
                        </div>
                        <div>
                          <p className='font-semibold text-yellow-900 dark:text-yellow-100'>
                            Patient Satisfaction
                          </p>
                          <p className='text-sm text-yellow-600'>
                            Based on {stats?.content.totalReviews || 0} reviews
                          </p>
                        </div>
                      </div>
                      <div className='flex items-baseline gap-1'>
                        <span className='text-4xl font-bold text-yellow-600'>
                          {stats?.content.averageRating?.toFixed(1) || '0.0'}
                        </span>
                        <span className='text-xl text-yellow-600/60'>
                          / 5.0
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {}
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <MessageSquare className='h-5 w-5 text-blue-600' />
                          <span className='font-semibold'>
                            Answer Acceptance Rate
                          </span>
                        </div>
                        <Badge
                          variant='default'
                          className='bg-blue-600 text-lg'
                        >
                          {stats?.content.answerAcceptedRate?.toFixed(1) || 0}%
                        </Badge>
                      </div>
                      <Progress
                        value={stats?.content.answerAcceptedRate || 0}
                        className='h-3'
                      />
                      <div className='text-muted-foreground flex justify-between text-sm'>
                        <span>
                          {stats?.content.totalAcceptedAnswers || 0} accepted
                        </span>
                        <span>
                          of {stats?.content.totalAnswers || 0} answers
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


function MetricCard({
  title,
  value,
  suffix,
  icon: Icon,
  color = 'blue',
  isLoading = false,
}: {
  title: string
  value: string | number
  suffix?: string
  icon: React.ElementType
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'cyan'
  isLoading?: boolean
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600',
    green: 'bg-green-50 dark:bg-green-950/20 text-green-600',
    yellow: 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600',
    purple: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600',
    orange: 'bg-orange-50 dark:bg-orange-950/20 text-orange-600',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600',
  }

  return (
    <Card className='transition-shadow hover:shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-muted-foreground text-sm font-medium'>
          {title}
        </CardTitle>
        <div className={`rounded-md p-2 ${colorClasses[color]}`}>
          <Icon className='h-4 w-4' />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-10 w-20' />
        ) : (
          <div className='flex items-baseline gap-1'>
            <div className='text-3xl font-bold'>{value}</div>
            {suffix && (
              <span className='text-muted-foreground text-sm'>{suffix}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
