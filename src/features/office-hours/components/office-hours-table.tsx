
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
        label: 'Xóa',
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

  const pageIndex = Number(search.page) || 1
  const pageSize = Number(search.limit) || 10
  const paginatedData = data.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
  const pageCount = Math.ceil(data.length / pageSize)

  return (
    <DataTable
      data={paginatedData}
      columns={columns}
      search={search}
      navigate={navigate}
      
      pageCount={pageCount} 
      isLoading={isLoading}
      entityName='giờ làm việc'
      
      getRowActions={getRowActions}
      
      enableRowSelection={false}
      emptyMessage='Không tìm thấy giờ làm việc nào. Thêm giờ làm việc để xác định lịch làm việc.'
      hideToolbar={true}
    />
  )
}
