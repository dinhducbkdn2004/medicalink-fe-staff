import { useMemo } from 'react'
import { DayCell } from '@/calendar/components/month-view/day-cell'
import { useCalendar } from '@/calendar/contexts/use-calendar'
import {
  getCalendarCells,
  calculateMonthEventPositions,
} from '@/calendar/helpers'
import type { IEvent } from '@/calendar/interfaces'

interface IProps {
  singleDayEvents: IEvent[]
  multiDayEvents: IEvent[]
}

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarMonthView({
  singleDayEvents,
  multiDayEvents,
}: Readonly<IProps>) {
  const { selectedDate } = useCalendar()

  const allEvents = [...multiDayEvents, ...singleDayEvents]

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate])

  const eventPositions = useMemo(
    () =>
      calculateMonthEventPositions(
        multiDayEvents,
        singleDayEvents,
        selectedDate
      ),
    [multiDayEvents, singleDayEvents, selectedDate]
  )

  return (
    <div>
      <div className='grid grid-cols-7 divide-x'>
        {WEEK_DAYS.map((day) => (
          <div key={day} className='flex items-center justify-center py-2'>
            <span className='text-muted-foreground text-xs font-medium'>
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7 overflow-hidden'>
        {cells.map((cell) => (
          <DayCell
            key={cell.date.toISOString()}
            cell={cell}
            events={allEvents}
            eventPositions={eventPositions}
          />
        ))}
      </div>
    </div>
  )
}
