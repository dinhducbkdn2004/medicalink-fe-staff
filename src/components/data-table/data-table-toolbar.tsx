"use client";

import { useEffect, useRef } from "react";
import { Table } from "@tanstack/react-table";
import { Plus, Search, X } from "lucide-react";
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
import { DateRangePicker } from "@/components/ui/date-range-picker";

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

	const isFiltered =
		(table?.getState().columnFilters.length ?? 0) > 0 ||
		dateRange ||
		(roleFilter && roleFilter !== "all");

	const clearFilters = () => {
		table?.resetColumnFilters();
		if (onSearchChange) onSearchChange("");
		if (onDateRangeChange) onDateRangeChange(undefined);
		if (onRoleFilterChange) onRoleFilterChange("all");
		if (searchInputRef.current) {
			searchInputRef.current.value = "";
		}
	};

	return (
		<div className="flex flex-wrap items-center justify-between gap-4">
			<div className="flex flex-1 flex-wrap items-center gap-2">
				{/* Search Input */}
				<div className="relative">
					<Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
					<Input
						ref={searchInputRef}
						placeholder={searchPlaceholder}
						defaultValue={searchValue ?? ""}
						onChange={(event) => handleSearchChange(event.target.value)}
						className="h-8 w-[250px] pl-8"
					/>
				</div>

				{/* Date Range Picker */}
				{onDateRangeChange && (
					<DateRangePicker
						{...(dateRange ? { date: dateRange } : {})}
						onDateChange={onDateRangeChange}
						placeholder="Filter by creation date"
						className="w-auto"
					/>
				)}

				{/* Role Filter */}
				{onRoleFilterChange && (
					<Select
						value={roleFilter ?? "all"}
						onValueChange={onRoleFilterChange}
					>
						<SelectTrigger className="h-8 w-[140px]">
							<SelectValue placeholder="Role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Roles</SelectItem>
							<SelectItem value="ADMIN">Admin</SelectItem>
							<SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
						</SelectContent>
					</Select>
				)}

				{isFiltered && (
					<Button
						variant="ghost"
						onClick={clearFilters}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<X className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>

			<div className="flex items-center gap-2">
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
