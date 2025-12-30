import { useMemo, useState, useCallback } from 'react'
import type { IEvent, IUser } from '@/calendar/interfaces'
import type {
  TBadgeVariant,
  TVisibleHours,
  TWorkingHours,
} from '@/calendar/types'
import { CalendarContext } from './calendar-context-types'

export type { ICalendarContext } from './calendar-context-types'

const WORKING_HOURS = {
  0: { from: 0, to: 0 },
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 },
}

const VISIBLE_HOURS = { from: 7, to: 18 }

export function CalendarProvider({
  children,
  selectedDate: propsSelectedDate,
  onDateChange,
  users,
  events,
}: Readonly<{
  children: React.ReactNode
  selectedDate?: Date
  onDateChange?: (date: Date) => void
  users: IUser[]
  events: IEvent[]
}>) {
  const [badgeVariant, setBadgeVariant] = useState<TBadgeVariant>('colored')
  const [visibleHours, setVisibleHours] = useState<TVisibleHours>(VISIBLE_HOURS)
  const [workingHours, setWorkingHours] = useState<TWorkingHours>(WORKING_HOURS)

  const [internalSelectedDate, setInternalSelectedDate] = useState(new Date())
  const selectedDate = propsSelectedDate ?? internalSelectedDate

  const [selectedUserId, setSelectedUserId] = useState<IUser['id'] | 'all'>(
    'all'
  )

  const handleSelectDate = useCallback(
    (date: Date | undefined) => {
      if (!date) return
      if (onDateChange) {
        onDateChange(date)
      } else {
        setInternalSelectedDate(date)
      }
    },
    [onDateChange]
  )

  const value = useMemo(
    () => ({
      selectedDate,
      setSelectedDate: handleSelectDate,
      selectedUserId,
      setSelectedUserId,
      badgeVariant,
      setBadgeVariant,
      users,
      visibleHours,
      setVisibleHours,
      workingHours,
      setWorkingHours,
      events,
      setLocalEvents: () => {}, 
    }),
    [
      selectedDate,
      handleSelectDate,
      selectedUserId,
      badgeVariant,
      users,
      visibleHours,
      workingHours,
      events,
    ]
  )

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  )
}
