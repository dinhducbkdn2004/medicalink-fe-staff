import { Edit, Star, Trash2 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type ColumnFilterConfig,
  type DataTableAction,
} from '@/components/data-table'
import type { Testimonial } from '@/api/services/testimonial.service'
import { testimonialFeaturedFilterOptions } from '../data/data'
import { testimonialsColumns } from './testimonials-columns'
import {
  canDeleteTestimonial,
  canToggleFeatured,
  canUpdateTestimonial,
} from '../utils/permissions'

const columnFilterConfigs: ColumnFilterConfig[] = [
  {
    columnId: 'content',
    searchKey: 'search',
    type: 'string',
  },
  {
    columnId: 'isFeatured',
    searchKey: 'isFeatured',
    type: 'array',
    serialize: (value: unknown) => (Array.isArray(value) ? value[0] : value),
    deserialize: (value: unknown) => (value ? [value] : []),
  },
]

interface TestimonialsTableProps {
  data: Testimonial[]
  pageCount: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
  onEdit: (row: Testimonial) => void
  onDelete: (row: Testimonial) => void
  onToggleFeatured: (row: Testimonial) => void
}

export function TestimonialsTable({
  data,
  pageCount,
  search,
  navigate,
  isLoading,
  onEdit,
  onDelete,
  onToggleFeatured,
}: TestimonialsTableProps) {
  const getRowActions = (row: { original: Testimonial }): DataTableAction[] => {
    const t = row.original
    const actions: DataTableAction[] = []
    if (canUpdateTestimonial()) {
      actions.push({
        label: 'Edit',
        icon: Edit,
        onClick: () => onEdit(t),
      })
    }
    if (canToggleFeatured()) {
      actions.push({
        label: t.isFeatured ? 'Remove featured' : 'Mark as featured',
        icon: Star,
        onClick: () => onToggleFeatured(t),
      })
    }
    if (canDeleteTestimonial()) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        onClick: () => onDelete(t),
        variant: 'destructive',
      })
    }
    return actions
  }

  return (
    <DataTable
      data={data}
      columns={testimonialsColumns}
      search={search}
      navigate={navigate}
      pageCount={pageCount}
      isLoading={isLoading}
      entityName='testimonial'
      searchPlaceholder='Search by name or content...'
      searchKey='content'
      filters={[
        {
          columnId: 'isFeatured',
          title: 'Featured',
          options: testimonialFeaturedFilterOptions.map((o) => ({
            label: o.label,
            value: o.value,
            icon: o.icon,
          })),
        },
      ]}
      getRowActions={getRowActions}
      enableRowSelection
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No testimonial yet.'
    />
  )
}
