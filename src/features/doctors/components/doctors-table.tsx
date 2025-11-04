/**
 * Doctors Table Component
 * Table view for doctor account management with API integration
 */

import { useEffect, useState } from 'react';
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination, DataTableToolbar, DataTableContextMenu } from '@/components/data-table';
import { Eye, Edit, Trash2, Power } from 'lucide-react';
import type { DoctorWithProfile } from '../types';
import { doctorsColumns as columns } from './doctors-columns';
import { DataTableBulkActions } from './data-table-bulk-actions';
import { useDoctors } from './doctors-provider';
import { statusOptions, genderOptions } from '../data/data';

type DoctorsTableProps = {
  data: DoctorWithProfile[];
  pageCount?: number;
  search: Record<string, unknown>;
  navigate: NavigateFn;
  isLoading?: boolean;
};

export function DoctorsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: DoctorsTableProps) {
  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const { setOpen, setCurrentRow } = useDoctors();
  
  // Initialize sorting from URL params
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortBy = search.sortBy as string | undefined;
    const sortOrder = search.sortOrder as 'asc' | 'desc' | undefined;
    
    if (sortBy && sortOrder) {
      return [{ id: sortBy, desc: sortOrder === 'desc' }];
    }
    return [];
  });

  // Synced with URL states
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
      { columnId: 'fullName', searchKey: 'search', type: 'string' },
      { 
        columnId: 'isActive', 
        searchKey: 'isActive', 
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
  });

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
  });

  useEffect(() => {
    ensurePageInRange(table.getPageCount());
  }, [table, ensurePageInRange]);

  // Sync URL params back to sorting state when they change externally
  useEffect(() => {
    const sortBy = search.sortBy as string | undefined;
    const sortOrder = search.sortOrder as 'asc' | 'desc' | undefined;
    
    if (sortBy && sortOrder) {
      const newSorting = [{ id: sortBy, desc: sortOrder === 'desc' }];
      // Only update if different to avoid loops
      if (JSON.stringify(newSorting) !== JSON.stringify(sorting)) {
        setSorting(newSorting);
      }
    } else if (sorting.length > 0) {
      setSorting([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.sortBy, search.sortOrder]);

  // Sync sorting state to URL
  useEffect(() => {
    if (sorting.length > 0) {
      const sort = sorting[0];
      const currentSortBy = search.sortBy;
      const currentSortOrder = search.sortOrder;
      
      // Only navigate if values actually changed
      if (currentSortBy !== sort.id || currentSortOrder !== (sort.desc ? 'desc' : 'asc')) {
        navigate({
          search: (prev) => ({
            ...prev,
            sortBy: sort.id,
            sortOrder: sort.desc ? 'desc' : 'asc',
          }),
          replace: true,
        });
      }
    } else if (search.sortBy || search.sortOrder) {
      // Clear sorting from URL when no sorting is applied
      navigate({
        search: (prev) => {
          const { sortBy, sortOrder, ...rest } = prev;
          return rest;
        },
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder="Search doctors..."
        searchKey="fullName"
        filters={[
          {
            columnId: 'isActive',
            title: 'Status',
            options: statusOptions.map((status) => ({
              label: status.label,
              value: status.value,
              icon: status.icon,
            })),
          },
          {
            columnId: 'isMale',
            title: 'Gender',
            options: genderOptions.map((gender) => ({
              label: gender.label,
              value: gender.value,
              icon: gender.icon,
            })),
          },
        ]}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const doctor = row.original;
                const contextActions = [
                  {
                    label: 'View Profile',
                    icon: Eye,
                    onClick: () => {
                      navigate({ to: '/doctors/$doctorId/profile', params: { doctorId: doctor.id } });
                    },
                  },
                  {
                    label: 'Edit',
                    icon: Edit,
                    onClick: () => {
                      setCurrentRow(doctor);
                      setOpen('edit');
                    },
                  },
                  {
                    label: doctor.isActive ? 'Deactivate' : 'Activate',
                    icon: Power,
                    onClick: () => {
                      setCurrentRow(doctor);
                      setOpen('toggleActive');
                    },
                    separator: true,
                  },
                  {
                    label: 'Delete',
                    icon: Trash2,
                    onClick: () => {
                      setCurrentRow(doctor);
                      setOpen('delete');
                    },
                    variant: 'destructive' as const,
                  },
                ];

                return (
                  <DataTableContextMenu key={row.id} row={row} actions={contextActions}>
                    <TableRow
                      data-state={row.getIsSelected() && 'selected'}
                      className="group/row"
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
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </DataTableContextMenu>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No doctors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="mt-auto" />
      <DataTableBulkActions table={table} />
    </div>
  );
}

