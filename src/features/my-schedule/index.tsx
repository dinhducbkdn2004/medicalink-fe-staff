/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Info, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format } from 'date-fns'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAuth } from '@/hooks/use-auth'
import { RequirePermission } from '@/components/auth/require-permission'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { useOfficeHours } from '@/features/office-hours/data/use-office-hours'
import { useSpecialShifts } from '@/features/special-shifts/data/use-special-shifts'
import { useClinicExceptions } from '@/features/holidays/data/use-clinic-exceptions'
import { MyScheduleTable } from './components/my-schedule-table'

const route = getRouteApi('/_authenticated/my-schedule/')

function MyScheduleContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { user } = useAuth()
  
  // Use search params for date range, fallback to current week
  const startDateStr = search.startDate as string | undefined
  
  const currentWeekStart = useMemo(() => {
    if (startDateStr) {
      return new Date(startDateStr)
    }
    return startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday as first day
  }, [startDateStr])

  const currentWeekEnd = useMemo(() => endOfWeek(currentWeekStart, { weekStartsOn: 1 }), [currentWeekStart])

  const handlePrevWeek = () => {
    const newStart = subWeeks(currentWeekStart, 1)
    navigate({
      search: {
        ...search,
        startDate: format(newStart, 'yyyy-MM-dd'),
        endDate: format(endOfWeek(newStart, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      }
    })
  }

  const handleNextWeek = () => {
    const newStart = addWeeks(currentWeekStart, 1)
    navigate({
      search: {
        ...search,
        startDate: format(newStart, 'yyyy-MM-dd'),
        endDate: format(endOfWeek(newStart, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      }
    })
  }

  const queryParams = {
    doctorId: user?.id,
    workLocationId: 'cm0hq6rxg000008mf3x0c6w4b', // Default location
  }

  const { data: officeHoursData, isLoading: isLoadingOH } = useOfficeHours({
    doctorId: user?.id,
    workLocationId: 'cm0hq6rxg000008mf3x0c6w4b',
  })
  const { data: specialShiftsData, isLoading: isLoadingSS } = useSpecialShifts(queryParams)
  const { data: clinicExceptionsData, isLoading: isLoadingCE } = useClinicExceptions({
    workLocationId: 'cm0hq6rxg000008mf3x0c6w4b',
  })

  const globalHours = officeHoursData?.global || []
  const doctorHours = officeHoursData?.doctorSpecific || []
  const specialShifts = specialShiftsData || []
  const clinicExceptions = clinicExceptionsData || []

  const isLoading = isLoadingOH || isLoadingSS || isLoadingCE

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
            <h2 className='text-2xl font-bold tracking-tight'>Lịch của tôi</h2>
            <p className='text-muted-foreground'>
              Xem lịch làm việc cuối cùng của bạn bao gồm giờ làm việc thường xuyên và ca đặc biệt.
            </p>
          </div>
        </div>

        <Alert className='mb-6'>
          <Info className='h-4 w-4' />
          <AlertDescription>
            Trang này hiển thị lịch làm việc đã được tính toán cuối cùng. Các ca đặc biệt (ngoại lệ) sẽ được ưu tiên hơn so với giờ làm việc thường xuyên.
          </AlertDescription>
        </Alert>

        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-4'>
            <Button variant='outline' size='icon' onClick={handlePrevWeek}>
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <div className='flex items-center font-medium'>
              <CalendarIcon className='mr-2 h-4 w-4 text-muted-foreground' />
              {format(currentWeekStart, 'dd/MM/yyyy')} - {format(currentWeekEnd, 'dd/MM/yyyy')}
            </div>
            <Button variant='outline' size='icon' onClick={handleNextWeek}>
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
          <Button variant='outline' onClick={() => navigate({ search: { ...search, startDate: undefined, endDate: undefined } })}>
            Hôm nay
          </Button>
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <MyScheduleTable 
            startDate={currentWeekStart}
            endDate={currentWeekEnd}
            globalHours={globalHours} 
            doctorHours={doctorHours} 
            specialShifts={specialShifts}
            clinicExceptions={clinicExceptions}
            search={search}
            navigate={navigate}
            isLoading={isLoading}
          />
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
