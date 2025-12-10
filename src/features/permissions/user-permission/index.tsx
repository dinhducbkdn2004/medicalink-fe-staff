/**
 * User Permission Page
 * Manage individual user permissions
 */
import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RoleGate } from '@/components/auth/role-gate'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AssignUserPermissionDialog } from './components/assign-user-permission-dialog'
import { UserList } from './components/user-list'
import { UserPermissionDetails } from './components/user-permission-details'

export function UserPermission() {
  const [selectedUserId, setSelectedUserId] = useState<string>()
  const [showAssignDialog, setShowAssignDialog] = useState(false)

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
              User Permissions
            </h2>
            <p className='text-muted-foreground'>
              Assign direct permissions to individual users. Use groups for
              common permission sets.
            </p>
          </div>
          <RoleGate roles={['SUPER_ADMIN']}>
            {selectedUserId ? (
              <Button onClick={() => setShowAssignDialog(true)}>
                <UserPlus className='mr-2 h-4 w-4' />
                Assign Permission
              </Button>
            ) : (
              <Badge variant='outline' className='px-3 py-2'>
                Select a user to assign permissions
              </Badge>
            )}
          </RoleGate>
        </div>

        {/* Main Content: Two Column Layout */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]'>
          {/* Left: User List */}
          <UserList
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />

          {/* Right: Permission Details */}
          <UserPermissionDetails userId={selectedUserId} />
        </div>
      </Main>

      {/* Assign Permission Dialog */}
      <AssignUserPermissionDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        userId={selectedUserId}
      />
    </>
  )
}
