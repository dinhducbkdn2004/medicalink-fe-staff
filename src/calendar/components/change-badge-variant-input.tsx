'use client'

import { useCalendar } from '@/calendar/contexts/use-calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ChangeBadgeVariantInput() {
  const { badgeVariant, setBadgeVariant } = useCalendar()

  return (
    <div className='space-y-2'>
      <p className='text-sm font-semibold'>Thay đổi kiểu hiển thị</p>

      <Select value={badgeVariant} onValueChange={setBadgeVariant}>
        <SelectTrigger className='w-48'>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='dot'>Dấu chấm</SelectItem>
          <SelectItem value='colored'>Đổ màu</SelectItem>
          <SelectItem value='mixed'>Hỗn hợp</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
