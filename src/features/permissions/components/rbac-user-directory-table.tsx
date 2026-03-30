import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { staffRoles } from '@/features/staffs/data/data'
import { type Staff } from '@/features/staffs/data/schema'
import { createRbacUserColumns } from './rbac-user-columns'

const columnFilterConfigs: ColumnFilterConfig[] = [
  {
    columnId: 'fullName',
    searchKey: 'search',
    type: 'string',
  },
  {
    columnId: 'email',
    searchKey: 'email',
    type: 'string',
  },
  {
    columnId: 'role',
    searchKey: 'role',
    type: 'array',
    serialize: (value: unknown) => (Array.isArray(value) ? value[0] : value),
    deserialize: (value: unknown) => (value ? [value] : []),
  },
]

type RbacUserDirectoryTableProps = {
  data: Staff[]
  pageCount?: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
  manageTo: '/user-permission/$userId' | '/user-group/$userId'
  manageLabel: string
  entityName?: string
  searchPlaceholder?: string
}

export function RbacUserDirectoryTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
  manageTo,
  manageLabel,
  entityName = 'user',
  searchPlaceholder = 'Search by name or email…',
}: RbacUserDirectoryTableProps) {
  const columns = createRbacUserColumns({ manageTo, manageLabel })

  return (
    <DataTable
      data={data}
      columns={columns}
      search={search}
      navigate={navigate}
      pageCount={pageCount}
      isLoading={isLoading}
      entityName={entityName}
      searchPlaceholder={searchPlaceholder}
      searchKey='fullName'
      filters={[
        {
          columnId: 'role',
          title: 'Role',
          options: staffRoles.map((role) => ({
            label: role.label,
            value: role.value,
            icon: role.icon,
          })),
        },
      ]}
      enableRowSelection={false}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No users found.'
    />
  )
}
