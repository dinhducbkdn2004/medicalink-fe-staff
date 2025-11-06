/**
 * Permission Stats Cards Component
 * Display permission system statistics in card format
 */
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
      title: 'Total Permissions',
      value: stats.totalPermissions,
      icon: Shield,
      description: 'Available in system',
    },
    {
      title: 'Permission Groups',
      value: stats.totalGroups,
      icon: Users,
      description: 'Active groups',
    },
    {
      title: 'User Permissions',
      value: stats.totalUserPermissions,
      icon: ShieldCheck,
      description: 'Direct assignments',
    },
    {
      title: 'Group Permissions',
      value: stats.totalGroupPermissions,
      icon: UserCog,
      description: 'Group assignments',
    },
    {
      title: 'Group Memberships',
      value: stats.totalUserGroupMemberships,
      icon: TrendingUp,
      description: 'User-group links',
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

