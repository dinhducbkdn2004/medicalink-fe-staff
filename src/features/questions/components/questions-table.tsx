import type { UseNavigateResult } from '@tanstack/react-router'
import { Edit, Trash2, Eye } from 'lucide-react'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { statusOptions } from '../data/data'
import type { Question } from '../data/schema'
import { usePublicSpecialties } from '../data/use-specialties'
import { canUpdateQuestions, canDeleteQuestion } from '../utils/permissions'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { columns } from './questions-columns'
import { useQuestions } from './use-questions'

interface QuestionsTableProps {
  data: Question[]
  pageCount?: number
  search: Record<string, unknown>
  navigate: UseNavigateResult<string>
  isLoading?: boolean
}

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
  {
    columnId: 'specialtyId',
    searchKey: 'specialtyId',
    serialize: (value: unknown) => {
      const arr = value as string[]
      return arr.length > 0 ? arr[0] : undefined
    },
    deserialize: (value: unknown) => (value ? [value] : []),
  },
  {
    columnId: 'authorEmail',
    searchKey: 'search',
    type: 'string',
    serialize: (value: unknown) => value as string,
    deserialize: (value: unknown) => value as string,
  },
]

export function QuestionsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: Readonly<QuestionsTableProps>) {
  const { setOpen, setCurrentQuestion } = useQuestions()
  const { data: specialtiesData } = usePublicSpecialties({ limit: 100 })
  const specialties = specialtiesData?.data || []

  const getRowActions = (row: { original: Question }): DataTableAction[] => {
    const question = row.original

    const actions: DataTableAction[] = [
      {
        label: 'View Details',
        icon: Eye,
        onClick: () => {
          setCurrentQuestion(question)
          setOpen('view')
        },
      },
    ]

    if (canUpdateQuestions()) {
      actions.push({
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentQuestion(question)
          setOpen('edit')
        },
      })
    }

    if (canDeleteQuestion({ questionId: question.id })) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentQuestion(question)
          setOpen('delete')
        },
        variant: 'destructive',
        separator: true,
      })
    }

    return actions
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      search={search}
      navigate={navigate as never}
      pageCount={pageCount}
      isLoading={isLoading}
      entityName='question'
      searchPlaceholder='Search by author email...'
      searchKey='authorEmail'
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
        {
          columnId: 'specialtyId',
          title: 'Specialty',
          options: specialties.map((s) => ({
            label: s.name,
            value: s.id,
          })),
        },
      ]}
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No questions found.'
    />
  )
}
