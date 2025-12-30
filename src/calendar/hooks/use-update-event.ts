import { useCalendar } from '@/calendar/contexts/use-calendar'
import type { IEvent } from '@/calendar/interfaces'

export function useUpdateEvent() {
  const { setLocalEvents } = useCalendar()

  const updateEvent = (event: IEvent) => {
    const newEvent: IEvent = event

    newEvent.startDate = new Date(event.startDate).toISOString()
    newEvent.endDate = new Date(event.endDate).toISOString()

    setLocalEvents((prev) => {
      const index = prev.findIndex((e) => e.id === event.id)
      if (index === -1) return prev
      return [...prev.slice(0, index), newEvent, ...prev.slice(index + 1)]
    })
  }

  return { updateEvent }
}
