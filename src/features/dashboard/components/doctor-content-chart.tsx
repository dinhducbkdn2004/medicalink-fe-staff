/**
 * Doctor Content Chart Component - Vertical Layout Fix
 * Visualizes doctor content statistics with focused charts
 */
import { useMemo } from 'react'
import { Star } from 'lucide-react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts'
import type { DoctorContentStatsParams } from '@/api/types/stats.types'
import { useDoctorsContentStats } from '@/hooks/use-stats'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const RATING_COLORS = [
  'oklch(0.85 0.08 244.9955)',
  'oklch(0.78 0.11 244.9955)',
  'oklch(0.6723 0.1606 244.9955)',
  'oklch(0.60 0.18 244.9955)',
  'oklch(0.52 0.20 244.9955)',
]

export function DoctorContentChart() {
  const { data, isLoading } = useDoctorsContentStats({
    page: 1,
    limit: 20,
    sortBy: 'averageRating',
    sortOrder: 'DESC',
  } as DoctorContentStatsParams)

  // Top 10 doctors by rating
  const ratingChartData = useMemo(() => {
    if (!data?.data || data.data.length === 0) return []

    return data.data
      .slice(0, 10)
      .map((item) => {
        const fullName = item.doctor?.fullName || 'Unknown Doctor'
        const nameParts = fullName.split(' ')
        const shortName =
          nameParts.length >= 2 ? nameParts.slice(-2).join(' ') : fullName

        return {
          name: shortName,
          rating: Number((item.averageRating || 0).toFixed(1)),
          reviews: item.totalReviews || 0,
        }
      })
      .filter((item) => item.rating > 0)
  }, [data])

  // Content metrics radar chart - top 5 doctors
  const radarChartData = useMemo(() => {
    if (!data?.data || data.data.length === 0) return []

    return data.data.slice(0, 5).map((item) => {
      const fullName = item.doctor?.fullName || 'Unknown'
      const lastName = fullName.split(' ').slice(-1)[0]

      return {
        doctor: lastName,
        Reviews: item.totalReviews || 0,
        Answers: item.totalAnswers || 0,
        Accepted: item.totalAcceptedAnswers || 0,
        Blogs: item.totalBlogs || 0,
      }
    })
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

  if (!ratingChartData.length && !radarChartData.length) {
    return (
      <Card>
        <CardContent className='flex h-[350px] items-center justify-center'>
          <p className='text-muted-foreground'>No content data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      {/* Average Rating Chart - VERTICAL */}
      {ratingChartData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Top Doctors by Average Rating</CardTitle>
            <CardDescription>
              Doctors with highest patient satisfaction ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={350}>
              <BarChart
                data={ratingChartData}
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
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tickFormatter={(value) => `${value}★`}
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
                          <div className='mb-1 flex items-center gap-1.5'>
                            <Star className='h-3.5 w-3.5 fill-[oklch(0.75_0.14_244.9955)] text-[oklch(0.6723_0.1606_244.9955)]' />
                            <span
                              className='text-sm font-medium'
                              style={{ color: 'oklch(0.6723 0.1606 244.9955)' }}
                            >
                              {data.rating} / 5.0
                            </span>
                          </div>
                          <p className='text-muted-foreground text-xs'>
                            Based on {data.reviews} review
                            {data.reviews !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey='rating' radius={[8, 8, 0, 0]} maxBarSize={60}>
                  {ratingChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        RATING_COLORS[Math.min(Math.floor(entry.rating), 4)]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className='flex h-[350px] items-center justify-center'>
            <p className='text-muted-foreground'>No rating data available</p>
          </CardContent>
        </Card>
      )}

      {/* Content Metrics Radar Chart */}
      {radarChartData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Content Contributors</CardTitle>
            <CardDescription>
              Multi-dimensional content engagement analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={350}>
              <RadarChart data={radarChartData}>
                <PolarGrid stroke='#e0e7ff' strokeWidth={1} />
                <PolarAngleAxis
                  dataKey='doctor'
                  tick={{ fontSize: 12, fill: '#374151' }}
                />
                <PolarRadiusAxis
                  tick={{ fontSize: 10, fill: '#6b7280' }}
                  angle={90}
                />
                <Radar
                  name='Reviews'
                  dataKey='Reviews'
                  stroke='#fbbf24'
                  fill='#fef3c7'
                  fillOpacity={0.6}
                  strokeWidth={2.5}
                />
                <Radar
                  name='Answers'
                  dataKey='Answers'
                  stroke='#60a5fa'
                  fill='#dbeafe'
                  fillOpacity={0.6}
                  strokeWidth={2.5}
                />
                <Radar
                  name='Accepted'
                  dataKey='Accepted'
                  stroke='#34d399'
                  fill='#d1fae5'
                  fillOpacity={0.6}
                  strokeWidth={2.5}
                />
                <Radar
                  name='Blogs'
                  dataKey='Blogs'
                  stroke='#c084fc'
                  fill='#f3e8ff'
                  fillOpacity={0.6}
                  strokeWidth={2.5}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconType='circle'
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className='bg-background rounded-lg border p-3 shadow-lg'>
                          <p className='mb-2 font-semibold'>
                            Dr. {payload[0].payload.doctor}
                          </p>
                          <div className='space-y-1 text-xs'>
                            <div className='flex items-center justify-between gap-4'>
                              <span className='text-yellow-600'>Reviews:</span>
                              <span className='font-medium'>
                                {payload[0].payload.Reviews}
                              </span>
                            </div>
                            <div className='flex items-center justify-between gap-4'>
                              <span className='text-blue-600'>Answers:</span>
                              <span className='font-medium'>
                                {payload[0].payload.Answers}
                              </span>
                            </div>
                            <div className='flex items-center justify-between gap-4'>
                              <span className='text-green-600'>Accepted:</span>
                              <span className='font-medium'>
                                {payload[0].payload.Accepted}
                              </span>
                            </div>
                            <div className='flex items-center justify-between gap-4'>
                              <span className='text-purple-600'>Blogs:</span>
                              <span className='font-medium'>
                                {payload[0].payload.Blogs}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className='flex h-[350px] items-center justify-center'>
            <p className='text-muted-foreground'>
              No content metrics available
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
