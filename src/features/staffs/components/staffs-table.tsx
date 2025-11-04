import { useEffect, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from '@tanstack/react-table'
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
import { Skeleton } from '@/components/ui/skeleton'
import { DataTablePagination, DataTableToolbar, DataTableContextMenu } from '@/components/data-table'
import { Edit, Trash2 } from 'lucide-react'
import { staffRoles, genderOptions } from '../data/data'
import { type Staff } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { staffsColumns as columns } from './staffs-columns'
import { useStaffs } from './staffs-provider'

type DataTableProps = {
  data: Staff[]
  pageCount?: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}

export function StaffsTable({ data, pageCount = 0, search, navigate, isLoading = false }: DataTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const { setOpen, setCurrentRow } = useStaffs()
  
  // Initialize sorting from URL params
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortBy = search.sortBy as string | undefined
    const sortOrder = search.sortOrder as 'asc' | 'desc' | undefined
    
    if (sortBy && sortOrder) {
      return [{ id: sortBy, desc: sortOrder === 'desc' }]
    }
    return []
  })

  // Synced with URL states (keys/defaults mirror staffs route search schema)
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
    columnFilters: [
      // Search filter for full name and email
      { columnId: 'fullName', searchKey: 'search', type: 'string' },
      { columnId: 'email', searchKey: 'email', type: 'string' },
      { 
        columnId: 'role', 
        searchKey: 'role', 
        type: 'array',
        serialize: (value: unknown) => Array.isArray(value) ? value[0] : value,
        deserialize: (value: unknown) => value ? [value] : [],
      },
      { 
        columnId: 'isMale', 
        searchKey: 'isMale', 
        type: 'array',
        serialize: (value: unknown) => Array.isArray(value) ? value[0] : value,
        deserialize: (value: unknown) => value ? [value] : [],
      },
    ],
  })

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
    enableRowSelection: true,
    enableMultiSort: false, // Only allow sorting by one column at a time
    manualPagination: true, // Server-side pagination
    manualFiltering: true,  // Server-side filtering
    manualSorting: true,    // Server-side sorting
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  // Sync URL params back to sorting state when they change externally
  useEffect(() => {
    const sortBy = search.sortBy as string | undefined
    const sortOrder = search.sortOrder as 'asc' | 'desc' | undefined
    
    if (sortBy && sortOrder) {
      const newSorting = [{ id: sortBy, desc: sortOrder === 'desc' }]
      // Only update if different to avoid loops
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
      
      // Only navigate if values actually changed
      if (currentSortBy !== sort.id || currentSortOrder !== (sort.desc ? 'desc' : 'asc')) {
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
      // Clear sorting from URL when no sorting is applied
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

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder='Filter staff members...'
        searchKey='fullName'
        filters={[
          {
            columnId: 'role',
            title: 'Role',
            options: staffRoles.map((role) => ({
              label: role.label,
              value: role.value,
              icon: role.icon,
            })),
          },
          {
            columnId: 'isMale',
            title: 'Gender',
            options: genderOptions.map((gender) => ({
              label: gender.label,
              value: gender.value,
            })),
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: pagination.pageSize || 10 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className='h-6 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const staff = row.original
                const contextActions = [
                  {
                    label: 'Edit',
                    icon: Edit,
                    onClick: () => {
                      setCurrentRow(staff)
                      setOpen('edit')
                    },
                  },
                  {
                    label: 'Delete',
                    icon: Trash2,
                    onClick: () => {
                      setCurrentRow(staff)
                      setOpen('delete')
                    },
                    variant: 'destructive' as const,
                    separator: true,
                  },
                ]

                return (
                  <DataTableContextMenu key={row.id} row={row} actions={contextActions}>
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
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No staff members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <DataTableBulkActions table={table} />
    </div>
  )
}

