import { Trash2 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { DataTable, type DataTableAction } from '@/components/data-table'
import { type ClinicException } from '../data/schema'
import { clinicExceptionsColumns as columns } from './clinic-exceptions-columns'
import { useHolidaysContext } from './holidays-provider'

type ClinicExceptionsTableProps = {
  data: ClinicException[]
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}

export function ClinicExceptionsTable({
  data,
  search,
  navigate,
  isLoading = false,
}: Readonly<ClinicExceptionsTableProps>) {
  const { setOpen, setCurrentRow } = useHolidaysContext()

  const getRowActions = (row: { original: ClinicException }): DataTableAction[] => {
    const exception = row.original
    const actions: DataTableAction[] = []

    actions.push({
      label: 'Xóa',
      icon: Trash2,
      onClick: () => {
        setCurrentRow(exception)
        setOpen('delete')
      },
      variant: 'destructive',
    })

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
      entityName='ngày nghỉ'
      getRowActions={getRowActions}
      enableRowSelection={false}
      emptyMessage='Không tìm thấy ngày nghỉ nào. Thêm ngày nghỉ để ghi đè lịch thông thường.'
      hideToolbar={true}
    />
  )
}
