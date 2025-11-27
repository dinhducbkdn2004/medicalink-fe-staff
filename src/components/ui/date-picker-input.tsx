import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

// Parse ISO string theo local timezone (không phải UTC)
function parseLocalDate(dateString: string): Date | undefined {
  if (!dateString) return undefined

  const [year, month, day] = dateString.split('-').map(Number)
  if (!year || !month || !day) return undefined

  const date = new Date(year, month - 1, day)
  return date
}

// Convert Date thành ISO string (YYYY-MM-DD) theo local date
function toLocalISOString(date: Date | undefined): string {
  if (!date || !isValidDate(date)) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

interface DatePickerInputProps {
  value?: Date | string
  onChange?: (date: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePickerInput({
  value: initialValue,
  onChange,
  placeholder = 'Select date',
  className,
  disabled,
}: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!initialValue) return undefined
    if (initialValue instanceof Date) return initialValue
    return parseLocalDate(initialValue)
  })
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [inputValue, setInputValue] = React.useState(formatDate(date))

  React.useEffect(() => {
    const newDate =
      initialValue instanceof Date
        ? initialValue
        : parseLocalDate(initialValue as string)
    setDate(newDate)
    setMonth(newDate)
    setInputValue(formatDate(newDate))
  }, [initialValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    const newDate = parseLocalDate(newValue)
    if (isValidDate(newDate)) {
      setDate(newDate)
      setMonth(newDate)
      onChange?.(toLocalISOString(newDate))
    } else if (newValue === '') {
      setDate(undefined)
      onChange?.('')
    }
  }

  const handleCalendarSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    setInputValue(formatDate(newDate))
    onChange?.(toLocalISOString(newDate))
    setOpen(false)
  }

  return (
    <div className={cn('relative flex gap-2', className)}>
      <Input
        value={inputValue}
        placeholder={placeholder}
        className='bg-background pr-10'
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        disabled={disabled}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
            disabled={disabled}
          >
            <CalendarIcon className='size-3.5' />
            <span className='sr-only'>Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto overflow-hidden p-0'
          align='end'
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode='single'
            selected={date}
            captionLayout='dropdown'
            month={month}
            onMonthChange={setMonth}
            onSelect={handleCalendarSelect}
            disabled={(d) => d > new Date() || d < new Date('1900-01-01')}
            fromYear={1900}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
