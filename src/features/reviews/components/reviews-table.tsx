
import { Eye, Trash2 } from 'lucide-react'
import type { Review } from '@/api/services/review.service'




import { type NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { verifiedOptions } from '../data/data'
import { canDeleteReview } from '../utils/permissions'
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





export function ReviewsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: Readonly<ReviewsTableProps>) {
  const { setOpen, setCurrentReview } = useReviews()

  
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

    
    if (canDeleteReview({ reviewId: review.id })) {
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
      
      data={data}
      columns={columns}
      search={search}
      navigate={navigate}
      
      pageCount={pageCount}
      isLoading={isLoading}
      entityName='review'
      
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
      
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No reviews found.'
    />
  )
}
