'use client'

import { useState } from 'react'
import { useCalendar } from '@/calendar/contexts/use-calendar'
import { Info } from 'lucide-react'
import type { TimeValue } from 'react-aria-components'
import { Button } from '@/components/ui/button'
import { TimeInput } from '@/components/ui/time-input'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'

export function ChangeVisibleHoursInput() {
  const { visibleHours, setVisibleHours } = useCalendar()

  const [from, setFrom] = useState<{ hour: number; minute: number }>({
    hour: visibleHours.from,
    minute: 0,
  })
  const [to, setTo] = useState<{ hour: number; minute: number }>({
    hour: visibleHours.to,
    minute: 0,
  })

  const handleApply = () => {
    const toHour = to.hour === 0 ? 24 : to.hour
    setVisibleHours({ from: from.hour, to: toHour })
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-2'>
        <p className='text-sm font-semibold'>Thay đổi giờ hiển thị</p>

        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Info className='size-3' />
            </TooltipTrigger>

            <TooltipContent className='max-w-80 text-center'>
              <p>
                Nếu có sự kiện nằm ngoài giờ hiển thị, hệ thống sẽ tự động điều chỉnh để hiển thị sự kiện đó.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className='flex items-center gap-4'>
        <p>Từ</p>
        <TimeInput
          id='start-time'
          hourCycle={12}
          granularity='hour'
          value={from as TimeValue}
          onChange={setFrom as (value: TimeValue | null) => void}
        />
        <p>Đến</p>
        <TimeInput
          id='end-time'
          hourCycle={12}
          granularity='hour'
          value={to as TimeValue}
          onChange={setTo as (value: TimeValue | null) => void}
        />
      </div>

      <Button className='mt-4 w-fit' onClick={handleApply}>
        Áp dụng
      </Button>
    </div>
  )
}
