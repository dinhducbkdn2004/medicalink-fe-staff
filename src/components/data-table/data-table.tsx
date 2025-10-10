"use client";

import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "./data-table-pagination";

// Skeleton row component
const SkeletonRow = ({ columns }: { columns: number }) => (
	<TableRow>
		{Array.from({ length: columns }, (_, index) => (
			<TableCell key={index} className="h-12">
				{index === 0 ? (
					<div className="flex items-center space-x-3">
						<Skeleton className="h-8 w-8 rounded-full" />
						<Skeleton className="h-4 w-32" />
					</div>
				) : (
					<Skeleton className="h-4 w-20" />
				)}
			</TableCell>
		))}
	</TableRow>
);

interface DataTableProps<TData, TValue> {
	readonly columns: ColumnDef<TData, TValue>[];
	readonly data: TData[];
	readonly searchKey?: string;
	readonly searchValue?: string;
	readonly onSearchChange?: (value: string) => void;
	readonly toolbar?: React.ReactNode;
	readonly showPagination?: boolean;
	readonly isLoading?: boolean;
	readonly loadingRows?: number;
	// Server-side pagination props
	readonly pageCount?: number;
	readonly pageIndex?: number;
	readonly pageSize?: number;
	readonly onPageChange?: (page: number) => void;
	readonly onPageSizeChange?: (pageSize: number) => void;
	readonly totalCount?: number;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey,
	searchValue,
	onSearchChange,
	toolbar,
	showPagination = true,
	isLoading = false,
	loadingRows = 10,
	pageCount,
	pageIndex,
	pageSize,
	onPageChange,
	onPageSizeChange,
	totalCount,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: "createdAt", desc: true },
	]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	// Determine if we're using server-side pagination
	const isServerSide = Boolean(
		pageCount !== undefined && onPageChange && onPageSizeChange
	);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		...(isServerSide
			? {
					// Server-side pagination
					manualPagination: true,
					pageCount: pageCount || 0,
				}
			: {
					// Client-side pagination
					getPaginationRowModel: getPaginationRowModel(),
				}),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			...(isServerSide && {
				pagination: {
					pageIndex: (pageIndex || 1) - 1, // Convert 1-based to 0-based
					pageSize: pageSize || 10,
				},
			}),
		},
	});

	React.useEffect(() => {
		if (searchKey && onSearchChange) {
			const column = table.getColumn(searchKey);
			if (column) {
				column.setFilterValue(searchValue);
			}
		}
	}, [searchKey, searchValue, table, onSearchChange]);

	const enhancedToolbar = React.useMemo(() => {
		if (!toolbar) return null;

		if (React.isValidElement(toolbar)) {
			return React.cloneElement(toolbar as React.ReactElement<any>, { table });
		}

		return toolbar;
	}, [toolbar, table]);

	return (
		<div className="space-y-4">
			{enhancedToolbar}
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
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
						{isLoading &&
							// Show skeleton rows when loading
							Array.from({ length: loadingRows }, (_, index) => (
								<SkeletonRow key={index} columns={columns.length} />
							))}

						{!isLoading &&
							table.getRowModel().rows?.length > 0 &&
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))}

						{!isLoading && table.getRowModel().rows?.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{showPagination && (
				<DataTablePagination
					table={table}
					isServerSide={isServerSide}
					showRowSelection={false}
					{...(onPageChange && { onPageChange })}
					{...(onPageSizeChange && { onPageSizeChange })}
					{...(totalCount !== undefined && { totalCount })}
				/>
			)}
		</div>
	);
}
