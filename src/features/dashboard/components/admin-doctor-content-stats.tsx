
import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Star,
} from 'lucide-react'
import type {
  DoctorContentSortBy,
  DoctorContentStatsParams,
} from '@/api/types/stats.types'
import { useDoctorsContentStats } from '@/hooks/use-stats'
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

const sortOptions: { value: DoctorContentSortBy; label: string }[] = [
  { value: 'totalReviews', label: 'Total Reviews' },
  { value: 'averageRating', label: 'Average Rating' },
  { value: 'totalAnswers', label: 'Total Answers' },
  { value: 'totalAcceptedAnswers', label: 'Accepted Answers' },
  { value: 'totalBlogs', label: 'Published Blogs' },
]

export function AdminDoctorContentStats() {
  const [params, setParams] = useState<DoctorContentStatsParams>({
    page: 1,
    limit: 10,
    sortBy: 'averageRating',
    sortOrder: 'DESC',
  })

  const { data, isLoading, error } = useDoctorsContentStats(params)

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit: string) => {
    setParams((prev) => ({ ...prev, limit: parseInt(newLimit), page: 1 }))
  }

  const handleSortChange = (newSort: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: newSort as DoctorContentSortBy,
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

  
  const RatingDisplay = ({ rating }: { rating: number }) => {
    return (
      <div className='flex items-center gap-1'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-3 w-3 ${
              index < Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className='ml-1 text-sm'>{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Content Statistics</CardTitle>
        <CardDescription>
          Content statistics (reviews, Q&A, blogs) for all doctors
        </CardDescription>
      </CardHeader>
      <CardContent>
        {}
        <div className='mb-4 flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium'>Sort by:</label>
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
            {params.sortOrder === 'ASC' ? '↑ Ascending' : '↓ Descending'}
          </Button>

          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium'>Per page:</label>
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
            Error loading stats: {error.message}
          </div>
        )}

        {}
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead className='text-right'>Reviews</TableHead>
                <TableHead className='text-right'>Rating</TableHead>
                <TableHead className='text-right'>Answers</TableHead>
                <TableHead className='text-right'>Accepted</TableHead>
                <TableHead className='text-right'>Accept Rate</TableHead>
                <TableHead className='text-right'>Blogs</TableHead>
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
                      <Skeleton className='ml-auto h-4 w-20' />
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
                    <TableCell>
                      <Skeleton className='ml-auto h-4 w-12' />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='text-muted-foreground text-center'
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((item) => (
                  <TableRow key={item.doctorStaffAccountId}>
                    <TableCell className='font-medium'>
                      {item.doctor.fullName}
                      {item.doctor.id === 'invalid-id' && (
                        <span className='text-muted-foreground ml-2 text-xs'>
                          (Deleted)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      {item.totalReviews}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end'>
                        <RatingDisplay rating={item.averageRating} />
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>
                      {item.totalAnswers}
                    </TableCell>
                    <TableCell className='text-right'>
                      {item.totalAcceptedAnswers}
                    </TableCell>
                    <TableCell className='text-right font-semibold'>
                      {item.answerAcceptedRate.toFixed(1)}%
                    </TableCell>
                    <TableCell className='text-right'>
                      {item.totalBlogs}
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
              Showing {(data.meta.page - 1) * data.meta.limit + 1} to{' '}
              {Math.min(data.meta.page * data.meta.limit, data.meta.total)} of{' '}
              {data.meta.total} results
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
                Page {data.meta.page} of {data.meta.totalPages}
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
