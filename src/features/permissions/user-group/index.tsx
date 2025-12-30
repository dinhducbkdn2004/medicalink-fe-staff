
import { useState } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UserGroupMemberships } from './components/user-group-memberships'
import { UserList } from './components/user-list'

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
        {}
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
        </div>

        {}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]'>
          {}
          <UserList
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />

          {}
          <UserGroupMemberships userId={selectedUserId} />
        </div>
      </Main>
    </>
  )
}
