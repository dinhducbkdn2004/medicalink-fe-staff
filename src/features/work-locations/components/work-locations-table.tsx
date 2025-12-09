/**
 * Work Locations Table Component
 * Table view for work location management with API integration
 */
import { Edit, Trash2 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { statusOptions } from '../data/data'
import { type WorkLocation } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { workLocationsColumns as columns } from './work-locations-columns'
import { useWorkLocations } from './work-locations-provider'

// ============================================================================
// Types
// ============================================================================

type WorkLocationsTableProps = {
  data: WorkLocation[]
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

export function WorkLocationsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: WorkLocationsTableProps) {
  const { setOpen, setCurrentRow } = useWorkLocations()

  // Define row actions (context menu)
  const getRowActions = (row: { original: WorkLocation }): DataTableAction[] => {
    const workLocation = row.original

    return [
      {
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentRow(workLocation)
          setOpen('edit')
        },
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentRow(workLocation)
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
      entityName='work location'
      // Toolbar
      searchPlaceholder='Search locations by name or address...'
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
      emptyMessage='No work locations found. Create your first location to get started.'
    />
  )
}

