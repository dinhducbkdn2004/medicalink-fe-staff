
import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import type {
  DoctorBookingSortBy,
  DoctorBookingStatsParams,
} from '@/api/types/stats.types'
import { useDoctorsBookingStats } from '@/hooks/use-stats'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const sortOptions: { value: DoctorBookingSortBy; label: string }[] = [
  { value: 'booked', label: 'Chờ xác nhận (Đã đặt)' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'completedRate', label: 'Tỷ lệ hoàn thành' },
]

export function AdminDoctorBookingStats() {
  const [params, setParams] = useState<DoctorBookingStatsParams>({
    page: 1,
    limit: 10,
    sortBy: 'completedRate',
    sortOrder: 'DESC',
  })

  const { data, isLoading, error } = useDoctorsBookingStats(params)

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit: string) => {
    setParams((prev) => ({ ...prev, limit: parseInt(newLimit), page: 1 }))
  }

  const handleSortChange = (newSort: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: newSort as DoctorBookingSortBy,
      page: 1,
    }))
  }

  const handleSortOrderToggle = () => {
    setParams((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC',
      page: 1,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê đặt lịch của Bác sĩ</CardTitle>
        <CardDescription>
          Thống kê đặt lịch cho tất cả bác sĩ với phân trang và sắp xếp
        </CardDescription>
      </CardHeader>
      <CardContent>
        {}
        <div className='mb-4 flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium'>Sắp xếp theo:</label>
            <Select value={params.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant='outline' size='sm' onClick={handleSortOrderToggle}>
            {params.sortOrder === 'ASC' ? '↑ Tăng dần' : '↓ Giảm dần'}
          </Button>

          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium'>Số dòng/trang:</label>
            <Select
              value={params.limit?.toString()}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className='w-[100px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5</SelectItem>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='20'>20</SelectItem>
                <SelectItem value='50'>50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {}
        {error && (
          <div className='bg-destructive/10 text-destructive rounded-md p-4'>
            Lỗi tải thống kê: {error.message}
          </div>
        )}

        {}
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bác sĩ</TableHead>
                <TableHead className='text-right'>Tổng cộng</TableHead>
                <TableHead className='text-right'>Chờ xác nhận</TableHead>
                <TableHead className='text-right'>Đã xác nhận</TableHead>
                <TableHead className='text-right'>Đã hủy</TableHead>
                <TableHead className='text-right'>Đã hoàn thành</TableHead>
                <TableHead className='text-right'>Tỷ lệ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                
                Array.from({ length: params.limit || 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-4 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='ml-auto h-4 w-12' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='ml-auto h-4 w-12' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='ml-auto h-4 w-12' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='ml-auto h-4 w-12' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='ml-auto h-4 w-12' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='ml-auto h-4 w-16' />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-muted-foreground text-center'
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((item) => (
                  <TableRow key={item.doctorStaffAccountId}>
                    <TableCell className='font-medium'>
                      {item.doctor.fullName}
                      {item.doctor.id === 'invalid-id' && (
                        <span className='text-muted-foreground ml-2 text-xs'>
                          (Đã xóa)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>{item.total}</TableCell>
                    <TableCell className='text-right'>
                      {item.bookedCount}
                    </TableCell>
                    <TableCell className='text-right'>
                      {item.confirmedCount}
                    </TableCell>
                    <TableCell className='text-right'>
                      {item.cancelledCount}
                    </TableCell>
                    <TableCell className='text-right'>
                      {item.completedCount}
                    </TableCell>
                    <TableCell className='text-right font-semibold'>
                      {item.completedRate.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {}
        {data && (
          <div className='mt-4 flex items-center justify-between'>
            <div className='text-muted-foreground text-sm'>
              Hiển thị {(data.meta.page - 1) * data.meta.limit + 1} đến{' '}
              {Math.min(data.meta.page * data.meta.limit, data.meta.total)} của{' '}
              {data.meta.total} kết quả
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handlePageChange(1)}
                disabled={!data.meta.hasPrev}
              >
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handlePageChange(data.meta.page - 1)}
                disabled={!data.meta.hasPrev}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <span className='text-sm'>
                Trang {data.meta.page} trên {data.meta.totalPages}
              </span>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handlePageChange(data.meta.page + 1)}
                disabled={!data.meta.hasNext}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handlePageChange(data.meta.totalPages)}
                disabled={!data.meta.hasNext}
              >
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
