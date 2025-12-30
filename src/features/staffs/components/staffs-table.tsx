
import { Edit, Trash2 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { staffRoles, genderOptions } from '../data/data'
import { type Staff } from '../data/schema'
import { canUpdateStaff, canDeleteSpecificStaff } from '../utils/permissions'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { staffsColumns as columns } from './staffs-columns'
import { useStaffs } from './staffs-provider'





type StaffsTableProps = {
  data: Staff[]
  pageCount?: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}






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
  {
    columnId: 'isMale',
    searchKey: 'isMale',
    type: 'array',
    serialize: (value: unknown) => (Array.isArray(value) ? value[0] : value),
    deserialize: (value: unknown) => (value ? [value] : []),
  },
]





export function StaffsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: StaffsTableProps) {
  const { setOpen, setCurrentRow } = useStaffs()

  
  const getRowActions = (row: { original: Staff }): DataTableAction[] => {
    const staff = row.original

    const actions: DataTableAction[] = []

    
    if (canUpdateStaff()) {
      actions.push({
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentRow(staff)
          setOpen('edit')
        },
      })
    }

    
    if (canDeleteSpecificStaff({ staffId: staff.id })) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentRow(staff)
          setOpen('delete')
        },
        variant: 'destructive',
        separator: true,
      })
    }

    return actions
  }

  return (
    <DataTable
      
      data={data}
      columns={columns}
      search={search}
      navigate={navigate}
      
      pageCount={pageCount}
      isLoading={isLoading}
      entityName='staff member'
      
      searchPlaceholder='Filter staff members...'
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
        {
          columnId: 'isMale',
          title: 'Gender',
          options: genderOptions.map((gender) => ({
            label: gender.label,
            value: gender.value,
          })),
        },
      ]}
      
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No staff members found.'
    />
  )
}
