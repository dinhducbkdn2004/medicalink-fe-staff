/**
 * Staffs Table Component
 * Table view for staff account management with API integration
 * Refactored to use the generic DataTable component
 */
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

// ============================================================================
// Types
// ============================================================================

type StaffsTableProps = {
  data: Staff[]
  pageCount?: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}

// ============================================================================
// Configuration
// ============================================================================

// Column filter configuration for URL state management
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

// ============================================================================
// Component
// ============================================================================

export function StaffsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: StaffsTableProps) {
  const { setOpen, setCurrentRow } = useStaffs()

  // Define row actions (context menu)
  const getRowActions = (row: { original: Staff }): DataTableAction[] => {
    const staff = row.original

    const actions: DataTableAction[] = []

    // Only show Edit action if user has update permission
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

    // Only show Delete action if user has delete permission
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
      // Required props
      data={data}
      columns={columns}
      search={search}
      navigate={navigate}
      // Configuration
      pageCount={pageCount}
      isLoading={isLoading}
      entityName='staff member'
      // Toolbar
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
      // Actions
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      // Advanced
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No staff members found.'
    />
  )
}
