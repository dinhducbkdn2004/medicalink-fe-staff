
import { Edit, Trash2, Info } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { statusOptions } from '../data/data'
import { type Specialty } from '../data/schema'
import { canUpdateSpecialties, canDeleteSpecialty } from '../utils/permissions'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { specialtiesColumns as columns } from './specialties-columns'
import { useSpecialties } from './specialties-provider'





type SpecialtiesTableProps = {
  data: Specialty[]
  pageCount?: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}






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





export function SpecialtiesTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: SpecialtiesTableProps) {
  const { setOpen, setCurrentRow } = useSpecialties()

  
  const getRowActions = (row: { original: Specialty }): DataTableAction[] => {
    const specialty = row.original

    const actions: DataTableAction[] = [
      {
        label: 'View Info Sections',
        icon: Info,
        onClick: () => {
          setCurrentRow(specialty)
          setOpen('view-info')
        },
      },
    ]

    
    if (canUpdateSpecialties()) {
      actions.push({
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentRow(specialty)
          setOpen('edit')
        },
        separator: true,
      })
    }

    
    if (canDeleteSpecialty({ specialtyId: specialty.id })) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentRow(specialty)
          setOpen('delete')
        },
        variant: 'destructive',
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
      entityName='specialty'
      
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
      
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No specialties found. Create your first specialty to get started.'
    />
  )
}
