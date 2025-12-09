/**
 * Work Locations Management Page
 * Main page for managing work locations
 */
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { WorkLocationsDialogs } from './components/work-locations-dialogs'
import { WorkLocationsPrimaryButtons } from './components/work-locations-primary-buttons'
import { WorkLocationsProvider } from './components/work-locations-provider'
import { WorkLocationsTable } from './components/work-locations-table'
import { useWorkLocations } from './data/use-work-locations'

const route = getRouteApi('/_authenticated/work-locations/')

export function WorkLocations() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Fetch work locations with query params
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
    includeMetadata: true,
  }

  // Debug: Log API params (remove in production)
  // console.log('🔍 Work Locations API Params:', queryParams)

  const { data, isLoading } = useWorkLocations(queryParams)

  return (
    <WorkLocationsProvider>
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
              Work Location Management
            </h2>
            <p className='text-muted-foreground'>
              Manage hospital and clinic locations where doctors practice.
            </p>
          </div>
          <WorkLocationsPrimaryButtons />
        </div>
        <WorkLocationsTable
          data={data?.data || []}
          pageCount={data?.meta?.totalPages || 0}
          search={search}
          navigate={navigate}
          isLoading={isLoading}
        />
      </Main>

      <WorkLocationsDialogs />
    </WorkLocationsProvider>
  )
}
