/**
 * Doctor Content Chart Component
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

export function DoctorContentChart() {
  const { data, isLoading } = useDoctorsContentStats({
    page: 1,
    limit: 20,
    sortBy: 'averageRating',
    sortOrder: 'DESC',
  } as DoctorContentStatsParams)

  // Top 10 doctors by rating
  const ratingChartData = useMemo(() => {
    if (!data?.data) return []
    return data.data
      .slice(0, 10)
      .filter((item) => item.totalReviews > 0)
      .map((item) => ({
        name:
          item.doctor?.fullName?.split(' ').slice(-2).join(' ') || 'Unknown',
        rating: Number(item.averageRating.toFixed(1)),
        reviews: item.totalReviews,
      }))
  }, [data])

  // Content metrics radar chart - top 5 doctors
  const radarChartData = useMemo(() => {
    if (!data?.data) return []
    return data.data.slice(0, 5).map((item) => ({
      doctor: item.doctor?.fullName?.split(' ').slice(-1)[0] || 'Unknown',
      Reviews: item.totalReviews,
      Answers: item.totalAnswers,
      Accepted: item.totalAcceptedAnswers,
      Blogs: item.totalBlogs,
    }))
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

  if (!ratingChartData.length) {
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
      {/* Average Rating Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Doctors by Average Rating</CardTitle>
          <CardDescription>
            Doctors with highest patient satisfaction ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={350}>
            <BarChart data={ratingChartData} layout='horizontal'>
              <XAxis type='number' domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
              <YAxis dataKey='name' type='category' width={100} fontSize={11} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className='bg-background rounded-lg border p-3 shadow-lg'>
                        <p className='mb-2 font-semibold'>{data.name}</p>
                        <div className='mb-1 flex items-center gap-1.5'>
                          <Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />
                          <span className='text-sm font-medium text-yellow-600'>
                            {data.rating} / 5.0
                          </span>
                        </div>
                        <p className='text-muted-foreground text-xs'>
                          Based on {data.reviews} reviews
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey='rating' fill='#facc15' radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Content Metrics Radar Chart */}
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
              <PolarGrid />
              <PolarAngleAxis dataKey='doctor' fontSize={11} />
              <PolarRadiusAxis fontSize={10} />
              <Radar
                name='Reviews'
                dataKey='Reviews'
                stroke='#facc15'
                fill='#facc15'
                fillOpacity={0.3}
              />
              <Radar
                name='Answers'
                dataKey='Answers'
                stroke='#3b82f6'
                fill='#3b82f6'
                fillOpacity={0.3}
              />
              <Radar
                name='Accepted'
                dataKey='Accepted'
                stroke='#22c55e'
                fill='#22c55e'
                fillOpacity={0.3}
              />
              <Radar
                name='Blogs'
                dataKey='Blogs'
                stroke='#a855f7'
                fill='#a855f7'
                fillOpacity={0.3}
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
    </div>
  )
}
