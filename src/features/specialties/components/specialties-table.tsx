/**
 * Specialties Table Component
 * Table view for specialty management with API integration
 */
import { Edit, Trash2, Info } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { statusOptions } from '../data/data'
import { type Specialty } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { specialtiesColumns as columns } from './specialties-columns'
import { useSpecialties } from './specialties-provider'

// ============================================================================
// Types
// ============================================================================

type SpecialtiesTableProps = {
  data: Specialty[]
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
    columnId: 'name',
    searchKey: 'search',
    type: 'string',
  },
  {
    columnId: 'isActive',
    searchKey: 'isActive',
    type: 'array',
    serialize: (value: unknown) => (Array.isArray(value) ? value[0] : value),
    deserialize: (value: unknown) => (value ? [value] : []),
  },
]

// ============================================================================
// Component
// ============================================================================

export function SpecialtiesTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: SpecialtiesTableProps) {
  const { setOpen, setCurrentRow } = useSpecialties()

  // Define row actions (context menu)
  const getRowActions = (row: { original: Specialty }): DataTableAction[] => {
    const specialty = row.original

    return [
      {
        label: 'View Info Sections',
        icon: Info,
        onClick: () => {
          setCurrentRow(specialty)
          setOpen('view-info')
        },
      },
      {
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentRow(specialty)
          setOpen('edit')
        },
        separator: true,
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentRow(specialty)
          setOpen('delete')
        },
        variant: 'destructive',
      },
    ]
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
      entityName='specialty'
      // Toolbar
      searchPlaceholder='Search specialties by name...'
      searchKey='name'
      filters={[
        {
          columnId: 'isActive',
          title: 'Status',
          options: statusOptions.map((status) => ({
            label: status.label,
            value: status.value,
            icon: status.icon,
          })),
        },
      ]}
      // Actions
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      // Advanced
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No specialties found. Create your first specialty to get started.'
    />
  )
}

