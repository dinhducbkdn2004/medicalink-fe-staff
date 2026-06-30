import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useStaff } from '@/features/staffs/data/use-staffs'
import { UserGroupMemberships } from './components/user-group-memberships'

type UserGroupManageProps = {
  userId: string
}

export function UserGroupManage({ userId }: UserGroupManageProps) {
  const { data: staff, isLoading } = useStaff(userId)

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

        <div className='space-y-1'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Thành viên nhóm
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
            Thêm hoặc xóa nhóm RBAC và xem các quyền được thừa kế.
          </p>
        </div>

        {!isLoading && !staff ? (
          <div className='text-muted-foreground rounded-md border p-6 text-sm'>
            Không tìm thấy người dùng. Quay lại danh mục và chọn tài khoản khác.
          </div>
        ) : (
          <UserGroupMemberships userId={userId} />
        )}
      </Main>
    </>
  )
}
