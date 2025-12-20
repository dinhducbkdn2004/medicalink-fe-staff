/**
 * Specialties Management Page
 * Main page for managing medical specialties
 */
import { getRouteApi } from '@tanstack/react-router'
import { Can } from '@/components/auth/permission-gate'
import { RequirePermission } from '@/components/auth/require-permission'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SpecialtiesDialogs } from './components/specialties-dialogs'
import { SpecialtiesPrimaryButtons } from './components/specialties-primary-buttons'
import { SpecialtiesProvider } from './components/specialties-provider'
import { SpecialtiesTable } from './components/specialties-table'
import { useSpecialties } from './data/use-specialties'

const route = getRouteApi('/_authenticated/specialties/')

export function Specialties() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Fetch specialties with query params
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
    sortBy: (search.sortBy as string | undefined) || undefined,
    sortOrder: (search.sortOrder as 'asc' | 'desc' | undefined) || undefined,
  }

  const { data, isLoading } = useSpecialties(queryParams)

  return (
    <RequirePermission resource='specialties' action='manage'>
      <SpecialtiesProvider>
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
                Specialty Management
              </h2>
              <p className='text-muted-foreground'>
                Manage medical specialties and their information sections.
              </p>
            </div>
            <Can I='specialties:create'>
              <SpecialtiesPrimaryButtons />
            </Can>
          </div>
          <SpecialtiesTable
            data={data?.data || []}
            pageCount={data?.meta?.totalPages || 0}
            search={search}
            navigate={navigate}
            isLoading={isLoading}
          />
        </Main>

        <SpecialtiesDialogs />
      </SpecialtiesProvider>
    </RequirePermission>
  )
}
