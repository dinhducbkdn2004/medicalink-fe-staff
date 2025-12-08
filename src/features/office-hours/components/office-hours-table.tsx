/**
 * Office Hours Table Component
 * Table view for office hours management with API integration
 * Simplified to match API capabilities: GET, POST, DELETE only
 */
import { Trash2 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { DataTable, type DataTableAction } from '@/components/data-table'
import { type OfficeHour } from '../data/schema'
import { officeHoursColumns as columns } from './office-hours-columns'
import { useOfficeHoursContext } from './office-hours-provider'

// ============================================================================
// Types
// ============================================================================

type OfficeHoursTableProps = {
  data: OfficeHour[]
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}

// ============================================================================
// Component
// ============================================================================

export function OfficeHoursTable({
  data,
  search,
  navigate,
  isLoading = false,
}: Readonly<OfficeHoursTableProps>) {
  const { setOpen, setCurrentRow } = useOfficeHoursContext()

  // Define row actions (context menu)
  // API only supports DELETE, no edit/update endpoint
  const getRowActions = (row: { original: OfficeHour }): DataTableAction[] => {
    const officeHour = row.original

    return [
      {
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentRow(officeHour)
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
      pageCount={1} // Office hours API doesn't use pagination
      isLoading={isLoading}
      entityName='office hour'
      // Actions
      getRowActions={getRowActions}
      // Bulk actions disabled - API doesn't support bulk delete
      enableRowSelection={false}
      emptyMessage='No office hours found. Add office hours to define working schedules.'
      hideToolbar={true}
    />
  )
}
