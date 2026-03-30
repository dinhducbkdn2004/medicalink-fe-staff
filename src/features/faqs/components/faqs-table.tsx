import { Edit, Power, Trash2 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type ColumnFilterConfig,
  type DataTableAction,
} from '@/components/data-table'
import type { Faq } from '@/api/services/faq.service'
import { faqActiveFilterOptions } from '../data/data'
import { faqsColumns } from './faqs-columns'
import {
  canDeleteFaq,
  canToggleFaq,
  canUpdateFaq,
} from '../utils/permissions'

const columnFilterConfigs: ColumnFilterConfig[] = [
  {
    columnId: 'question',
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

interface FaqsTableProps {
  data: Faq[]
  pageCount: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
  onEdit: (row: Faq) => void
  onDelete: (row: Faq) => void
  onToggleActive: (row: Faq) => void
}

export function FaqsTable({
  data,
  pageCount,
  search,
  navigate,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: FaqsTableProps) {
  const getRowActions = (row: { original: Faq }): DataTableAction[] => {
    const faq = row.original
    const actions: DataTableAction[] = []
    if (canUpdateFaq()) {
      actions.push({
        label: 'Edit',
        icon: Edit,
        onClick: () => onEdit(faq),
      })
    }
    if (canToggleFaq()) {
      actions.push({
        label: faq.isActive ? 'Turn off display' : 'Turn on display',
        icon: Power,
        onClick: () => onToggleActive(faq),
      })
    }
    if (canDeleteFaq()) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        onClick: () => onDelete(faq),
        variant: 'destructive',
      })
    }
    return actions
  }

  return (
    <DataTable
      data={data}
      columns={faqsColumns}
      search={search}
      navigate={navigate}
      pageCount={pageCount}
      isLoading={isLoading}
      entityName='FAQ'
      searchPlaceholder='Search by question or content...'
      searchKey='question'
      filters={[
        {
          columnId: 'isActive',
          title: 'Status',
          options: faqActiveFilterOptions.map((o) => ({
            label: o.label,
            value: o.value,
            icon: o.icon,
          })),
        },
      ]}
      getRowActions={getRowActions}
      enableRowSelection
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No FAQ yet.'
    />
  )
}
