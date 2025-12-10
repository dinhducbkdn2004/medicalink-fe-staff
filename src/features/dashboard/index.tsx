import { useAuthStore } from '@/stores/auth-store'
import {
  useStaffStats,
  usePatientStats,
  useAppointmentStats,
  useRevenueStats,
} from '@/hooks/use-stats'
import { Button } from '@/components/ui/button'
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
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

export function Dashboard() {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'

  const { data: staffStats, isLoading: isLoadingStaff } = useStaffStats(isAdmin)
  const { data: patientStats, isLoading: isLoadingPatient } =
    usePatientStats(isAdmin)
  const { data: appointmentStats, isLoading: isLoadingAppointment } =
    useAppointmentStats(isAdmin)
  const { data: revenueStats, isLoading: isLoadingRevenue } =
    useRevenueStats(isAdmin)

  // Calculate total revenue from current year/month if data is available (assuming API returns array of months)
  // Or just display "N/A" if aggregate not provided directly.
  // Based on API response example: revenueStats is array of months.
  const totalRevenue = revenueStats?.reduce((acc, curr) => {
    return acc + (curr.total.VND || 0)
  }, 0)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Export</Button>
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
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Staffs
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
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  {isLoadingStaff ? (
                    <Skeleton className='h-8 w-20' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {staffStats?.total || 0}
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        {staffStats?.recentlyCreated || 0} recently created
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Patients
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
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  {isLoadingPatient ? (
                    <Skeleton className='h-8 w-20' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {patientStats?.totalPatients || 0}
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        {patientStats?.currentMonthPatients || 0} new this month
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Appointments
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
                    <rect width='18' height='18' x='3' y='4' rx='2' ry='2' />
                    <line x1='16' x2='16' y1='2' y2='6' />
                    <line x1='8' x2='8' y1='2' y2='6' />
                    <line x1='3' x2='21' y1='10' y2='10' />
                  </svg>
                </CardHeader>
                <CardContent>
                  {isLoadingAppointment ? (
                    <Skeleton className='h-8 w-20' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {appointmentStats?.totalAppointments || 0}
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        {appointmentStats?.growthPercent != null && (
                          <>
                            {appointmentStats.growthPercent > 0 ? '+' : ''}
                            {appointmentStats.growthPercent}% from last month
                          </>
                        )}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Revenue
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
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  {isLoadingRevenue ? (
                    <Skeleton className='h-8 w-20' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(totalRevenue || 0)}
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        Year to date
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Top Doctors by Revenue</CardTitle>
                  <CardDescription>
                    Highest earning doctors this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Settings',
    href: 'settings',
    isActive: true,
    disabled: false,
  },
]
