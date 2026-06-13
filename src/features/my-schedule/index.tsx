import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Clock, Calendar as CalendarIcon, Info } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAuth } from '@/hooks/use-auth'
import { RequirePermission } from '@/components/auth/require-permission'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useOfficeHours } from '@/features/office-hours/data/use-office-hours'
import { useSpecialShifts } from '@/features/special-shifts/data/use-special-shifts'
import { MyScheduleTable } from './components/my-schedule-table'

const route = getRouteApi('/_authenticated/my-schedule/')

function MyScheduleContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { user } = useAuth()
  
  const [activeTab, setActiveTab] = useState('all')

  const queryParams = {
    doctorId: user?.id,
    workLocationId: 'cm0hq6rxg000008mf3x0c6w4b', // Default location
  }

  const { data: officeHoursData, isLoading: isLoadingOH } = useOfficeHours(queryParams)
  const { data: specialShiftsData, isLoading: isLoadingSS } = useSpecialShifts(queryParams)

  // Process data to merge and calculate final schedule
  const globalHours = officeHoursData?.global || []
  const doctorHours = officeHoursData?.doctorSpecific || []
  const specialShifts = specialShiftsData || []

  const isLoading = isLoadingOH || isLoadingSS

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>My Schedule</h2>
            <p className='text-muted-foreground'>
              View your final working schedule including regular hours and special shifts.
            </p>
          </div>
        </div>

        <Alert className='mb-6'>
          <Info className='h-4 w-4' />
          <AlertDescription>
            This page shows your final computed schedule. Special shifts (overrides) take precedence over regular office hours.
          </AlertDescription>
        </Alert>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-4'>
            <div className='flex items-center justify-between'>
              <TabsList>
                <TabsTrigger value='all'>All Shifts</TabsTrigger>
                <TabsTrigger value='regular'>Regular Hours</TabsTrigger>
                <TabsTrigger value='special'>Special Shifts</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='all' className='mt-0'>
              <MyScheduleTable 
                type="all"
                globalHours={globalHours} 
                doctorHours={doctorHours} 
                specialShifts={specialShifts}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value='regular' className='mt-0'>
              <MyScheduleTable 
                type="regular"
                globalHours={globalHours} 
                doctorHours={doctorHours} 
                specialShifts={specialShifts}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value='special' className='mt-0'>
              <MyScheduleTable 
                type="special"
                globalHours={globalHours} 
                doctorHours={doctorHours} 
                specialShifts={specialShifts}
                search={search}
                navigate={navigate}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Main>
    </>
  )
}

export function MySchedule() {
  return (
    <RequirePermission resource='office-hours' action='read'>
      <MyScheduleContent />
    </RequirePermission>
  )
}
