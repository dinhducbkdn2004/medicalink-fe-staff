/**
 * Patients Management Page
 * Main page for managing patient records
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
import { PatientsDialogs } from './components/patients-dialogs'
import { PatientsPrimaryButtons } from './components/patients-primary-buttons'
import { PatientsProvider } from './components/patients-provider'
import { PatientsTable } from './components/patients-table'
import { usePatients as usePatientsData } from './data/use-patients'

const route = getRouteApi('/_authenticated/patients/')

export function Patients() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Fetch patients with query params
  const queryParams = {
    page: (search.page as number) || 1,
    limit: (search.pageSize as number) || 10,
    search: (search.search as string) || undefined,
    sortBy:
      (search.sortBy as 'dateOfBirth' | 'createdAt' | 'updatedAt') ||
      'createdAt',
    sortOrder: (search.sortOrder as 'asc' | 'desc') || 'desc',
    includedDeleted: (search.includedDeleted as boolean) || true,
  }

  const { data: patientsData, isLoading, error } = usePatientsData(queryParams)

  return (
    <RequirePermission resource='patients' action='read'>
      <PatientsProvider>
        {/* Header */}
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        {/* Main Content */}
        <Main>
          <div className='mb-2 flex items-center justify-between space-y-2'>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>
                Patient Management
              </h1>
              <p className='text-muted-foreground'>
                Manage patient records and information
              </p>
            </div>
            <Can I='patients:create'>
              <PatientsPrimaryButtons />
            </Can>
          </div>

          {/* Error State */}
          {error && (
            <div className='rounded-md border border-red-200 bg-red-50 p-4'>
              <p className='text-sm text-red-800'>
                Failed to load patients. Please try again later.
              </p>
            </div>
          )}

          {/* Table */}
          <PatientsTable
            data={patientsData?.data || []}
            pageCount={patientsData?.meta?.totalPages || 0}
            search={search}
            navigate={navigate}
            isLoading={isLoading}
          />

          {/* Dialogs */}
          <PatientsDialogs />
        </Main>
      </PatientsProvider>
    </RequirePermission>
  )
}
