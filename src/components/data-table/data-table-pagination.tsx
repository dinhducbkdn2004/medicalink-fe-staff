import { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
	readonly table: Table<TData>;
	readonly isServerSide?: boolean;
	readonly onPageChange?: (page: number) => void;
	readonly onPageSizeChange?: (pageSize: number) => void;
	readonly totalCount?: number;
	readonly showRowSelection?: boolean;
}

export function DataTablePagination<TData>({
	table,
	isServerSide = false,
	onPageChange,
	onPageSizeChange,
	totalCount,
	showRowSelection = false,
}: DataTablePaginationProps<TData>) {
	// Custom handlers for server-side pagination
	const handlePageChange = (newPage: number) => {
		if (isServerSide && onPageChange) {
			onPageChange(newPage + 1); // Convert 0-based to 1-based
		} else {
			table.setPageIndex(newPage);
		}
	};

	const handlePageSizeChange = (newPageSize: number) => {
		if (isServerSide && onPageSizeChange) {
			onPageSizeChange(newPageSize);
		} else {
			table.setPageSize(newPageSize);
		}
	};

	const currentPage = table.getState().pagination.pageIndex;
	const currentPageSize = table.getState().pagination.pageSize;
	const totalPages = isServerSide ? table.getPageCount() : table.getPageCount();
	const totalRows = isServerSide
		? totalCount || 0
		: table.getFilteredRowModel().rows.length;
	return (
		<div className="flex items-center justify-between px-2">
			{showRowSelection && (
				<div className="text-muted-foreground flex-1 text-sm">
					{table.getFilteredSelectedRowModel().rows.length} of {totalRows}{" "}
					row(s) selected.
				</div>
			)}
			{!showRowSelection && <div />}
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={`${currentPageSize}`}
						onValueChange={(value) => {
							handlePageSizeChange(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={currentPageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {currentPage + 1} of {totalPages}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handlePageChange(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handlePageChange(totalPages - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
