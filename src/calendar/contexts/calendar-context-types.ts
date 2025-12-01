import { createContext, type Dispatch, type SetStateAction } from 'react'
import type { IEvent, IUser } from '@/calendar/interfaces'
import type {
  TBadgeVariant,
  TVisibleHours,
  TWorkingHours,
} from '@/calendar/types'

export interface ICalendarContext {
  selectedDate: Date
  setSelectedDate: (date: Date | undefined) => void
  selectedUserId: IUser['id'] | 'all'
  setSelectedUserId: (userId: IUser['id'] | 'all') => void
  badgeVariant: TBadgeVariant
  setBadgeVariant: (variant: TBadgeVariant) => void
  users: IUser[]
  workingHours: TWorkingHours
  setWorkingHours: Dispatch<SetStateAction<TWorkingHours>>
  visibleHours: TVisibleHours
  setVisibleHours: Dispatch<SetStateAction<TVisibleHours>>
  events: IEvent[]
  setLocalEvents: Dispatch<SetStateAction<IEvent[]>>
}

export const CalendarContext = createContext({} as ICalendarContext)
