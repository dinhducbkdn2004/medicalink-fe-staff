import { useContext } from 'react'
import {
  CalendarContext,
  type ICalendarContext,
} from './calendar-context-types'

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext)
  if (!context)
    throw new Error('useCalendar must be used within a CalendarProvider.')
  return context
}
