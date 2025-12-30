
import { getRouteApi } from '@tanstack/react-router'
import { Can } from '@/components/auth/permission-gate'
import { RequirePermission } from '@/components/auth/require-permission'
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

const route = getRouteApi('/_authenticated/doctors/')

export function Doctors() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  
  const queryParams = {
    page: (search.page as number) || 1,
    limit: (search.pageSize as number) || 10,
    search: (search.search as string) || undefined,
    isActive: (() => {
      if (search.isActive === 'true') return true
      if (search.isActive === 'false') return false
      return undefined
    })(),
    isMale: (() => {
      if (search.isMale === 'true') return true
      if (search.isMale === 'false') return false
      return undefined
    })(),
    sortBy:
      (search.sortBy as 'createdAt' | 'fullName' | 'email' | undefined) ||
      undefined,
    sortOrder: search.sortOrder || undefined,
    createdFrom: search.createdFrom || undefined,
    createdTo: search.createdTo || undefined,
  }

  const { data, isLoading } = useDoctors(queryParams)

  return (
    
    
    <RequirePermission resource='doctors' action='manage'>
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
            <Can I='doctors:create'>
              <DoctorsPrimaryButtons />
            </Can>
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
    </RequirePermission>
  )
}
