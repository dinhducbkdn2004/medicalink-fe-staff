/**
 * Office Hours Management Page
 * Main page for managing office hours and schedules
 */
import { getRouteApi } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { OfficeHoursDialogs } from './components/office-hours-dialogs'
import { OfficeHoursPrimaryButtons } from './components/office-hours-primary-buttons'
import { OfficeHoursProvider } from './components/office-hours-provider'
import { OfficeHoursTable } from './components/office-hours-table'
import { useOfficeHours } from './data/use-office-hours'

const route = getRouteApi('/_authenticated/office-hours/')

export function OfficeHours() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Fetch all office hours (API returns grouped data)
  const queryParams = {
    doctorId: (search.doctorId as string) || undefined,
    workLocationId: (search.workLocationId as string) || undefined,
  }

  const { data, isLoading, error } = useOfficeHours(queryParams)

  // Extract grouped data (safely handle undefined/null)
  const globalHours = data?.data?.global || []
  const workLocationHours = data?.data?.workLocation || []
  const doctorHours = data?.data?.doctor || []
  const doctorInLocationHours = data?.data?.doctorInLocation || []

  // Combine all for "All" tab
  const allHours = [
    ...doctorInLocationHours,
    ...doctorHours,
    ...workLocationHours,
    ...globalHours,
  ]

  // Check for permission errors
  const isPermissionError =
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'status' in error.response &&
    (error.response.status === 401 || error.response.status === 403)

  return (
    <OfficeHoursProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Office Hours Management
            </h2>
            <p className='text-muted-foreground'>
              Manage working hours and schedules for doctors and locations.
            </p>
          </div>
          {!isPermissionError && <OfficeHoursPrimaryButtons />}
        </div>

        {isPermissionError ? (
          <div className='border-destructive/50 bg-destructive/10 rounded-lg border p-8 text-center'>
            <h3 className='text-destructive text-lg font-semibold'>
              Access Denied
            </h3>
            <p className='text-muted-foreground mt-2'>
              You don't have permission to view office hours. Please contact
              your administrator to request access.
            </p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Required permission:{' '}
              <code className='font-mono'>office-hours:read</code>
            </p>
          </div>
        ) : (
          <Tabs defaultValue='all' className='w-full'>
            <TabsList>
              <TabsTrigger value='all'>
                All
                <Badge variant='secondary' className='ml-2'>
                  {allHours.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='doctor-at-location'>
                Doctor at Location
                <Badge variant='secondary' className='ml-2'>
                  {doctorInLocationHours.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='doctor-all'>
                Doctor (All Locations)
                <Badge variant='secondary' className='ml-2'>
                  {doctorHours.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='location'>
                Work Location
                <Badge variant='secondary' className='ml-2'>
                  {workLocationHours.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='global'>
                Global
                <Badge variant='secondary' className='ml-2'>
                  {globalHours.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value='all' className='mt-4'>
              <OfficeHoursTable
                data={allHours}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value='doctor-at-location' className='mt-4'>
              <OfficeHoursTable
                data={doctorInLocationHours}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value='doctor-all' className='mt-4'>
              <OfficeHoursTable
                data={doctorHours}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value='location' className='mt-4'>
              <OfficeHoursTable
                data={workLocationHours}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value='global' className='mt-4'>
              <OfficeHoursTable
                data={globalHours}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        )}
      </Main>

      <OfficeHoursDialogs />
    </OfficeHoursProvider>
  )
}
