import { formatDate } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useCalendar } from '@/calendar/contexts/use-calendar'

export function TodayButton() {
  const { setSelectedDate } = useCalendar()

  const today = new Date()
  const handleClick = () => setSelectedDate(today)

  return (
    <button
      className='focus-visible:ring-ring flex size-14 flex-col items-start overflow-hidden rounded-lg border focus-visible:ring-1 focus-visible:outline-none'
      onClick={handleClick}
    >
      <p className='bg-primary text-primary-foreground flex h-6 w-full items-center justify-center text-center text-xs font-semibold'>
        {formatDate(today, 'MMM', { locale: vi }).toUpperCase()}
      </p>
      <p className='flex w-full items-center justify-center text-lg font-bold'>
        {today.getDate()}
      </p>
    </button>
  )
}
