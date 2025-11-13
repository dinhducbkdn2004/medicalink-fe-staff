import { useState } from 'react'
import { ClientContainer } from '@/calendar/components/client-container'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { TCalendarView } from '@/calendar/types'

export function CalendarViewSwitcher() {
  const [view, setView] = useState<TCalendarView>('month')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select
          value={view}
          onValueChange={(value) => setView(value as TCalendarView)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">
              Day
            </SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="agenda">Agenda</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  )
}


