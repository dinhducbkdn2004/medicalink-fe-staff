
import { Trash2 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { DataTable, type DataTableAction } from '@/components/data-table'
import { type OfficeHour } from '../data/schema'
import { canDeleteOfficeHour } from '../utils/permissions'
import { officeHoursColumns as columns } from './office-hours-columns'
import { useOfficeHoursContext } from './office-hours-provider'





type OfficeHoursTableProps = {
  data: OfficeHour[]
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}





export function OfficeHoursTable({
  data,
  search,
  navigate,
  isLoading = false,
}: Readonly<OfficeHoursTableProps>) {
  const { setOpen, setCurrentRow } = useOfficeHoursContext()

  
  
  const getRowActions = (row: { original: OfficeHour }): DataTableAction[] => {
    const officeHour = row.original

    const actions: DataTableAction[] = []

    
    if (canDeleteOfficeHour({ officeHourId: officeHour.id })) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentRow(officeHour)
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
      
      pageCount={1} 
      isLoading={isLoading}
      entityName='office hour'
      
      getRowActions={getRowActions}
      
      enableRowSelection={false}
      emptyMessage='No office hours found. Add office hours to define working schedules.'
      hideToolbar={true}
    />
  )
}
