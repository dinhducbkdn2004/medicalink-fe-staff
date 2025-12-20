/**
 * Doctor Booking Chart Component
 * Visualizes doctor booking statistics with focused charts
 */
import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import type { DoctorBookingStatsParams } from '@/api/types/stats.types'
import { useDoctorsBookingStats } from '@/hooks/use-stats'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const STATUS_COLORS = {
  pending: '#fb923c',
  confirmed: '#3b82f6',
  completed: '#22c55e',
  cancelled: '#ef4444',
}

export function DoctorBookingChart() {
  const { data, isLoading } = useDoctorsBookingStats({
    page: 1,
    limit: 20,
    sortBy: 'completedRate',
    sortOrder: 'DESC',
  } as DoctorBookingStatsParams)

  // Top 10 doctors by completion rate
  const completionRateData = useMemo(() => {
    if (!data?.data) return []
    return data.data
      .slice(0, 10)
      .filter((item) => item.completedRate > 0)
      .map((item) => ({
        name:
          item.doctor?.fullName?.split(' ').slice(-2).join(' ') || 'Unknown',
        rate: Number(item.completedRate.toFixed(1)),
        completed: item.completedCount,
        total: item.total,
      }))
  }, [data])

  // Overall status distribution (pie chart)
  const statusDistribution = useMemo(() => {
    if (!data?.data) return []
    const totals = data.data.reduce(
      (acc, item) => ({
        pending: acc.pending + item.bookedCount,
        confirmed: acc.confirmed + item.confirmedCount,
        completed: acc.completed + item.completedCount,
        cancelled: acc.cancelled + item.cancelledCount,
      }),
      { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
    )

    return [
      { name: 'Pending', value: totals.pending, color: STATUS_COLORS.pending },
      {
        name: 'Confirmed',
        value: totals.confirmed,
        color: STATUS_COLORS.confirmed,
      },
      {
        name: 'Completed',
        value: totals.completed,
        color: STATUS_COLORS.completed,
      },
      {
        name: 'Cancelled',
        value: totals.cancelled,
        color: STATUS_COLORS.cancelled,
      },
    ].filter((item) => item.value > 0)
  }, [data])

  if (isLoading) {
    return (
      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-4 w-64' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-[350px] w-full' />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-4 w-64' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-[350px] w-full' />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!completionRateData.length && !statusDistribution.length) {
    return (
      <Card>
        <CardContent className='flex h-[350px] items-center justify-center'>
          <p className='text-muted-foreground'>No booking data available</p>
        </CardContent>
      </Card>
    )
  }

  const totalAppointments = statusDistribution.reduce(
    (sum, item) => sum + item.value,
    0
  )

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      {/* Completion Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Doctors by Completion Rate</CardTitle>
          <CardDescription>
            Doctors with highest appointment completion rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={350}>
            <BarChart data={completionRateData} layout='horizontal'>
              <XAxis
                type='number'
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis dataKey='name' type='category' width={100} fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className='bg-background rounded-lg border p-3 shadow-lg'>
                        <p className='mb-2 font-semibold'>{data.name}</p>
                        <div className='space-y-1 text-xs'>
                          <p className='font-medium text-green-600'>
                            ✓ Completion Rate: {data.rate}%
                          </p>
                          <p className='text-muted-foreground'>
                            Completed: {data.completed} / {data.total}
                          </p>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey='rate' radius={[0, 4, 4, 0]}>
                {completionRateData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${120 - (100 - entry.rate) * 1.2}, 65%, 50%)`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Appointment Status</CardTitle>
          <CardDescription>
            Distribution of {totalAppointments.toLocaleString()} total
            appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={350}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill='#8884d8'
                dataKey='value'
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className='bg-background rounded-lg border p-3 shadow-lg'>
                        <p className='mb-1 font-semibold'>{data.name}</p>
                        <p className='text-sm'>
                          {data.value.toLocaleString()} appointments
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {((data.value / totalAppointments) * 100).toFixed(1)}%
                          of total
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                verticalAlign='bottom'
                height={36}
                formatter={(value, entry: any) => (
                  <span className='text-sm'>
                    {value}: {entry.payload.value.toLocaleString()}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
