import { useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

// Static sample data - in production, this would come from an API
const SAMPLE_DATA = [
  { name: 'Mon', clicks: 523, uniques: 412 },
  { name: 'Tue', clicks: 687, uniques: 534 },
  { name: 'Wed', clicks: 456, uniques: 321 },
  { name: 'Thu', clicks: 892, uniques: 678 },
  { name: 'Fri', clicks: 745, uniques: 589 },
  { name: 'Sat', clicks: 334, uniques: 245 },
  { name: 'Sun', clicks: 278, uniques: 198 },
]

export function AnalyticsChart() {
  // Memoize data to prevent unnecessary re-renders
  const data = useMemo(() => SAMPLE_DATA, [])

  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
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
        />
        <Area
          type='monotone'
          dataKey='clicks'
          stroke='currentColor'
          className='text-primary'
          fill='currentColor'
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='uniques'
          stroke='currentColor'
          className='text-muted-foreground'
          fill='currentColor'
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
