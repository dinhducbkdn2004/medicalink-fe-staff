/**
 * Generic DataTable Component
 * Reusable table with built-in features:
 * - Server-side pagination, sorting, filtering
 * - URL state management
 * - Context menu actions
 * - Bulk actions
 * - Skeleton loading
 * - Empty state
 *
 * Usage:
 * ```tsx
 * <DataTable
 *   data={doctors}
 *   columns={doctorsColumns}
 *   pageCount={10}
 *   isLoading={isLoading}
 *   search={search}
 *   navigate={navigate}
 *   entityName="doctor"
 *   searchPlaceholder="Search doctors..."
 *   getRowActions={(row) => [...actions]}
 *   renderBulkActions={(table) => <YourBulkActions />}
 * />
 * ```
 */
import { useEffect, useState } from 'react'
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
  type Row,
} from '@tanstack/react-table'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableContextMenu } from './context-menu'
import { DataTablePagination } from './pagination'
import { DataTableToolbar } from './toolbar'

// ============================================================================
// Types
// ============================================================================

export interface DataTableAction {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: 'default' | 'destructive'
  separator?: boolean
  disabled?: boolean
}

export interface DataTableFilter {
  columnId: string
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

// Re-export type from useTableUrlState for external use
export type ColumnFilterConfig =
  | {
      columnId: string
      searchKey: string
      type?: 'string'
      serialize?: (value: unknown) => unknown
      deserialize?: (value: unknown) => unknown
    }
  | {
      columnId: string
      searchKey: string
      type: 'array'
      serialize?: (value: unknown) => unknown
      deserialize?: (value: unknown) => unknown
    }

export interface DataTableProps<TData> {
  // Required props
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  search: Record<string, unknown>
  navigate: NavigateFn

  // Optional props
  pageCount?: number
  isLoading?: boolean
  entityName?: string

  // Toolbar configuration
  searchPlaceholder?: string
  searchKey?: string
  filters?: DataTableFilter[]

  // Actions
  getRowActions?: (row: Row<TData>) => DataTableAction[]
  renderBulkActions?: (
    table: ReturnType<typeof useReactTable<TData>>
  ) => React.ReactNode

  // Table configuration
  enableRowSelection?: boolean
  columnFilterConfigs?: ColumnFilterConfig[]

  // Empty state
  emptyMessage?: string

  // Styling
  className?: string
  hideToolbar?: boolean
}

// ============================================================================
// Component
// ============================================================================

export function DataTable<TData>({
  data,
  columns,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
  entityName = 'item',
  searchPlaceholder = 'Search...',
  searchKey,
  filters = [],
  getRowActions,
  renderBulkActions,
  enableRowSelection = true,
  columnFilterConfigs = [],
  emptyMessage,
  className,
  hideToolbar = false,
}: DataTableProps<TData>) {
  // ============================================================================
  // State Management
  // ============================================================================

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Initialize sorting from URL params
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortBy = search.sortBy as string | undefined
    const sortOrder = search.sortOrder as 'asc' | 'desc' | undefined

    if (sortBy && sortOrder) {
      return [{ id: sortBy, desc: sortOrder === 'desc' }]
    }
    return []
  })

  // URL state management
  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: columnFilterConfigs,
  })

  // ============================================================================
  // Table Instance
  // ============================================================================

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection,
    enableMultiSort: false,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // ============================================================================
  // Effects
  // ============================================================================

  // Ensure page is in valid range
  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  // Sync URL params to sorting state
  useEffect(() => {
    const sortBy = search.sortBy as string | undefined
    const sortOrder = search.sortOrder as 'asc' | 'desc' | undefined

    if (sortBy && sortOrder) {
      const newSorting = [{ id: sortBy, desc: sortOrder === 'desc' }]
      if (JSON.stringify(newSorting) !== JSON.stringify(sorting)) {
        setSorting(newSorting)
      }
    } else if (sorting.length > 0) {
      setSorting([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.sortBy, search.sortOrder])

  // Sync sorting state to URL
  useEffect(() => {
    if (sorting.length > 0) {
      const sort = sorting[0]
      const currentSortBy = search.sortBy
      const currentSortOrder = search.sortOrder

      if (
        currentSortBy !== sort.id ||
        currentSortOrder !== (sort.desc ? 'desc' : 'asc')
      ) {
        navigate({
          search: (prev) => ({
            ...prev,
            sortBy: sort.id,
            sortOrder: sort.desc ? 'desc' : 'asc',
          }),
          replace: true,
        })
      }
    } else if (search.sortBy || search.sortOrder) {
      navigate({
        search: (prev) => {
          const { sortBy, sortOrder, ...rest } = prev
          return rest
        },
        replace: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  // ============================================================================
  // Render
  // ============================================================================

  const defaultEmptyMessage = `No ${entityName}s found.`

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4',
        className
      )}
    >
      {/* Toolbar */}
      {!hideToolbar && (
        <DataTableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          searchKey={searchKey}
          filters={filters}
        />
      )}

      {/* Table */}
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: pagination.pageSize || 10 }).map(
                (_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {table.getHeaderGroups()[0].headers.map((header) => (
                      <TableCell
                        key={`skeleton-cell-${index}-${header.id}`}
                        className={cn(
                          header.column.columnDef.meta?.className,
                          header.column.columnDef.meta?.tdClassName
                        )}
                      >
                        <div className='flex items-center'>
                          <div className='bg-muted h-4 w-full animate-pulse rounded' />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const actions = getRowActions?.(row) ?? []

                return actions.length > 0 ? (
                  <DataTableContextMenu
                    key={row.id}
                    row={row}
                    actions={actions}
                  >
                    <TableRow
                      data-state={row.getIsSelected() && 'selected'}
                      className='group/row'
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                            cell.column.columnDef.meta?.className,
                            cell.column.columnDef.meta?.tdClassName
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </DataTableContextMenu>
                ) : (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className='group/row'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                          cell.column.columnDef.meta?.className,
                          cell.column.columnDef.meta?.tdClassName
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  {emptyMessage ?? defaultEmptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} className='mt-auto' />

      {/* Bulk Actions */}
      {renderBulkActions?.(table)}
    </div>
  )
}
