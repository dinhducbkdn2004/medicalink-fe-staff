
import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { OfficeHoursDialogs } from './components/office-hours-dialogs'
import { OfficeHoursPrimaryButtons } from './components/office-hours-primary-buttons'
import { OfficeHoursProvider } from './components/office-hours-provider'
import { OfficeHoursTable } from './components/office-hours-table'
import { useOfficeHours } from './data/use-office-hours'
import { useAuth } from '@/hooks/use-auth'
import { SearchableSelect } from '@/components/ui/searchable-select'

import {
  SpecialShiftsProvider,
  SpecialShiftsTable,
  SpecialShiftsDialogs,
  useSpecialShifts,
  useSpecialShiftsContext,
} from '@/features/special-shifts'

function SpecialShiftsPrimaryButtons() {
  const { setOpen } = useSpecialShiftsContext()
  return (
    <div className='flex gap-2'>
      <Button onClick={() => setOpen('create')}>
        <Plus className='mr-2 size-4' />
        Add Special Shift
      </Button>
    </div>
  )
}

const route = getRouteApi('/_authenticated/office-hours/')

function OfficeHoursContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [activeTab, setActiveTab] = useState('office-hours')


  const { data: doctorsData } = useDoctors({ limit: 100 })

  const doctors = doctorsData?.data || []

  const queryParams = {
    doctorId: search.doctorId,
    workLocationId: 'cm0hq6rxg000008mf3x0c6w4b', // Default for single-location
  }

  const { data, isLoading, error } = useOfficeHours(queryParams)
  const { data: specialShiftsData, isLoading: isLoadingSpecialShifts } = useSpecialShifts(queryParams)



  const categorizeOfficeHours = (apiData: typeof data) => {
    if (!apiData) {
      return {
        clinic: [],
        doctor: [],
      }
    }

    return {
      clinic: apiData.global || [],
      doctor: apiData.doctorSpecific || [],
    }
  }

  const groupedData = categorizeOfficeHours(data)


  const totalAll =
    groupedData.clinic.length +
    groupedData.doctor.length


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
    <SpecialShiftsProvider>
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
              Schedule Management (Resolution Engine)
            </h2>
            <p className='text-muted-foreground'>
              Manage Layer 1 (Regular Hours) and Layer 4 (Special Shifts) overrides for doctors and locations.
            </p>
          </div>
          {!isPermissionError && (
            <Can I='office-hours:create'>
              {activeTab === 'office-hours' ? (
                <OfficeHoursPrimaryButtons />
              ) : (
                <SpecialShiftsPrimaryButtons />
              )}
            </Can>
          )}
        </div>

        <div className='flex flex-wrap gap-4'>
          <div className='w-[300px]'>
            <SearchableSelect
              options={doctors.map((d) => ({ label: d.fullName, value: d.id }))}
              onValueChange={(value) => {
                navigate({
                  search: {
                    ...search,
                    doctorId: value || undefined,
                  },
                })
              }}
              value={search.doctorId as string}
              placeholder='Select Doctor...'
            />
          </div>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
            <TabsList className='mb-4'>
              <TabsTrigger value='office-hours'>Layer 1: Regular Hours</TabsTrigger>
              <TabsTrigger value='special-shifts'>Layer 4: Special Shifts (Overrides)</TabsTrigger>
            </TabsList>

            <TabsContent value='office-hours' className='mt-0'>
              <Tabs defaultValue='all' className='w-full'>
                <TabsList>
              <TabsTrigger value='all'>
                All Hours
                <Badge variant='secondary' className='ml-2'>
                  {totalAll}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='clinic'>
                Clinic Global Hours
                <Badge variant='secondary' className='ml-2'>
                  {groupedData.clinic.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value='doctor'>
                Doctor Specific Hours
                <Badge variant='secondary' className='ml-2'>
                  {groupedData.doctor.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* All Office Hours - Prioritized display */}
            <TabsContent value='all' className='mt-4'>
              <OfficeHoursTable
                data={[
                  ...groupedData.clinic,
                  ...groupedData.doctor,
                ]}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Clinic Hours */}
            <TabsContent value='clinic' className='mt-4'>
              <OfficeHoursTable
                data={groupedData.clinic}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            {/* Doctor Hours */}
            <TabsContent value='doctor' className='mt-4'>
              <OfficeHoursTable
                data={groupedData.doctor}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value='special-shifts' className='mt-0'>
              <SpecialShiftsTable
                data={specialShiftsData || []}
                search={search}
                navigate={navigate}
                isLoading={isLoadingSpecialShifts}
                hideToolbar={true}
              />
            </TabsContent>
          </Tabs>
        )}
      </Main>

      <OfficeHoursDialogs />
      <SpecialShiftsDialogs />
    </SpecialShiftsProvider>
    </OfficeHoursProvider>
  )
}

/**
 * Office Hours page with permission guard
 */
export function OfficeHours() {
  return (
    <RequirePermission resource='office-hours' action='read'>
      <OfficeHoursContent />
    </RequirePermission>
  )
}
