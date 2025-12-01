import { parseISO, areIntervalsOverlapping, format } from 'date-fns'
import { AddEventDialog } from '@/calendar/components/dialogs/add-event-dialog'
import { DroppableTimeBlock } from '@/calendar/components/dnd/droppable-time-block'
import { CalendarTimeline } from '@/calendar/components/week-and-day-view/calendar-time-line'
import { DayViewMultiDayEventsRow } from '@/calendar/components/week-and-day-view/day-view-multi-day-events-row'
import { EventBlock } from '@/calendar/components/week-and-day-view/event-block'
import { useCalendar } from '@/calendar/contexts/use-calendar'
import {
  groupEvents,
  getEventBlockStyle,
  isWorkingHour,
  getCurrentEvents,
  getVisibleHours,
} from '@/calendar/helpers'
import type { IEvent } from '@/calendar/interfaces'
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { ScrollArea } from '@/components/ui/scroll-area'

interface IProps {
  singleDayEvents: IEvent[]
  multiDayEvents: IEvent[]
}

export function CalendarDayView({
  singleDayEvents,
  multiDayEvents,
}: Readonly<IProps>) {
  const { selectedDate, setSelectedDate, users, visibleHours, workingHours } =
    useCalendar()

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(
    visibleHours,
    singleDayEvents
  )

  const currentEvents = getCurrentEvents(singleDayEvents)

  const dayEvents = singleDayEvents.filter((event) => {
    const eventDate = parseISO(event.startDate)
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  const groupedEvents = groupEvents(dayEvents)

  return (
    <div className='flex'>
      <div className='flex flex-1 flex-col'>
        <div>
          <DayViewMultiDayEventsRow
            selectedDate={selectedDate}
            multiDayEvents={multiDayEvents}
          />

          {/* Day header */}
          <div className='relative z-20 flex border-b'>
            <div className='w-18'></div>
            <span className='text-muted-foreground flex-1 border-l py-2 text-center text-xs font-medium'>
              {format(selectedDate, 'EE')}{' '}
              <span className='text-foreground font-semibold'>
                {format(selectedDate, 'd')}
              </span>
            </span>
          </div>
        </div>

        <ScrollArea className='h-[800px]' type='always'>
          <div className='flex'>
            {/* Hours column */}
            <div className='relative w-18'>
              {hours.map((hour, index) => (
                <div key={hour} className='relative' style={{ height: '96px' }}>
                  <div className='absolute -top-3 right-2 flex h-6 items-center'>
                    {index !== 0 && (
                      <span className='text-muted-foreground text-xs'>
                        {format(new Date().setHours(hour, 0, 0, 0), 'hh a')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className='relative flex-1 border-l'>
              <div className='relative'>
                {hours.map((hour, index) => {
                  const isDisabled = !isWorkingHour(
                    selectedDate,
                    hour,
                    workingHours
                  )

                  return (
                    <div
                      key={hour}
                      className={cn(
                        'relative',
                        isDisabled && 'bg-calendar-disabled-hour'
                      )}
                      style={{ height: '96px' }}
                    >
                      {index !== 0 && (
                        <div className='pointer-events-none absolute inset-x-0 top-0 border-b'></div>
                      )}

                      <DroppableTimeBlock
                        date={selectedDate}
                        hour={hour}
                        minute={0}
                      >
                        <AddEventDialog
                          startDate={selectedDate}
                          startTime={{ hour, minute: 0 }}
                        >
                          <div className='hover:bg-accent absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors' />
                        </AddEventDialog>
                      </DroppableTimeBlock>

                      <DroppableTimeBlock
                        date={selectedDate}
                        hour={hour}
                        minute={15}
                      >
                        <AddEventDialog
                          startDate={selectedDate}
                          startTime={{ hour, minute: 15 }}
                        >
                          <div className='hover:bg-accent absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors' />
                        </AddEventDialog>
                      </DroppableTimeBlock>

                      <div className='pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed'></div>

                      <DroppableTimeBlock
                        date={selectedDate}
                        hour={hour}
                        minute={30}
                      >
                        <AddEventDialog
                          startDate={selectedDate}
                          startTime={{ hour, minute: 30 }}
                        >
                          <div className='hover:bg-accent absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors' />
                        </AddEventDialog>
                      </DroppableTimeBlock>

                      <DroppableTimeBlock
                        date={selectedDate}
                        hour={hour}
                        minute={45}
                      >
                        <AddEventDialog
                          startDate={selectedDate}
                          startTime={{ hour, minute: 45 }}
                        >
                          <div className='hover:bg-accent absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors' />
                        </AddEventDialog>
                      </DroppableTimeBlock>
                    </div>
                  )
                })}

                {groupedEvents.map((group, groupIndex) =>
                  group.map((event) => {
                    let style = getEventBlockStyle(
                      event,
                      selectedDate,
                      groupIndex,
                      groupedEvents.length,
                      { from: earliestEventHour, to: latestEventHour }
                    )
                    const hasOverlap = groupedEvents.some(
                      (otherGroup, otherIndex) =>
                        otherIndex !== groupIndex &&
                        otherGroup.some((otherEvent) =>
                          areIntervalsOverlapping(
                            {
                              start: parseISO(event.startDate),
                              end: parseISO(event.endDate),
                            },
                            {
                              start: parseISO(otherEvent.startDate),
                              end: parseISO(otherEvent.endDate),
                            }
                          )
                        )
                    )

                    if (!hasOverlap)
                      style = { ...style, width: '100%', left: '0%' }

                    return (
                      <div
                        key={event.id}
                        className='absolute p-1'
                        style={style}
                      >
                        <EventBlock event={event} />
                      </div>
                    )
                  })
                )}
              </div>

              <CalendarTimeline
                firstVisibleHour={earliestEventHour}
                lastVisibleHour={latestEventHour}
              />
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className='hidden w-80 flex-col divide-y border-l md:flex'>
        <div className='p-4'>
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>

        <div className='flex flex-1 flex-col overflow-hidden'>
          <div className='px-4 pt-4'>
            {currentEvents.length > 0 ? (
              <div className='flex items-start gap-2'>
                <span className='relative mt-[5px] flex size-2.5 shrink-0'>
                  <span className='absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75'></span>
                  <span className='relative inline-flex size-2.5 rounded-full bg-green-600'></span>
                </span>
                <p className='text-foreground text-sm font-semibold'>
                  Happening now
                </p>
              </div>
            ) : (
              <p className='text-muted-foreground text-center text-sm italic'>
                No appointments or consultations at the moment
              </p>
            )}
          </div>

          {currentEvents.length > 0 && (
            <ScrollArea className='h-[422px] px-4 pt-3' type='always'>
              <div className='space-y-4 pr-2 pb-4'>
                {currentEvents.map((event) => {
                  const user = users.find((user) => user.id === event.user.id)

                  return (
                    <div
                      key={event.id}
                      className='bg-card space-y-2 rounded-lg border p-3 shadow-sm'
                    >
                      <p className='line-clamp-2 text-sm leading-tight font-semibold'>
                        {event.title}
                      </p>

                      {user && (
                        <div className='text-muted-foreground flex items-center gap-1.5'>
                          <User className='size-3.5 shrink-0' />
                          <span className='truncate text-xs'>{user.name}</span>
                        </div>
                      )}

                      <div className='text-muted-foreground flex items-center gap-1.5'>
                        <CalendarIcon className='size-3.5 shrink-0' />
                        <span className='text-xs'>
                          {format(new Date(), 'MMM d, yyyy')}
                        </span>
                      </div>

                      <div className='text-muted-foreground flex items-center gap-1.5'>
                        <Clock className='size-3.5 shrink-0' />
                        <span className='text-xs'>
                          {format(parseISO(event.startDate), 'h:mm a')} -{' '}
                          {format(parseISO(event.endDate), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}
