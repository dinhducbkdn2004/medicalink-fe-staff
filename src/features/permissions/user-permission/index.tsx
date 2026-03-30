
import { getRouteApi } from '@tanstack/react-router'
import { StaffRole } from '@/api/types/staff.types'
import { RequirePermission } from '@/components/auth/require-permission'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RbacUserDirectoryTable } from '../components/rbac-user-directory-table'
import { useStaffs } from '@/features/staffs/data/use-staffs'

const route = getRouteApi('/_authenticated/user-permission/')

export function UserPermission() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const queryParams = {
    page: (search.page as number) || 1,
    limit: (search.pageSize as number) || 10,
    search: (search.search as string) || undefined,
    email: (search.email as string) || undefined,
    role:
      search.role === 'SUPER_ADMIN'
        ? StaffRole.SUPER_ADMIN
        : search.role === 'ADMIN'
          ? StaffRole.ADMIN
          : undefined,
    sortBy:
      (search.sortBy as 'createdAt' | 'fullName' | 'email' | undefined) ||
      undefined,
    sortOrder: (search.sortOrder as 'asc' | 'desc' | undefined) || undefined,
  }

  const { data, isLoading } = useStaffs(queryParams)

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
        <div className='space-y-1'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Direct user permissions
          </h2>
          <p className='text-muted-foreground'>
            Browse staff in a table. Open a user to grant or revoke individual
            overrides on a full page.
          </p>
        </div>

        <RbacUserDirectoryTable
          data={data?.data ?? []}
          pageCount={data?.meta?.totalPages ?? 0}
          search={search}
          navigate={navigate}
          isLoading={isLoading}
          manageTo='/user-permission/$userId'
          manageLabel='Manage permissions'
          entityName='user'
        />
      </Main>
    </RequirePermission>
  )
}
