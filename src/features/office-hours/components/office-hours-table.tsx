/**
 * Office Hours Table Component
 * Table view for office hours management with API integration
 */
import { Trash2 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { DataTable, type DataTableAction } from '@/components/data-table'
import { type OfficeHour, DAYS_OF_WEEK } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
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
      // Toolbar
      searchPlaceholder='Search office hours...'
      filters={[
        {
          columnId: 'dayOfWeek',
          title: 'Day',
          options: DAYS_OF_WEEK.map((day) => ({
            label: day.label,
            value: String(day.value),
          })),
        },
      ]}
      // Actions
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      // Advanced
      enableRowSelection={true}
      emptyMessage='No office hours found. Add office hours to define working schedules.'
    />
  )
}
