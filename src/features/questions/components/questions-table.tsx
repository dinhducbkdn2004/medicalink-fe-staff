/**
 * Questions Table
 * Data table component for displaying questions
 */
import type { UseNavigateResult } from '@tanstack/react-router'
import { DataTable, type ColumnFilterConfig } from '@/components/data-table'
import type { Question } from '../data/schema'
import { columns } from './questions-columns'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { useQuestions } from './questions-provider'
import { Edit, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react'
import type { DataTableAction } from '@/components/data-table/data-table-row-actions'
import { statusOptions } from '../data/data'

// ============================================================================
// Types
// ============================================================================

interface QuestionsTableProps {
  data: Question[]
  pageCount?: number
  search: Record<string, unknown>
  navigate: UseNavigateResult<string>
  isLoading?: boolean
}

// ============================================================================
// Column Filter Configs
// ============================================================================

const columnFilterConfigs: ColumnFilterConfig[] = [
  {
    columnId: 'status',
    queryParam: 'status',
    serialize: (value: string[]) => (value.length > 0 ? value[0] : undefined),
    deserialize: (value: unknown) => (value ? [value] : []),
  },
]

// ============================================================================
// Component
// ============================================================================

export function QuestionsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: QuestionsTableProps) {
  const { setOpen, setCurrentQuestion } = useQuestions()

  // Define row actions (context menu)
  const getRowActions = (row: { original: Question }): DataTableAction[] => {
    const question = row.original

    return [
      {
        label: 'View Details',
        icon: Eye,
        onClick: () => {
          setCurrentQuestion(question)
          setOpen('view')
        },
      },
      {
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentQuestion(question)
          setOpen('edit')
        },
      },
      {
        label: 'Approve',
        icon: CheckCircle,
        onClick: () => {
          setCurrentQuestion(question)
          setOpen('approve')
        },
        disabled: question.status === 'APPROVED' || question.status === 'ANSWERED',
      },
      {
        label: 'Reject',
        icon: XCircle,
        onClick: () => {
          setCurrentQuestion(question)
          setOpen('reject')
        },
        variant: 'destructive',
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentQuestion(question)
          setOpen('delete')
        },
        variant: 'destructive',
        separator: true,
      },
    ]
  }

  return (
    <DataTable
      // Required props
      data={data}
      columns={columns}
      search={search}
      navigate={navigate}
      // Configuration
      pageCount={pageCount}
      isLoading={isLoading}
      entityName='question'
      // Toolbar
      searchPlaceholder='Search questions...'
      searchKey='search'
      filters={[
        {
          columnId: 'status',
          title: 'Status',
          options: statusOptions.map((status) => ({
            label: status.label,
            value: status.value,
            icon: status.icon,
          })),
        },
      ]}
      // Actions
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      // Advanced
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No questions found.'
    />
  )
}

