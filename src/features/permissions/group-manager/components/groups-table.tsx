/**
 * Groups Table Component
 * Table view for permission groups management
 */
import { Edit, Trash2, Shield } from 'lucide-react'
import type { PermissionGroup } from '@/api/types/permission.types'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { DataTable, type DataTableAction } from '@/components/data-table'
import { groupColumns } from './group-columns'
import { useGroupManager } from './group-manager-provider'
import { DataTableBulkActions } from './data-table-bulk-actions'

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
}: GroupsTableProps) {
  const { setOpen, setCurrentGroup } = useGroupManager()

  // Define row actions (context menu)
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
      // Required props
      data={data}
      columns={groupColumns}
      search={search}
      navigate={navigate}
      // Configuration
      isLoading={isLoading}
      entityName='permission group'
      // Toolbar
      searchPlaceholder='Filter groups...'
      searchKey='name'
      filters={[
        {
          columnId: 'isActive',
          title: 'Status',
          options: [
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
          ],
        },
      ]}
      // Actions
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      // Advanced
      enableRowSelection={true}
      emptyMessage='No permission groups found.'
    />
  )
}
