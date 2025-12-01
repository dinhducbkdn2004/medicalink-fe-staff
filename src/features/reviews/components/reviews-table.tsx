/**
 * Reviews Table
 * Data table component for displaying reviews
 */
import type { UseNavigateResult } from '@tanstack/react-router'
import { Eye, Trash2, CheckCircle } from 'lucide-react'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { statusOptions, ratingOptions } from '../data/data'
import type { Review } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { columns } from './reviews-columns'
import { useReviews } from './use-reviews'

// ============================================================================
// Types
// ============================================================================

interface ReviewsTableProps {
  data: Review[]
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
  {
    columnId: 'rating',
    queryParam: 'rating',
    serialize: (value: string[]) => (value.length > 0 ? value[0] : undefined),
    deserialize: (value: unknown) => (value ? [value] : []),
  },
]

// ============================================================================
// Component
// ============================================================================

export function ReviewsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: Readonly<ReviewsTableProps>) {
  const { setOpen, setCurrentReview } = useReviews()

  // Define row actions (context menu)
  const getRowActions = (row: { original: Review }): DataTableAction[] => {
    const review = row.original

    return [
      {
        label: 'View Details',
        icon: Eye,
        onClick: () => {
          setCurrentReview(review)
          setOpen('view')
        },
      },
      {
        label: 'Approve',
        icon: CheckCircle,
        onClick: () => {
          setCurrentReview(review)
          setOpen('approve')
        },
        disabled: review.status === 'APPROVED',
      },
      {
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentReview(review)
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
      entityName='review'
      // Toolbar
      searchPlaceholder='Search by doctor or patient...'
      // Using global filter instead of column-specific search
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
          columnId: 'rating',
          title: 'Rating',
          options: ratingOptions.map((rating) => ({
            label: rating.label,
            value: rating.value,
            icon: rating.icon,
          })),
        },
      ]}
      // Actions
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      // Advanced
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No reviews found.'
    />
  )
}
