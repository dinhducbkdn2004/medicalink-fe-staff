
import { Shield, Users, ShieldCheck, UserCog, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { PermissionStats } from '@/api/types/permission.types'

type PermissionStatsCardsProps = {
  stats?: PermissionStats
  isLoading: boolean
}

export function PermissionStatsCards({
  stats,
  isLoading,
}: PermissionStatsCardsProps) {
  if (isLoading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-4' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: 'Tổng số quyền',
      value: stats.totalPermissions,
      icon: Shield,
      description: 'Có sẵn trong hệ thống',
    },
    {
      title: 'Nhóm quyền',
      value: stats.totalGroups,
      icon: Users,
      description: 'Các nhóm đang hoạt động',
    },
    {
      title: 'Quyền người dùng',
      value: stats.totalUserPermissions,
      icon: ShieldCheck,
      description: 'Gán trực tiếp',
    },
    {
      title: 'Quyền của nhóm',
      value: stats.totalGroupPermissions,
      icon: UserCog,
      description: 'Gán theo nhóm',
    },
    {
      title: 'Thành viên nhóm',
      value: stats.totalUserGroupMemberships,
      icon: TrendingUp,
      description: 'Liên kết người dùng - nhóm',
    },
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {stat.title}
              </CardTitle>
              <Icon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <p className='text-xs text-muted-foreground'>
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

