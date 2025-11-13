import { Outlet } from '@tanstack/react-router'
import { ChangeBadgeVariantInput } from '@/calendar/components/change-badge-variant-input'
import { ChangeVisibleHoursInput } from '@/calendar/components/change-visible-hours-input'
import { ChangeWorkingHoursInput } from '@/calendar/components/change-working-hours-input'
import { CalendarProvider } from '@/calendar/contexts/calendar-context'
import { Settings, AlertCircle, Loader2 } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useAppointments } from '../data/hooks'
import {
  transformAppointmentsToEvents,
  extractUsersFromAppointments,
} from '../data/utils'

export function AppointmentsLayout() {
  // Fetch appointments with a large limit to get all appointments for the calendar
  const { data, isLoading, isError, error } = useAppointments({
    page: 1,
    limit: 100,
  })

  // Loading state
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='text-primary size-8 animate-spin' />
          <p className='text-muted-foreground text-sm'>
            Loading appointments...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className='flex h-screen items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='size-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message ||
              'Failed to load appointments. Please try again later.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Transform API data to calendar format
  const appointments = data?.data || []
  const events = transformAppointmentsToEvents(appointments)
  const users = extractUsersFromAppointments(appointments)

  return (
    <CalendarProvider users={users} events={events}>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='mx-auto flex w-full max-w-screen-2xl flex-col gap-4'>
          <Outlet />
          <Accordion type='single' collapsible>
            <AccordionItem value='item-1' className='border-none'>
              <AccordionTrigger className='flex-none gap-2 py-0 hover:no-underline'>
                <div className='flex items-center gap-2'>
                  <Settings className='size-4' />
                  <p className='text-base font-semibold'>Calendar settings</p>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className='mt-4 flex flex-col gap-6'>
                  <ChangeBadgeVariantInput />
                  <ChangeVisibleHoursInput />
                  <ChangeWorkingHoursInput />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Main>
    </CalendarProvider>
  )
}
