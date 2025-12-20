/**
 * Reviews Table
 * Data table component for displaying reviews
 */
import { Eye, Trash2 } from 'lucide-react'
import type { Review } from '@/api/services/review.service'
import { useAuthStore } from '@/stores/auth-store'
// ============================================================================
// Types
// ============================================================================

import { type NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { verifiedOptions } from '../data/data'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { columns } from './reviews-columns'
import { useReviews } from './use-reviews'

interface ReviewsTableProps {
  data: Review[]
  pageCount?: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}

// ============================================================================
// Column Filter Configs
// ============================================================================

const columnFilterConfigs: ColumnFilterConfig[] = [
  {
    columnId: 'rating',
    searchKey: 'rating',
    serialize: (value: unknown) => {
      const arr = value as string[]
      return arr.length > 0 ? arr[0] : undefined
    },
    deserialize: (value: unknown) => (value ? [value] : []),
  },
  {
    columnId: 'isPublic',
    searchKey: 'isPublic',
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

export function ReviewsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: Readonly<ReviewsTableProps>) {
  const { setOpen, setCurrentReview } = useReviews()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN'

  // Define row actions (context menu)
  const getRowActions = (row: { original: Review }): DataTableAction[] => {
    const review = row.original

    const actions: DataTableAction[] = [
      {
        label: 'View Details',
        icon: Eye,
        onClick: () => {
          setCurrentReview(review)
          setOpen('view')
        },
      },
    ]

    // Only Admins can delete
    if (isAdmin) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentReview(review)
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
      // Required props
      data={data}
      columns={columns}
      search={search}
      navigate={navigate}
      // Configuration
      pageCount={pageCount}
      isLoading={isLoading}
      entityName='review'
      // Toolbar - no search bar
      filters={[
        {
          columnId: 'isPublic',
          title: 'Verified Status',
          options: verifiedOptions.map((option) => ({
            label: option.label,
            value: option.value,
            icon: option.icon,
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
