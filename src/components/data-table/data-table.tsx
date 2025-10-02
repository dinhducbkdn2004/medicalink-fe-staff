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

interface DataTableProps<TData, TValue> {
	readonly columns: ColumnDef<TData, TValue>[];
	readonly data: TData[];
	readonly searchKey?: string;
	readonly searchValue?: string;
	readonly onSearchChange?: (value: string) => void;
	readonly toolbar?: React.ReactNode;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey,
	searchValue,
	onSearchChange,
	toolbar,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: "createdAt", desc: true }, // Default sort by created date descending
	]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	// Handle search from parent component
	React.useEffect(() => {
		if (searchKey && onSearchChange) {
			const column = table.getColumn(searchKey);
			if (column) {
				column.setFilterValue(searchValue);
			}
		}
	}, [searchKey, searchValue, table, onSearchChange]);

	// Enhanced toolbar that gets the table instance
	const enhancedToolbar = React.useMemo(() => {
		if (!toolbar) return null;

		// Clone the toolbar and pass the table instance
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
						{table.getRowModel().rows?.length ? (
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
							))
						) : (
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
		</div>
	);
}
