import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Can } from '@/components/auth/permission-gate'
import { RequirePermission } from '@/components/auth/require-permission'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useStaff } from '@/features/staffs/data/use-staffs'
import { AssignUserPermissionDialog } from './components/assign-user-permission-dialog'
import { UserPermissionDetails } from './components/user-permission-details'

type UserPermissionManageProps = {
  userId: string
}

export function UserPermissionManage({ userId }: UserPermissionManageProps) {
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const { data: staff, isLoading } = useStaff(userId)

  return (
    <RequirePermission resource='permissions' action='manage'>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>

        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div className='space-y-1'>
            <h2 className='text-2xl font-bold tracking-tight'>
              Quyền trực tiếp
              {staff?.fullName ? (
                <span className='text-muted-foreground font-normal'>
                  {' '}
                  — {staff.fullName}
                </span>
              ) : isLoading ? (
                <span className='text-muted-foreground font-normal'> …</span>
              ) : null}
            </h2>
            <p className='text-muted-foreground'>
              Cấp hoặc thu hồi quyền cụ thể cho người dùng này.
            </p>
          </div>
          <Can I='permissions:manage'>
            <Button onClick={() => setShowAssignDialog(true)}>
              <UserPlus className='mr-2 h-4 w-4' />
              Gán quyền
            </Button>
          </Can>
        </div>

        {!isLoading && !staff ? (
          <div className='text-muted-foreground rounded-md border p-6 text-sm'>
            Không tìm thấy người dùng. Quay lại danh mục và chọn tài khoản khác.
          </div>
        ) : (
          <UserPermissionDetails userId={userId} />
        )}
      </Main>

      <AssignUserPermissionDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        userId={userId}
      />
    </RequirePermission>
  )
}
