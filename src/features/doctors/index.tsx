/**
 * Doctors Management Page
 * Main page for managing doctor accounts
 */
import { getRouteApi } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'
import { RoleGate } from '@/components/auth/role-gate'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DoctorsDialogs } from './components/doctors-dialogs'
import { DoctorsPrimaryButtons } from './components/doctors-primary-buttons'
import { DoctorsProvider } from './components/doctors-provider'
import { DoctorsTable } from './components/doctors-table'
import { useDoctors } from './data/use-doctors'
import { canReadDoctors } from './utils/permissions'

const route = getRouteApi('/_authenticated/doctors/')

export function Doctors() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { user } = useAuth()

  // Check permissions
  if (!canReadDoctors(user)) {
    return (
      <Main className='flex flex-1 items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Access Denied</h2>
          <p className='text-muted-foreground mt-2'>
            You do not have permission to view doctor management.
          </p>
        </div>
      </Main>
    )
  }

  // Fetch doctors with query params
  const queryParams = {
    page: (search.page as number) || 1,
    limit: (search.pageSize as number) || 10,
    search: (search.search as string) || undefined,
    isActive:
      search.isActive === 'true'
        ? true
        : search.isActive === 'false'
          ? false
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
  console.log('🔍 Doctors API Params:', queryParams)

  const { data, isLoading } = useDoctors(queryParams)

  return (
    <DoctorsProvider>
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
              Doctor Management
            </h2>
            <p className='text-muted-foreground'>
              Manage doctor accounts and their profiles.
            </p>
          </div>
          <RoleGate roles={['SUPER_ADMIN', 'ADMIN']}>
            <DoctorsPrimaryButtons />
          </RoleGate>
        </div>
        <DoctorsTable
          data={data?.data || []}
          pageCount={data?.meta?.totalPages || 0}
          search={search}
          navigate={navigate}
          isLoading={isLoading}
        />
      </Main>

      <DoctorsDialogs />
    </DoctorsProvider>
  )
}
