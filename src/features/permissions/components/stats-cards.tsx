
import { Shield, UsersRound, Key, UserPlus } from 'lucide-react'
import type { PermissionStats } from '@/api/types/permission.types'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type StatsCardsProps = {
  stats?: PermissionStats
  isLoading?: boolean
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className='p-6'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='mt-2 h-8 w-16' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statsData = [
    {
      title: 'Total Permissions',
      value: stats.totalPermissions,
      icon: Shield,
      color: 'text-blue-600',
    },
    {
      title: 'Total Groups',
      value: stats.totalGroups,
      icon: UsersRound,
      color: 'text-green-600',
    },
    {
      title: 'Direct Permissions',
      value: stats.totalUserPermissions,
      icon: Key,
      color: 'text-purple-600',
    },
    {
      title: 'Group Permissions',
      value: stats.totalGroupPermissions,
      icon: Shield,
      color: 'text-orange-600',
    },
    {
      title: 'Memberships',
      value: stats.totalUserGroupMemberships,
      icon: UserPlus,
      color: 'text-pink-600',
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  {stat.title}
                </p>
                <p className='mt-2 text-3xl font-bold'>{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
