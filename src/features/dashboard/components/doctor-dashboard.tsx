/**
 * Doctor Dashboard Component
 * Personal dashboard for doctors with statistics and appointments
 * Based on API_DOCTOR_STATS.md specifications
 */
import {
  Calendar,
  Star,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { useDoctorMyStats } from '@/hooks/use-stats'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { DoctorAppointmentsSection } from './doctor-appointments-section'

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  isLoading = false,
}: {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
  isLoading?: boolean
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='text-muted-foreground h-4 w-4' />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-8 w-20' />
        ) : (
          <>
            <div className='text-2xl font-bold'>{value}</div>
            <p className='text-muted-foreground text-xs'>{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function DoctorDashboard() {
  const { data: stats, isLoading } = useDoctorMyStats()

  const topNav = [
    {
      title: 'Overview',
      href: '/dashboard',
      isActive: true,
      disabled: false,
    },
    {
      title: 'Appointments',
      href: '/appointments',
      isActive: false,
      disabled: false,
    },
  ]

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Doctor Dashboard
            </h1>
            <p className='text-muted-foreground'>
              Overview of your activities and statistics
            </p>
          </div>
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='appointments'>Appointments</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-4'>
            <div className='space-y-4'>
              {/* Booking Stats */}
              <div>
                <h2 className='mb-3 text-lg font-semibold'>Booking Stats</h2>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <StatsCard
                    title='Total Appointments'
                    value={stats?.booking.total || 0}
                    description='Total appointments'
                    icon={Calendar}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Pending Confirmation'
                    value={stats?.booking.bookedCount || 0}
                    description='Needs confirmation'
                    icon={Clock}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Confirmed'
                    value={stats?.booking.confirmedCount || 0}
                    description='Confirmed appointments'
                    icon={CheckCircle}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Completed Rate'
                    value={
                      stats?.booking.completedRate
                        ? `${stats.booking.completedRate.toFixed(1)}%`
                        : '0%'
                    }
                    description={`${stats?.booking.completedCount || 0} completed`}
                    icon={CheckCircle}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {/* Content Stats */}
              <div>
                <h2 className='mb-3 text-lg font-semibold'>Content Stats</h2>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <StatsCard
                    title='Total Reviews'
                    value={stats?.content.totalReviews || 0}
                    description='Reviews from patients'
                    icon={Star}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Average Rating'
                    value={
                      stats?.content.averageRating
                        ? stats.content.averageRating.toFixed(1)
                        : '0.0'
                    }
                    description='Average score'
                    icon={Star}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Q&A Answers'
                    value={stats?.content.totalAnswers || 0}
                    description={`${stats?.content.answerAcceptedRate.toFixed(0) || 0}% accepted`}
                    icon={MessageSquare}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Published Blogs'
                    value={stats?.content.totalBlogs || 0}
                    description='Published articles'
                    icon={FileText}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {/* Additional Stats Cards */}
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Performance</CardTitle>
                    <CardDescription>
                      Details about appointment status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-full' />
                      </div>
                    ) : (
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <CheckCircle className='h-4 w-4 text-green-600' />
                            <span className='text-sm'>Completed</span>
                          </div>
                          <span className='font-semibold'>
                            {stats?.booking.completedCount || 0}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <Clock className='h-4 w-4 text-yellow-600' />
                            <span className='text-sm'>Confirmed</span>
                          </div>
                          <span className='font-semibold'>
                            {stats?.booking.confirmedCount || 0}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <XCircle className='h-4 w-4 text-red-600' />
                            <span className='text-sm'>Cancelled</span>
                          </div>
                          <span className='font-semibold'>
                            {stats?.booking.cancelledCount || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Engagement</CardTitle>
                    <CardDescription>
                      Engagement with posts and answers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-full' />
                      </div>
                    ) : (
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <Star className='h-4 w-4 text-yellow-500' />
                            <span className='text-sm'>Avg Rating</span>
                          </div>
                          <span className='font-semibold'>
                            {stats?.content.averageRating.toFixed(1) || '0.0'} /
                            5.0
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <MessageSquare className='h-4 w-4 text-blue-600' />
                            <span className='text-sm'>Accepted Answers</span>
                          </div>
                          <span className='font-semibold'>
                            {stats?.content.totalAcceptedAnswers || 0} /{' '}
                            {stats?.content.totalAnswers || 0}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <FileText className='h-4 w-4 text-purple-600' />
                            <span className='text-sm'>Published Blogs</span>
                          </div>
                          <span className='font-semibold'>
                            {stats?.content.totalBlogs || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Appointments Tab - TODO: Add appointment lists */}
          <TabsContent value='appointments' className='space-y-4'>
            <DoctorAppointmentsSection />
          </TabsContent>

          {/* Content Tab - TODO: Add content lists */}
          <TabsContent value='content' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Content Overview</CardTitle>
                <CardDescription>Your reviews, Q&A, and blogs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm'>
                  Content details will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
