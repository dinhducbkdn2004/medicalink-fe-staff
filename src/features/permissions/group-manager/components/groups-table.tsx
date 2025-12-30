
import { Edit, Trash2, Shield } from 'lucide-react'
import type { PermissionGroup } from '@/api/types/permission.types'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { DataTable, type DataTableAction } from '@/components/data-table'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { groupColumns } from './group-columns'
import { useGroupManager } from './use-group-manager'

type GroupsTableProps = {
  data: PermissionGroup[]
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}

export function GroupsTable({
  data,
  search,
  navigate,
  isLoading = false,
}: Readonly<GroupsTableProps>) {
  const { setOpen, setCurrentGroup } = useGroupManager()

  
  const getRowActions = (row: {
    original: PermissionGroup
  }): DataTableAction[] => {
    const group = row.original

    return [
      {
        label: 'View Permissions',
        icon: Shield,
        onClick: () => {
          setCurrentGroup(group)
          setOpen('permissions')
        },
      },
      {
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentGroup(group)
          setOpen('edit')
        },
        separator: true,
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentGroup(group)
          setOpen('delete')
        },
        variant: 'destructive',
      },
    ]
  }

  return (
    <DataTable
      
      data={data}
      columns={groupColumns}
      search={search}
      navigate={navigate}
      
      isLoading={isLoading}
      entityName='permission group'
      
      
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      
      enableRowSelection={true}
      emptyMessage='No permission groups found.'
      hideToolbar={true}
    />
  )
}
