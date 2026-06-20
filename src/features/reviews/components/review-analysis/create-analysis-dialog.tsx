
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { reviewService } from '@/api/services'
import type { DateRangeType } from '@/api/types'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useReviewAnalysis } from './use-review-analysis'





export function CreateAnalysisDialog() {
  const { openDialog, setOpen, doctorId, onAnalysisCreated } =
    useReviewAnalysis()
  const queryClient = useQueryClient()

  const [dateRange, setDateRange] = useState<DateRangeType>('mtd')
  const [includeNonPublic, setIncludeNonPublic] = useState(false)

  const isOpen = openDialog === 'create'

  const createMutation = useMutation({
    mutationFn: () =>
      reviewService.createAnalysis({
        doctorId,
        dateRange,
        includeNonPublic,
      }),
    onSuccess: () => {
      toast.success('Đã tạo báo cáo thành công')
      queryClient.invalidateQueries({ queryKey: ['review-analyses', doctorId] })
      onAnalysisCreated?.()
      handleClose()
    },
    onError: (error: {
      response?: { status?: number; data?: { message?: string } }
      message?: string
    }) => {
      const status = error?.response?.status
      const message = error?.response?.data?.message || error.message

      if (status === 429) {
        toast.error('Rất tiếc! Hệ thống chỉ cho phép tạo 5 báo cáo mỗi giờ.')
      } else if (status === 503) {
        toast.error(
          'Rất tiếc! Hệ thống đang gặp sự cố. Vui lòng thử lại sau.'
        )
      } else if (status === 404) {
        toast.error('Không tìm thấy đánh giá cho khoảng thời gian đã chọn.')
      } else {
        toast.error(message || 'Không thể tạo báo cáo')
      }
    },
  })

  const handleClose = () => {
    if (!createMutation.isPending) {
      setOpen(null)
      setDateRange('mtd')
      setIncludeNonPublic(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='sm:max-w-[500px]'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tạo phân tích đánh giá</DialogTitle>
            <DialogDescription>
              Sử dụng AI để phân tích đánh giá và tạo báo cáo chuyên sâu
            </DialogDescription>
          </DialogHeader>

          {createMutation.isPending ? (
            <div className='space-y-4 py-6'>
              <div className='flex items-center justify-center'>
                <div className='border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent' />
              </div>
              <Progress value={66} className='w-full' />
              <p className='text-muted-foreground text-center text-sm'>
                Đang phân tích đánh giá từ{' '}
                {dateRange === 'mtd' ? '30 ngày' : '365 ngày'}. Thao tác này sẽ
                mất 20-30 giây.
              </p>
            </div>
          ) : (
            <div className='space-y-5 py-4'>
              <div className='space-y-3'>
                <Label className='text-sm font-medium'>Khoảng thời gian</Label>
                <RadioGroup
                  value={dateRange}
                  onValueChange={(value) =>
                    setDateRange(value as DateRangeType)
                  }
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='mtd' id='mtd' />
                    <Label htmlFor='mtd' className='font-normal'>
                      30 ngày vừa qua
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='ytd' id='ytd' />
                    <Label htmlFor='ytd' className='font-normal'>
                      365 ngày vừa qua
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className='flex items-start space-x-2'>
                <Checkbox
                  id='includeNonPublic'
                  checked={includeNonPublic}
                  onCheckedChange={(checked) =>
                    setIncludeNonPublic(checked === true)
                  }
                />
                <div className='grid gap-1 leading-none'>
                  <Label
                    htmlFor='includeNonPublic'
                    className='cursor-pointer font-normal'
                  >
                    Bao gồm các đánh giá không công khai
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    Bao gồm các đánh giá từ người dùng chưa hoàn thành cuộc hẹn
                  </p>
                </div>
              </div>

              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription className='text-xs'>
                  sẽ sử dụng 1 trên 5 yêu cầu phân tích hàng giờ
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              Hủy
            </Button>
            <Button type='submit' disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Đang tạo...' : 'Tạo phân tích'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
