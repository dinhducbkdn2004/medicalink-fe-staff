import { useState, useCallback, useMemo } from 'react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  startOfDay,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface TimeSlot {
  timeStart: string
  timeEnd: string
}

interface AppointmentSchedulerDialogProps {
  readonly children: React.ReactNode
  readonly availableDates: string[]
  readonly slots: TimeSlot[]
  readonly isLoadingSlots: boolean
  readonly onDateSelect: (date: Date) => void
  readonly onSlotSelect: (slot: TimeSlot) => void
  readonly selectedDate?: Date
  readonly selectedSlot?: TimeSlot
  readonly disabled?: boolean
}

export function AppointmentSchedulerDialog({
  children,
  availableDates,
  slots,
  isLoadingSlots,
  onDateSelect,
  onSlotSelect,
  selectedDate,
  selectedSlot,
  disabled,
}: AppointmentSchedulerDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = useCallback(() => {
    setCurrentMonth((prev) => subMonths(prev, 1))
  }, [])

  const nextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1))
  }, [])

  const handleDateClick = useCallback(
    (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd')
      if (availableDates.includes(dateStr)) {
        onDateSelect(date)
      }
    },
    [availableDates, onDateSelect]
  )

  const handleSlotClick = useCallback(
    (slot: TimeSlot) => {
      onSlotSelect(slot)
    },
    [onSlotSelect]
  )

  const handleConfirm = useCallback(() => {
    if (selectedDate && selectedSlot) {
      setIsOpen(false)
    }
  }, [selectedDate, selectedSlot])

  const availableSlotsCount = useMemo(() => slots.length, [slots])

  const canConfirm = selectedDate && selectedSlot

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>

      <DialogContent className='max-w-md p-0'>
        <div className='p-4'>
          {/* Calendar Header */}
          <div className='mb-4 grid grid-cols-3 items-center gap-2'>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={previousMonth}
              className='h-8 w-8'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <div className='text-center font-semibold'>
              Month {format(currentMonth, 'M / yyyy')}
            </div>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={nextMonth}
              className='h-8 w-8 justify-self-end'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>

          {/* Day of Week Headers */}
          <div className='text-muted-foreground mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium'>
            <div>T2</div>
            <div>T3</div>
            <div>T4</div>
            <div>T5</div>
            <div>T6</div>
            <div>T7</div>
            <div>CN</div>
          </div>

          {/* Calendar Grid */}
          <div className='mb-4 grid grid-cols-7 gap-1'>
            {/* Empty cells for days before month start */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map(
              (_, i) => (
                <div key={`empty-${monthStart.getTime()}-${i}`} />
              )
            )}

            {/* Days of month */}
            {daysInMonth.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd')
              const isAvailable = availableDates.includes(dateStr)
              const isSelected = selectedDate && isSameDay(date, selectedDate)
              const isPast = isBefore(date, startOfDay(new Date()))
              const isDisabled = !isAvailable || isPast

              return (
                <button
                  key={dateStr}
                  type='button'
                  onClick={() => handleDateClick(date)}
                  disabled={isDisabled}
                  className={cn(
                    'relative aspect-square rounded-md text-sm transition-all',
                    'hover:bg-muted',
                    isSelected &&
                      'bg-primary text-primary-foreground hover:bg-primary/90',
                    !isSelected && isAvailable && 'font-semibold',
                    isDisabled &&
                      'text-muted-foreground cursor-not-allowed opacity-50'
                  )}
                >
                  <span>{format(date, 'd')}</span>
                  {isAvailable && !isSelected && (
                    <span className='absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-600' />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className='mb-4 flex items-center gap-2 text-xs'>
            <div className='h-1 w-1 rounded-full bg-blue-600' />
            <span className='font-semibold'>
              Days with available appointments
            </span>
          </div>

          {/* Time Slots Section */}
          <div className='space-y-2'>
            <div className='font-semibold'>Select appointment time slot</div>

            {selectedDate ? (
              <>
                {isLoadingSlots && (
                  <div className='rounded-md border p-4 text-center text-sm'>
                    Loading time slots...
                  </div>
                )}

                {!isLoadingSlots && slots.length === 0 && (
                  <div className='border-destructive text-destructive rounded-md border p-4 text-center text-sm'>
                    No available time slots for the selected date.
                  </div>
                )}

                {!isLoadingSlots && slots.length > 0 && (
                  <>
                    <div className='grid max-h-48 grid-cols-3 gap-2 overflow-y-auto rounded-md border p-3'>
                      {slots.map((slot, index) => {
                        const isSelected =
                          selectedSlot?.timeStart === slot.timeStart &&
                          selectedSlot?.timeEnd === slot.timeEnd

                        return (
                          <button
                            key={`${slot.timeStart}-${slot.timeEnd}-${index}`}
                            type='button'
                            onClick={() => handleSlotClick(slot)}
                            className={cn(
                              'rounded-md border p-2 text-xs transition-all',
                              isSelected &&
                                'border-primary bg-primary text-primary-foreground',
                              !isSelected &&
                                'hover:border-primary hover:bg-muted'
                            )}
                          >
                            <div className='font-medium'>{slot.timeStart}</div>
                            <div className='text-[10px] opacity-70'>
                              đến {slot.timeEnd}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                    <div className='text-muted-foreground text-xs'>
                      {availableSlotsCount} available time slots
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className='text-muted-foreground rounded-md border border-dashed p-4 text-center text-sm'>
                Please select a date first
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <Button
            type='button'
            onClick={handleConfirm}
            disabled={!canConfirm}
            className='mt-4 w-full'
          >
            {canConfirm
              ? `Confirm: ${format(selectedDate, 'dd/MM/yyyy')} • ${selectedSlot.timeStart}-${selectedSlot.timeEnd}`
              : 'Please select both a date and a time slot'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
