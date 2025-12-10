import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useRevenueStats } from '@/hooks/use-stats'

export function Overview() {
  const { data: revenueStats } = useRevenueStats()

  // Process data to have a single value field for the chart
  const chartData = revenueStats?.map((item) => ({
    name: item.name,
    value: item.total.VND || (item.total['$'] || 0) * 25000, // Fallback conversion if needed or just prioritize VND
  }))

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={chartData || []}>
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
