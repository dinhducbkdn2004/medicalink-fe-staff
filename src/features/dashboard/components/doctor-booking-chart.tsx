
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
  CartesianGrid,
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
  pending: '#fbbf24',
  confirmed: '#60a5fa',
  completed: '#34d399',
  cancelled: '#f87171',
}

export function DoctorBookingChart() {
  const { data, isLoading } = useDoctorsBookingStats({
    page: 1,
    limit: 20,
    sortBy: 'completedRate',
    sortOrder: 'DESC',
  } as DoctorBookingStatsParams)

  
  const completionRateData = useMemo(() => {
    if (!data?.data || data.data.length === 0) return []

    return data.data
      .slice(0, 10)
      .map((item) => {
        const fullName = item.doctor?.fullName || 'Bác sĩ chưa xác định'
        const nameParts = fullName.split(' ')
        const shortName =
          nameParts.length >= 2 ? nameParts.slice(-2).join(' ') : fullName

        return {
          name: shortName,
          rate: Number((item.completedRate || 0).toFixed(1)),
          completed: item.completedCount || 0,
          total: item.total || 0,
        }
      })
      .filter((item) => item.total > 0)
  }, [data])

  
  const statusDistribution = useMemo(() => {
    if (!data?.data || data.data.length === 0) return []

    const totals = data.data.reduce(
      (acc, item) => ({
        pending: acc.pending + (item.bookedCount || 0),
        confirmed: acc.confirmed + (item.confirmedCount || 0),
        completed: acc.completed + (item.completedCount || 0),
        cancelled: acc.cancelled + (item.cancelledCount || 0),
      }),
      { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
    )

    return [
      { name: 'Chờ xác nhận', value: totals.pending, color: STATUS_COLORS.pending },
      {
        name: 'Đã xác nhận',
        value: totals.confirmed,
        color: STATUS_COLORS.confirmed,
      },
      {
        name: 'Đã hoàn thành',
        value: totals.completed,
        color: STATUS_COLORS.completed,
      },
      {
        name: 'Đã hủy',
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
          <p className='text-muted-foreground'>Không có dữ liệu đặt lịch</p>
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
      {}
      {completionRateData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Top Bác sĩ theo Tỷ lệ hoàn thành</CardTitle>
            <CardDescription>
              Các bác sĩ có tỷ lệ hoàn thành cuộc hẹn cao nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={350}>
              <BarChart
                data={completionRateData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  opacity={0.1}
                  stroke='#e0e7ff'
                />
                <XAxis
                  dataKey='name'
                  angle={-45}
                  textAnchor='end'
                  height={80}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className='bg-background rounded-lg border p-3 shadow-lg'>
                          <p className='mb-2 font-semibold'>{data.name}</p>
                          <div className='space-y-1 text-xs'>
                            <p className='font-medium text-green-600'>
                              ✓ Tỷ lệ hoàn thành: {data.rate}%
                            </p>
                            <p className='text-muted-foreground'>
                              Đã hoàn thành: {data.completed} / {data.total}
                            </p>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey='rate' radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {completionRateData.map((entry, index) => {
                    const intensity = Math.min(entry.rate / 20, 4)
                    const colors = [
                      'oklch(0.85 0.08 244.9955)',
                      'oklch(0.78 0.11 244.9955)',
                      'oklch(0.6723 0.1606 244.9955)',
                      'oklch(0.60 0.18 244.9955)',
                      'oklch(0.52 0.20 244.9955)',
                    ]
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[Math.floor(intensity)]}
                      />
                    )
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className='flex h-[350px] items-center justify-center'>
            <p className='text-muted-foreground'>Không có dữ liệu tỷ lệ hoàn thành</p>
          </CardContent>
        </Card>
      )}

      {}
      {statusDistribution.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái Cuộc hẹn Tổng quát</CardTitle>
            <CardDescription>
              Phân bổ của tổng số {totalAppointments.toLocaleString()}{' '}
              cuộc hẹn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={350}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx='50%'
                  cy='45%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
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
                            {data.value.toLocaleString()} cuộc hẹn
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            {((data.value / totalAppointments) * 100).toFixed(
                              1
                            )}
                            % tổng số
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend
                  verticalAlign='bottom'
                  height={50}
                  formatter={(value, entry: { payload: { value: number } }) => (
                    <span className='text-sm'>
                      {value}: {entry.payload.value.toLocaleString()}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className='flex h-[350px] items-center justify-center'>
            <p className='text-muted-foreground'>Không có dữ liệu phân bổ trạng thái</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
