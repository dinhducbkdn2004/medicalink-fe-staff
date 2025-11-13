import { useMemo } from 'react'
import { isToday, startOfDay } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { DroppableDayCell } from '@/calendar/components/dnd/droppable-day-cell'
import { EventBullet } from '@/calendar/components/month-view/event-bullet'
import { MonthEventBadge } from '@/calendar/components/month-view/month-event-badge'
import { useCalendar } from '@/calendar/contexts/calendar-context'
import { getMonthCellEvents } from '@/calendar/helpers'
import type { ICalendarCell, IEvent } from '@/calendar/interfaces'
import { cn } from '@/lib/utils'

interface IProps {
  cell: ICalendarCell
  events: IEvent[]
  eventPositions: Record<string, number>
}

const MAX_VISIBLE_EVENTS = 3

export function DayCell({ cell, events, eventPositions }: IProps) {
  const navigate = useNavigate()
  const { setSelectedDate } = useCalendar()

  const { day, currentMonth, date } = cell

  const cellEvents = useMemo(
    () => getMonthCellEvents(date, events, eventPositions),
    [date, events, eventPositions]
  )
  const isSunday = date.getDay() === 0

  const handleClick = () => {
    setSelectedDate(date)
    navigate({ to: '/appointments/day-view' })
  }

  return (
    <DroppableDayCell cell={cell}>
      <div
        className={cn(
          'flex h-full flex-col gap-1 border-t border-l py-1.5 lg:pt-1 lg:pb-2',
          isSunday && 'border-l-0'
        )}
      >
        <button
          onClick={handleClick}
          className={cn(
            'hover:bg-accent focus-visible:ring-ring flex size-6 translate-x-1 items-center justify-center rounded-full text-xs font-semibold focus-visible:ring-1 focus-visible:outline-none lg:px-2',
            !currentMonth && 'opacity-20',
            isToday(date) &&
              'bg-primary text-primary-foreground hover:bg-primary font-bold'
          )}
        >
          {day}
        </button>

        <div
          className={cn(
            'flex h-6 gap-1 px-2 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0',
            !currentMonth && 'opacity-50'
          )}
        >
          {[0, 1, 2].map((position) => {
            const event = cellEvents.find((e) => e.position === position)
            const eventKey = event
              ? `event-${event.id}-${position}`
              : `empty-${position}`

            return (
              <div key={eventKey} className='lg:flex-1'>
                {event && (
                  <>
                    <EventBullet className='lg:hidden' color={event.color} />
                    <MonthEventBadge
                      className='hidden lg:flex'
                      event={event}
                      cellDate={startOfDay(date)}
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>

        {cellEvents.length > MAX_VISIBLE_EVENTS && (
          <p
            className={cn(
              'text-muted-foreground h-4.5 px-1.5 text-xs font-semibold',
              !currentMonth && 'opacity-50'
            )}
          >
            <span className='sm:hidden'>
              +{cellEvents.length - MAX_VISIBLE_EVENTS}
            </span>
            <span className='hidden sm:inline'>
              {' '}
              {cellEvents.length - MAX_VISIBLE_EVENTS} more...
            </span>
          </p>
        )}
      </div>
    </DroppableDayCell>
  )
}
