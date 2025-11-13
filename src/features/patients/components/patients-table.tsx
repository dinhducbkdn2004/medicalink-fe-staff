/**
 * Patients Table Component
 * Table view for patient management with API integration
 * Uses the generic DataTable component
 */
import { Edit, Trash2, RotateCcw } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { statusOptions, genderOptions } from '../data/data'
import type { Patient } from '../types'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { patientsColumns as columns } from './patients-columns'
import { usePatients } from './patients-provider'

// ============================================================================
// Types
// ============================================================================

type PatientsTableProps = {
  data: Patient[]
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
    columnId: 'isMale',
    searchKey: 'isMale',
    type: 'array',
    serialize: (value: unknown) => (Array.isArray(value) ? value[0] : value),
    deserialize: (value: unknown) => (value ? [value] : []),
  },
  {
    columnId: 'deletedAt',
    searchKey: 'includedDeleted',
    type: 'array',
    serialize: (value: unknown) => (Array.isArray(value) ? value[0] : value),
    deserialize: (value: unknown) => (value ? [value] : []),
  },
]

// ============================================================================
// Component
// ============================================================================

export function PatientsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: PatientsTableProps) {
  const { setOpen, setCurrentRow } = usePatients()

  // Define row actions (context menu)
  const getRowActions = (row: { original: Patient }): DataTableAction[] => {
    const patient = row.original

    const actions: DataTableAction[] = [
      {
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentRow(patient)
          setOpen('edit')
        },
      },
    ]

    if (patient.deletedAt) {
      actions.push({
        label: 'Restore',
        icon: RotateCcw,
        onClick: () => {
          setCurrentRow(patient)
          setOpen('restore')
        },
        separator: true,
      })
    } else {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentRow(patient)
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
      entityName='patient'
      // Toolbar
      searchPlaceholder='Search patients...'
      searchKey='fullName'
      filters={[
        {
          columnId: 'deletedAt',
          title: 'Status',
          options: statusOptions.map((status) => ({
            label: status.label,
            value: status.value,
            icon: status.icon,
          })),
        },
        {
          columnId: 'isMale',
          title: 'Gender',
          options: genderOptions.map((gender) => ({
            label: gender.label,
            value: gender.value,
            icon: gender.icon,
          })),
        },
      ]}
      // Actions
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      // Advanced
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No patients found.'
    />
  )
}
