/**
 * Questions Table
 * Data table component for displaying questions
 */
import type { UseNavigateResult } from '@tanstack/react-router'
import { Edit, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { statusOptions } from '../data/data'
import type { Question } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { columns } from './questions-columns'
import { useQuestions } from './use-questions'

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
    searchKey: 'status',
    serialize: (value: unknown) => {
      const arr = value as string[]
      return arr.length > 0 ? arr[0] : undefined
    },
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
}: Readonly<QuestionsTableProps>) {
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
        label: 'Mark as Answered',
        icon: CheckCircle,
        onClick: () => {
          setCurrentQuestion(question)
          setOpen('answer')
        },
        disabled:
          question.status === 'ANSWERED' || question.status === 'CLOSED',
      },
      {
        label: 'Close Question',
        icon: XCircle,
        onClick: () => {
          setCurrentQuestion(question)
          setOpen('close')
        },
        variant: 'destructive',
        disabled: question.status === 'CLOSED',
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
      navigate={navigate as never}
      // Configuration
      pageCount={pageCount}
      isLoading={isLoading}
      entityName='question'
      // Toolbar
      searchPlaceholder='Search questions...'
      searchKey='title'
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
