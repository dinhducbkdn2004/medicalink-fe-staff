"use client";

import { useEffect, useRef } from "react";
import { Table } from "@tanstack/react-table";
import { Plus, Search, Settings2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import debounce from "debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	DateRangePicker,
	type SortDirection,
} from "@/components/ui/date-range-picker";

interface DataTableToolbarProps<TData> {
	readonly table?: Table<TData>;
	readonly searchKey?: string;
	readonly searchPlaceholder?: string;
	readonly searchValue?: string;
	readonly onSearchChange?: (value: string) => void;
	readonly onCreateNew?: () => void;
	readonly createButtonText?: string;
	readonly dateRange?: DateRange;
	readonly onDateRangeChange?: (range: DateRange | undefined) => void;
	readonly dateSortDirection?: SortDirection;
	readonly onDateSortChange?: (direction: SortDirection) => void;
	readonly roleFilter?: string;
	readonly onRoleFilterChange?: (value: string) => void;
}

export function DataTableToolbar<TData>({
	table,
	searchKey,
	searchPlaceholder = "Search...",
	searchValue,
	onSearchChange,
	onCreateNew,
	createButtonText = "Add New",
	dateRange,
	onDateRangeChange,
	dateSortDirection,
	onDateSortChange,
	roleFilter,
	onRoleFilterChange,
}: DataTableToolbarProps<TData>) {
	const searchInputRef = useRef<HTMLInputElement>(null);

	const debouncedSearch = useRef(
		debounce((value: string) => {
			if (onSearchChange) {
				onSearchChange(value);
			}
			if (searchKey && table) {
				table.getColumn(searchKey)?.setFilterValue(value);
			}
		}, 500)
	).current;

	useEffect(() => {
		return () => {
			debouncedSearch.clear?.();
		};
	}, [debouncedSearch]);

	const handleSearchChange = (value: string) => {
		debouncedSearch(value);
	};

	return (
		<div className="flex flex-wrap items-center justify-between gap-4">
			<div className="flex flex-1 flex-wrap items-center gap-2">
				<div className="relative flex items-center">
					<Search className="text-muted-foreground pointer-events-none absolute left-2 h-4 w-4" />
					<Input
						ref={searchInputRef}
						placeholder={searchPlaceholder}
						defaultValue={searchValue ?? ""}
						onChange={(event) => handleSearchChange(event.target.value)}
						className="h-8 w-[280px] pl-8"
					/>
				</div>

				{/* Date Range Picker */}
				{onDateRangeChange && (
					<DateRangePicker
						{...(dateRange ? { date: dateRange } : {})}
						onDateChange={onDateRangeChange}
						{...(dateSortDirection !== undefined
							? { sortDirection: dateSortDirection }
							: {})}
						{...(onDateSortChange ? { onSortChange: onDateSortChange } : {})}
						showSort={false}
						placeholder="Filter by date"
						className="w-auto"
					/>
				)}

				{/* Role Filter */}
				{onRoleFilterChange && (
					<Select
						value={roleFilter ?? "all"}
						onValueChange={onRoleFilterChange}
					>
						<SelectTrigger className="h-8 w-[100px]">
							<SelectValue placeholder="Role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Roles</SelectItem>
							<SelectItem value="ADMIN">Admin</SelectItem>
							<SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
						</SelectContent>
					</Select>
				)}
			</div>

			<div className="flex items-center gap-2">
				{/* Column Visibility Toggle */}
				{table && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="ml-auto hidden h-8 lg:flex"
							>
								<Settings2 className="mr-2 h-4 w-4" />
								View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[150px]">
							<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									const isVisible = column.getIsVisible();
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={isVisible}
											onCheckedChange={(checked) => {
												// Use only toggleVisibility
												column.toggleVisibility(checked);
											}}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				)}

				{/* Create New Button */}
				{onCreateNew && (
					<Button onClick={onCreateNew} size="sm" className="h-8">
						<Plus className="mr-2 h-4 w-4" />
						{createButtonText}
					</Button>
				)}
			</div>
		</div>
	);
}
