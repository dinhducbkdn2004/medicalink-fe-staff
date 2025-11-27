/**
 * Group Manager Page
 * Main page for managing permission groups
 */
import { getRouteApi } from '@tanstack/react-router'
import { RoleGate } from '@/components/auth/role-gate'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { usePermissionGroups, usePermissionStats } from '../hooks'
import { GroupDialogs } from './components/group-dialogs'
import { GroupManagerProvider } from './components/group-manager-provider'
import { GroupPrimaryButtons } from './components/group-primary-buttons'
import { GroupsTable } from './components/groups-table'
import { PermissionStatsCards } from './components/permission-stats-cards'

const route = getRouteApi('/_authenticated/group-manager/')

export function GroupManager() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: groups, isLoading: groupsLoading } = usePermissionGroups()
  const { data: stats, isLoading: statsLoading } = usePermissionStats()

  return (
    <GroupManagerProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {/* Page Header */}
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div className='space-y-1'>
            <div className='flex items-center gap-3'>
              <h2 className='text-2xl font-bold tracking-tight'>
                Permission Groups
              </h2>
            </div>
            <p className='text-muted-foreground'>
              Create and manage permission groups. Assign permissions to groups,
              then add users to groups.
            </p>
          </div>
          <RoleGate roles={['SUPER_ADMIN']}>
            <GroupPrimaryButtons />
          </RoleGate>
        </div>

        {/* Permission Stats */}
        <PermissionStatsCards stats={stats} isLoading={statsLoading} />

        {/* Groups Table */}
        <GroupsTable
          data={groups || []}
          search={search}
          navigate={navigate}
          isLoading={groupsLoading}
        />
      </Main>

      {/* Dialogs */}
      <GroupDialogs />
    </GroupManagerProvider>
  )
}
