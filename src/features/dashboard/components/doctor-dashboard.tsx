
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
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { DoctorAppointmentsSection } from './doctor-appointments-section'
import { Search } from '@/components/search'

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

  return (
    <>
      {}
      <Header>
        <Search/>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Bảng điều khiển Bác sĩ
            </h1>
            <p className='text-muted-foreground'>
              Tổng quan về các hoạt động và thống kê của bạn
            </p>
          </div>
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto'>
            <TabsList>
              <TabsTrigger value='overview'>Tổng quan</TabsTrigger>
              <TabsTrigger value='appointments'>Cuộc hẹn</TabsTrigger>
            </TabsList>
          </div>

          {}
          <TabsContent value='overview' className='space-y-4'>
            <div className='space-y-4'>
              {}
              <div>
                <h2 className='mb-3 text-lg font-semibold'>Thống kê đặt lịch</h2>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <StatsCard
                    title='Tổng số cuộc hẹn'
                    value={stats?.booking.total || 0}
                    description='Tổng số cuộc hẹn'
                    icon={Calendar}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Chờ xác nhận'
                    value={stats?.booking.bookedCount || 0}
                    description='Cần xác nhận'
                    icon={Clock}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Đã xác nhận'
                    value={stats?.booking.confirmedCount || 0}
                    description='Các cuộc hẹn đã xác nhận'
                    icon={CheckCircle}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Tỷ lệ hoàn thành'
                    value={
                      stats?.booking.completedRate
                        ? `${stats.booking.completedRate.toFixed(1)}%`
                        : '0%'
                    }
                    description={`${stats?.booking.completedCount || 0} đã hoàn thành`}
                    icon={CheckCircle}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {}
              <div>
                <h2 className='mb-3 text-lg font-semibold'>Thống kê nội dung</h2>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <StatsCard
                    title='Tổng số đánh giá'
                    value={stats?.content.totalReviews || 0}
                    description='Đánh giá từ bệnh nhân'
                    icon={Star}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Đánh giá trung bình'
                    value={
                      stats?.content.averageRating
                        ? stats.content.averageRating.toFixed(1)
                        : '0.0'
                    }
                    description='Điểm trung bình'
                    icon={Star}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Trả lời Q&A'
                    value={stats?.content.totalAnswers || 0}
                    description={`${stats?.content.answerAcceptedRate.toFixed(0) || 0}% được chấp nhận`}
                    icon={MessageSquare}
                    isLoading={isLoading}
                  />
                  <StatsCard
                    title='Bài viết đã xuất bản'
                    value={stats?.content.totalBlogs || 0}
                    description='Các bài viết đã đăng'
                    icon={FileText}
                    isLoading={isLoading}
                  />
                </div>
              </div>

              {}
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Hiệu suất đặt lịch</CardTitle>
                    <CardDescription>
                      Chi tiết về trạng thái cuộc hẹn
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
                            <span className='text-sm'>Đã hoàn thành</span>
                          </div>
                          <span className='font-semibold'>
                            {stats?.booking.completedCount || 0}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <Clock className='h-4 w-4 text-yellow-600' />
                            <span className='text-sm'>Đã xác nhận</span>
                          </div>
                          <span className='font-semibold'>
                            {stats?.booking.confirmedCount || 0}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <XCircle className='h-4 w-4 text-red-600' />
                            <span className='text-sm'>Đã hủy</span>
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
                    <CardTitle>Tương tác nội dung</CardTitle>
                    <CardDescription>
                      Tương tác với bài viết và câu trả lời
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
                            <span className='text-sm'>Đánh giá TB</span>
                          </div>
                          <span className='font-semibold'>
                            {stats?.content.averageRating.toFixed(1) || '0.0'} /
                            5.0
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <MessageSquare className='h-4 w-4 text-blue-600' />
                            <span className='text-sm'>Câu trả lời được chấp nhận</span>
                          </div>
                          <span className='font-semibold'>
                            {stats?.content.totalAcceptedAnswers || 0} /{' '}
                            {stats?.content.totalAnswers || 0}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <FileText className='h-4 w-4 text-purple-600' />
                            <span className='text-sm'>Bài viết đã xuất bản</span>
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

          {}
          <TabsContent value='appointments' className='space-y-4'>
            <DoctorAppointmentsSection />
          </TabsContent>

          {}
          <TabsContent value='content' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan Nội dung</CardTitle>
                <CardDescription>Đánh giá, Hỏi đáp và bài viết của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm'>
                  Chi tiết nội dung sẽ được triển khai tại đây.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
