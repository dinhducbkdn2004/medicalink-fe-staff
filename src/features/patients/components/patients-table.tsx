
import { Edit, Trash2, RotateCcw } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { statusOptions, genderOptions } from '../data/data'
import type { Patient } from '../types'
import { canDeletePatient, canUpdatePatients } from '../utils/permissions'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { patientsColumns as columns } from './patients-columns'
import { usePatients } from './patients-provider'





type PatientsTableProps = {
  data: Patient[]
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





export function PatientsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: PatientsTableProps) {
  const { setOpen, setCurrentRow } = usePatients()

  
  const getRowActions = (row: { original: Patient }): DataTableAction[] => {
    const patient = row.original

    const actions: DataTableAction[] = []

    
    if (canUpdatePatients()) {
      actions.push({
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentRow(patient)
          setOpen('edit')
        },
      })
    }

    if (patient.deletedAt) {
      
      if (canUpdatePatients()) {
        actions.push({
          label: 'Restore',
          icon: RotateCcw,
          onClick: () => {
            setCurrentRow(patient)
            setOpen('restore')
          },
          separator: true,
        })
      }
    } else {
      
      if (canDeletePatient({ patientId: patient.id })) {
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
      entityName='patient'
      
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
      
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No patients found.'
    />
  )
}
