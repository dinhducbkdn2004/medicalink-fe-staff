import { Trash2 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { DataTable, type DataTableAction } from '@/components/data-table'
import { type SpecialShift } from '../data/schema'
import { specialShiftsColumns as columns } from './special-shifts-columns'
import { useSpecialShiftsContext } from './special-shifts-provider'

type SpecialShiftsTableProps = {
  data: SpecialShift[]
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
  hideToolbar?: boolean
}

export function SpecialShiftsTable({
  data,
  search,
  navigate,
  isLoading = false,
  hideToolbar = false,
}: Readonly<SpecialShiftsTableProps>) {
  const { setOpen, setCurrentRow } = useSpecialShiftsContext()

  const getRowActions = (row: { original: SpecialShift }): DataTableAction[] => {
    const shift = row.original
    const actions: DataTableAction[] = []

    actions.push({
      label: 'Delete',
      icon: Trash2,
      onClick: () => {
        setCurrentRow(shift)
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
      entityName='special shift'
      getRowActions={getRowActions}
      enableRowSelection={false}
      emptyMessage='No special shifts found.'
      hideToolbar={hideToolbar}
    />
  )
}
