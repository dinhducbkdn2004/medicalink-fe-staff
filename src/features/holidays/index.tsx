import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Can } from '@/components/auth/permission-gate'
import { RequirePermission } from '@/components/auth/require-permission'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ClinicExceptionsDialogs } from './components/clinic-exceptions-dialogs'
import { ClinicExceptionsTable } from './components/clinic-exceptions-table'
import { HolidaysProvider, useHolidaysContext } from './components/holidays-provider'
import { useClinicExceptions } from './data/use-clinic-exceptions'

const route = getRouteApi('/_authenticated/holidays/')

function HolidaysPrimaryButtons() {
  const { setOpen } = useHolidaysContext()
  return (
    <div className='flex gap-2'>
      <Button onClick={() => setOpen('create')}>
        <Plus className='mr-2 size-4' />
        Thêm Ngày nghỉ
      </Button>
    </div>
  )
}

function HolidaysContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const queryParams = {
    workLocationId: 'cm0hq6rxg000008mf3x0c6w4b', // Default to single location
  }

  const { data = [], isLoading, error } = useClinicExceptions(queryParams)

  const isPermissionError =
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'status' in error.response &&
    (error.response.status === 401 || error.response.status === 403)

  return (
    <HolidaysProvider>
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
              Quản lý Ngày nghỉ
            </h2>
            <p className='text-muted-foreground'>
              Cấu hình ngày nghỉ chung và ngoại lệ theo địa điểm.
            </p>
          </div>
          {!isPermissionError && (
            <Can I='office-hours:create'>
              <HolidaysPrimaryButtons />
            </Can>
          )}
        </div>

        {isPermissionError ? (
          <div className='border-destructive/50 bg-destructive/10 rounded-lg border p-8 text-center'>
            <h3 className='text-destructive text-lg font-semibold'>
              Từ chối truy cập
            </h3>
            <p className='text-muted-foreground mt-2'>
              Bạn không có quyền xem ngày nghỉ. Vui lòng liên hệ với quản trị viên của bạn để yêu cầu quyền truy cập.
            </p>
          </div>
        ) : (
          <div className='mt-4'>
            <ClinicExceptionsTable
              data={data}
              search={search}
              navigate={navigate}
              isLoading={isLoading}
            />
          </div>
        )}
      </Main>

      <ClinicExceptionsDialogs />
    </HolidaysProvider>
  )
}

export function Holidays() {
  return (
    <RequirePermission resource='office-hours' action='read'>
      <HolidaysContent />
    </RequirePermission>
  )
}
