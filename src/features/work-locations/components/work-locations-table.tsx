
import { Edit, Trash2 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { statusOptions } from '../data/data'
import { type WorkLocation } from '../data/schema'
import {
  canUpdateWorkLocations,
  canDeleteWorkLocation,
} from '../utils/permissions'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { workLocationsColumns as columns } from './work-locations-columns'
import { useWorkLocations } from './work-locations-provider'





type WorkLocationsTableProps = {
  data: WorkLocation[]
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





export function WorkLocationsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: WorkLocationsTableProps) {
  const { setOpen, setCurrentRow } = useWorkLocations()

  
  const getRowActions = (row: {
    original: WorkLocation
  }): DataTableAction[] => {
    const workLocation = row.original

    const actions: DataTableAction[] = []

    
    if (canUpdateWorkLocations()) {
      actions.push({
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentRow(workLocation)
          setOpen('edit')
        },
      })
    }

    
    if (canDeleteWorkLocation({ workLocationId: workLocation.id })) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentRow(workLocation)
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
      entityName='work location'
      
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
      
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No work locations found. Create your first location to get started.'
    />
  )
}
