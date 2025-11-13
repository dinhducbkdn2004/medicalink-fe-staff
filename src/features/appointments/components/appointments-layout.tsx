import { Outlet } from '@tanstack/react-router'
import { ChangeBadgeVariantInput } from '@/calendar/components/change-badge-variant-input'
import { ChangeVisibleHoursInput } from '@/calendar/components/change-visible-hours-input'
import { ChangeWorkingHoursInput } from '@/calendar/components/change-working-hours-input'
import { CalendarProvider } from '@/calendar/contexts/calendar-context'
import { CALENDAR_ITENS_MOCK, USERS_MOCK } from '@/calendar/mocks'
import { Settings } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search } from '@/components/search'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'

export function AppointmentsLayout() {
  return (
      <CalendarProvider users={USERS_MOCK} events={CALENDAR_ITENS_MOCK}>
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
