/**
 * Office Hours Management Page
 * Main page for managing office hours and schedules
 */
import { getRouteApi } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Can } from '@/components/auth/permission-gate'
import { RequirePermission } from '@/components/auth/require-permission'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useDoctors } from '@/features/doctors/data/use-doctors'
import { useWorkLocations } from '@/features/work-locations/data/use-work-locations'
import { OfficeHoursDialogs } from './components/office-hours-dialogs'
import { OfficeHoursPrimaryButtons } from './components/office-hours-primary-buttons'
import { OfficeHoursProvider } from './components/office-hours-provider'
import { OfficeHoursTable } from './components/office-hours-table'
import { useOfficeHours } from './data/use-office-hours'

const route = getRouteApi('/_authenticated/office-hours/')

function OfficeHoursContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Fetch filter options
  const { data: doctorsData } = useDoctors({ limit: 100 })
  const { data: locationsData } = useWorkLocations({ limit: 100 })

  const doctors = doctorsData?.data || []
  const locations = locationsData?.data || []

  // Filter handlers
  const handleDoctorChange = (doctorId: string) => {
    navigate({
      search: {
        ...search,
        doctorId: doctorId === 'all' ? undefined : doctorId,
      },
    })
  }

  const handleLocationChange = (workLocationId: string) => {
    navigate({
      search: {
        ...search,
        workLocationId: workLocationId === 'all' ? undefined : workLocationId,
      },
    })
  }

  // Fetch all office hours (API returns grouped data)
  const queryParams = {
    doctorId: (search.doctorId as string) || undefined,
    workLocationId: (search.workLocationId as string) || undefined,
  }

  const { data, isLoading, error } = useOfficeHours(queryParams)

  // Extract and categorize office hours data
  // Note: Backend may return all records in 'global' array, so we categorize client-side
  const categorizeOfficeHours = (apiData: typeof data) => {
    if (!apiData) {
      return {
        global: [],
        workLocation: [],
        doctor: [],
        doctorInLocation: [],
      }
    }

    // Collect all office hours from API response (might be in wrong categories)
    const allOfficeHours = [
      ...(apiData.global || []),
      ...(apiData.workLocation || []),
      ...(apiData.doctor || []),
      ...(apiData.doctorInLocation || []),
    ]

    // Re-categorize based on actual field values
    return {
      global: allOfficeHours.filter(
        (oh) =>
          (oh.isGlobal && !oh.doctorId) || (!oh.doctorId && !oh.workLocationId)
      ),
      workLocation: allOfficeHours.filter(
        (oh) => oh.workLocationId && !oh.doctorId && !oh.isGlobal
      ),
      doctor: allOfficeHours.filter((oh) => oh.doctorId && !oh.workLocationId),
      doctorInLocation: allOfficeHours.filter(
        (oh) => oh.doctorId && oh.workLocationId
      ),
    }
  }

  const groupedData = categorizeOfficeHours(data)

  // Calculate totals for badges
  const totalAll =
    groupedData.global.length +
    groupedData.workLocation.length +
    groupedData.doctor.length +
    groupedData.doctorInLocation.length

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
          {!isPermissionError && (
            <Can I='office-hours:create'>
              <OfficeHoursPrimaryButtons />
            </Can>
          )}
        </div>

        {/* Filter Controls */}
        <div className='flex flex-wrap gap-4'>
          <Select
            value={(search.doctorId as string) || 'all'}
            onValueChange={handleDoctorChange}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='All Doctors' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Doctors</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={(search.workLocationId as string) || 'all'}
            onValueChange={handleLocationChange}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='All Locations' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                All Hours
                <Badge variant='secondary' className='ml-2'>
                  {totalAll}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='doctorInLocation'>
                Doctor + Location
                <Badge variant='secondary' className='ml-2'>
                  {groupedData.doctorInLocation.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='doctor'>
                Doctor Only
                <Badge variant='secondary' className='ml-2'>
                  {groupedData.doctor.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='location'>
                Location Only
                <Badge variant='secondary' className='ml-2'>
                  {groupedData.workLocation.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='global'>
                Global Hours
                <Badge variant='secondary' className='ml-2'>
                  {groupedData.global.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* All Office Hours - Prioritized display */}
            <TabsContent value='all' className='mt-4'>
              <OfficeHoursTable
                data={[
                  ...groupedData.doctorInLocation,
                  ...groupedData.doctor,
                  ...groupedData.workLocation,
                  ...groupedData.global,
                ]}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Doctor In Location - Highest Priority */}
            <TabsContent value='doctorInLocation' className='mt-4'>
              <OfficeHoursTable
                data={groupedData.doctorInLocation}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Doctor Only - High Priority */}
            <TabsContent value='doctor' className='mt-4'>
              <OfficeHoursTable
                data={groupedData.doctor}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Location Only - Medium Priority */}
            <TabsContent value='location' className='mt-4'>
              <OfficeHoursTable
                data={groupedData.workLocation}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Global Hours - Apply to all locations as fallback */}
            <TabsContent value='global' className='mt-4'>
              <OfficeHoursTable
                data={groupedData.global}
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

/**
 * Office Hours page with permission guard
 */
export function OfficeHours() {
  return (
    <RequirePermission resource='office-hours' action='manage'>
      <OfficeHoursContent />
    </RequirePermission>
  )
}
