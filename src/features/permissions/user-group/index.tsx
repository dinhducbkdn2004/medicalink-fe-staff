/**
 * User Group Page
 * Manage user-group memberships (user-centric view)
 */
import { useState } from 'react'
import { UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RoleGate } from '@/components/auth/role-gate'
import { UserList } from './components/user-list'
import { UserGroupMemberships } from './components/user-group-memberships'

export function UserGroup() {
  const [selectedUserId, setSelectedUserId] = useState<string>()

  return (
    <>
      <Header fixed>
        <Search />
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
            <h2 className='text-2xl font-bold tracking-tight'>
              User Group Memberships
            </h2>
            <p className='text-muted-foreground'>
              Manage user group memberships. Users inherit all permissions from
              their groups.
            </p>
          </div>
          <RoleGate roles={['SUPER_ADMIN']}>
            {selectedUserId && (
              <Button variant='outline'>
                <UserCog className='mr-2 h-4 w-4' />
                Manage Groups
              </Button>
            )}
          </RoleGate>
        </div>

        {/* Main Content: Two Column Layout */}
        <div className='grid gap-4 lg:grid-cols-[380px_1fr]'>
          {/* Left: User List */}
          <UserList
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />

          {/* Right: User Group Memberships */}
          <UserGroupMemberships userId={selectedUserId} />
        </div>
      </Main>
    </>
  )
}
