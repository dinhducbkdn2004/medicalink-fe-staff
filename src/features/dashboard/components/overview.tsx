import { useMemo } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useRevenueStats } from '@/hooks/use-stats'
import { Skeleton } from '@/components/ui/skeleton'

export function Overview() {
  const { data: revenueStats, isLoading } = useRevenueStats()

  // Process data to have a single value field for the chart - memoized
  const chartData = useMemo(() => {
    if (!revenueStats) return []
    return revenueStats.map((item) => ({
      name: item.name,
      value: item.total.VND || (item.total['$'] || 0) * 25000, // Fallback conversion if needed or just prioritize VND
    }))
  }, [revenueStats])

  // Show skeleton while loading
  if (isLoading) {
    return <Skeleton className='h-[350px] w-full' />
  }

  // Don't render chart if no data
  if (chartData.length === 0) {
    return (
      <div className='text-muted-foreground flex h-[350px] items-center justify-center'>
        No revenue data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            new Intl.NumberFormat('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            }).format(value)
          }
        />
        <Bar
          dataKey='value'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
