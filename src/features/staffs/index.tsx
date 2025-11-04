/**
 * Staffs Management Page
 * Main page for managing staff accounts (Admin and Super Admin)
 */
import { getRouteApi } from '@tanstack/react-router'
import { StaffRole } from '@/api/types/staff.types'
import { useAuth } from '@/hooks/use-auth'
import { RoleGate } from '@/components/auth/role-gate'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { StaffsDialogs } from './components/staffs-dialogs'
import { StaffsPrimaryButtons } from './components/staffs-primary-buttons'
import { StaffsProvider } from './components/staffs-provider'
import { StaffsTable } from './components/staffs-table'
import { useStaffs } from './data/use-staffs'

const route = getRouteApi('/_authenticated/staffs/')

export function Staffs() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { user } = useAuth()

  // Fetch staffs with query params (must be called before any conditional returns)
  const queryParams = {
    page: (search.page as number) || 1,
    limit: (search.pageSize as number) || 10,
    search: (search.search as string) || undefined,
    role:
      search.role === 'SUPER_ADMIN'
        ? StaffRole.SUPER_ADMIN
        : search.role === 'ADMIN'
          ? StaffRole.ADMIN
          : undefined,
    isMale:
      search.isMale === 'true'
        ? true
        : search.isMale === 'false'
          ? false
          : undefined,
    sortBy:
      (search.sortBy as 'createdAt' | 'fullName' | 'email' | undefined) ||
      undefined,
    sortOrder: (search.sortOrder as 'asc' | 'desc' | undefined) || undefined,
    createdFrom: (search.createdFrom as string | undefined) || undefined,
    createdTo: (search.createdTo as string | undefined) || undefined,
  }

  // Debug: Log API params (remove in production)
  // eslint-disable-next-line no-console
  console.log('🔍 Staffs API Params:', queryParams)

  const { data, isLoading } = useStaffs(queryParams)

  // Check if user has permission to view staff management
  const canViewStaffs = user?.role === 'SUPER_ADMIN'

  if (!canViewStaffs) {
    return (
      <Main className='flex flex-1 items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Access Denied</h2>
          <p className='text-muted-foreground mt-2'>
            You do not have permission to view staff management.
          </p>
        </div>
      </Main>
    )
  }

  return (
    <StaffsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Staff Management
            </h2>
            <p className='text-muted-foreground'>
              Manage staff accounts and their roles here.
            </p>
          </div>
          <RoleGate roles={['SUPER_ADMIN']}>
            <StaffsPrimaryButtons />
          </RoleGate>
        </div>
        <StaffsTable
          data={data?.data || []}
          pageCount={data?.meta?.totalPages || 0}
          search={search}
          navigate={navigate}
          isLoading={isLoading}
        />
      </Main>

      <StaffsDialogs />
    </StaffsProvider>
  )
}
