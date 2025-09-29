import { useState, useEffect, useMemo, useRef } from "react";
import debounce from "debounce";
import { Search, Filter, X, Calendar, SortAsc, SortDesc } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export interface EnhancedFilterParams {
	search?: string;
	role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	isMale?: boolean;
	createdFrom?: string;
	createdTo?: string;
	sortBy?: "createdAt" | "fullName" | "email";
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
}

interface EnhancedFilterProps {
	filters: EnhancedFilterParams;
	onFiltersChange: (filters: EnhancedFilterParams) => void;
	showRole?: boolean;
	showGender?: boolean;
	showSort?: boolean;
	className?: string;
}

export function EnhancedFilter({
	filters,
	onFiltersChange,
	showRole = true,
	showGender = false,
	showSort = true,
	className = "",
}: Readonly<EnhancedFilterProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const [localSearchTerm, setLocalSearchTerm] = useState(filters.search || "");
	const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
		if (filters.createdFrom && filters.createdTo) {
			return {
				from: new Date(filters.createdFrom),
				to: new Date(filters.createdTo),
			};
		}
		if (filters.createdFrom) {
			return {
				from: new Date(filters.createdFrom),
				to: undefined,
			};
		}
		return undefined;
	});

	// Create debounced function for search
	const debouncedSearch = useMemo(
		() =>
			debounce((value: string) => {
				const newFilters = { ...filters };
				if (value.trim()) {
					newFilters.search = value;
				} else {
					delete newFilters.search;
				}
				onFiltersChange(newFilters);
			}, 300),
		[filters, onFiltersChange]
	);

	// Update local search term when filters.search changes externally
	useEffect(() => {
		setLocalSearchTerm(filters.search || "");
	}, [filters.search]);

	// Debounce search input changes
	useEffect(() => {
		debouncedSearch(localSearchTerm);
		return () => {
			debouncedSearch.clear();
		};
	}, [localSearchTerm, debouncedSearch]);

	// Update filters when date range changes
	const prevCreatedFromRef = useRef(filters.createdFrom);
	const prevCreatedToRef = useRef(filters.createdTo);

	useEffect(() => {
		const newCreatedFrom = dateRange?.from
			? format(dateRange.from, "yyyy-MM-dd")
			: undefined;
		const newCreatedTo = dateRange?.to
			? format(dateRange.to, "yyyy-MM-dd")
			: undefined;

		if (
			newCreatedFrom !== prevCreatedFromRef.current ||
			newCreatedTo !== prevCreatedToRef.current
		) {
			const newFilters = { ...filters };

			if (newCreatedFrom) {
				newFilters.createdFrom = newCreatedFrom;
			} else {
				delete newFilters.createdFrom;
			}

			if (newCreatedTo) {
				newFilters.createdTo = newCreatedTo;
			} else {
				delete newFilters.createdTo;
			}

			prevCreatedFromRef.current = newCreatedFrom;
			prevCreatedToRef.current = newCreatedTo;
			onFiltersChange(newFilters);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dateRange, onFiltersChange]);

	const handleFilterChange = (key: keyof EnhancedFilterParams, value: any) => {
		onFiltersChange({
			...filters,
			[key]: value,
		});
	};

	const clearFilter = (key: keyof EnhancedFilterParams) => {
		const newFilters = { ...filters };
		delete newFilters[key];

		// Clear related date fields
		if (key === "createdFrom" || key === "createdTo") {
			delete newFilters.createdFrom;
			delete newFilters.createdTo;
			setDateRange(undefined);
		}

		onFiltersChange(newFilters);
	};

	const clearAllFilters = () => {
		setLocalSearchTerm("");
		setDateRange(undefined);
		onFiltersChange({
			sortBy: "createdAt",
			sortOrder: "desc",
		});
	};

	const activeFiltersCount = Object.keys(filters).filter((key) => {
		if (key === "sortBy" || key === "sortOrder") return false; // Don't count default sorting
		return filters[key as keyof EnhancedFilterParams] !== undefined;
	}).length;

	const handleRoleChange = (value: string) => {
		const roleValue =
			value === "all"
				? undefined
				: (value as "SUPER_ADMIN" | "ADMIN" | "DOCTOR");
		handleFilterChange("role", roleValue);
	};

	const handleGenderChange = (value: string) => {
		let genderValue: boolean | undefined;
		if (value === "all") {
			genderValue = undefined;
		} else {
			genderValue = value === "male";
		}
		handleFilterChange("isMale", genderValue);
	};

	const handleSortByChange = (value: string) => {
		handleFilterChange("sortBy", value as "createdAt" | "fullName" | "email");
	};

	const handleSortOrderChange = (value: string) => {
		handleFilterChange("sortOrder", value as "asc" | "desc");
	};

	const getRoleSelectValue = () => {
		return filters.role || "all";
	};

	const getGenderSelectValue = () => {
		if (filters.isMale === undefined) {
			return "all";
		}
		return filters.isMale ? "male" : "female";
	};

	return (
		<div className={`flex items-center gap-4 ${className}`}>
			<div className="relative flex-1">
				<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
				<Input
					placeholder="Search by name or email..."
					value={localSearchTerm}
					onChange={(e) => setLocalSearchTerm(e.target.value)}
					className="border-border focus:border-primary focus:ring-primary/20 border-2 pl-10 focus:ring-2"
				/>
			</div>

			{showSort && (
				<div className="flex items-center gap-2">
					<Select
						value={filters.sortBy || "createdAt"}
						onValueChange={handleSortByChange}
					>
						<SelectTrigger className="w-[140px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="createdAt">Created Date</SelectItem>
							<SelectItem value="fullName">Name</SelectItem>
							<SelectItem value="email">Email</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							handleSortOrderChange(
								filters.sortOrder === "asc" ? "desc" : "asc"
							)
						}
						className="px-3"
					>
						{filters.sortOrder === "asc" ? (
							<SortAsc className="h-4 w-4" />
						) : (
							<SortDesc className="h-4 w-4" />
						)}
					</Button>
				</div>
			)}

			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm">
						<Filter className="mr-2 h-4 w-4" />
						Filters
						{activeFiltersCount > 0 && (
							<Badge variant="secondary" className="ml-2">
								{activeFiltersCount}
							</Badge>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-96 p-4" align="end">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h4 className="font-medium">Filters</h4>
							{activeFiltersCount > 0 && (
								<Button variant="ghost" size="sm" onClick={clearAllFilters}>
									Clear All
								</Button>
							)}
						</div>

						<Separator />

						<div className="space-y-2">
							<Label>Created Date Range</Label>
							<DateRangePicker
								date={dateRange}
								onDateChange={setDateRange}
								placeholder="Select date range"
							/>
						</div>

						{showRole && (
							<div className="space-y-2">
								<Label>Role</Label>
								<Select
									value={getRoleSelectValue()}
									onValueChange={handleRoleChange}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Roles</SelectItem>
										<SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
										<SelectItem value="ADMIN">Admin</SelectItem>
										<SelectItem value="DOCTOR">Doctor</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}

						{showGender && (
							<div className="space-y-2">
								<Label>Gender</Label>
								<Select
									value={getGenderSelectValue()}
									onValueChange={handleGenderChange}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select gender" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Genders</SelectItem>
										<SelectItem value="male">Male</SelectItem>
										<SelectItem value="female">Female</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>

			{activeFiltersCount > 0 && (
				<div className="flex flex-wrap items-center gap-1">
					{filters.search && (
						<Badge variant="secondary" className="gap-1">
							Search: {filters.search}
							<X
								className="h-3 w-3 cursor-pointer"
								onClick={() => clearFilter("search")}
							/>
						</Badge>
					)}
					{(filters.createdFrom || filters.createdTo) && (
						<Badge variant="secondary" className="gap-1">
							<Calendar className="h-3 w-3" />
							{(() => {
								if (filters.createdFrom && filters.createdTo) {
									return `${format(new Date(filters.createdFrom), "MMM dd")} - ${format(new Date(filters.createdTo), "MMM dd")}`;
								} else if (filters.createdFrom) {
									return `From ${format(new Date(filters.createdFrom), "MMM dd, yyyy")}`;
								} else {
									return `To ${format(new Date(filters.createdTo!), "MMM dd, yyyy")}`;
								}
							})()}
							<X
								className="h-3 w-3 cursor-pointer"
								onClick={() => clearFilter("createdFrom")}
							/>
						</Badge>
					)}
					{filters.role && (
						<Badge variant="secondary" className="gap-1">
							Role: {filters.role.replace("_", " ")}
							<X
								className="h-3 w-3 cursor-pointer"
								onClick={() => clearFilter("role")}
							/>
						</Badge>
					)}
					{filters.isMale !== undefined && (
						<Badge variant="secondary" className="gap-1">
							Gender: {filters.isMale ? "Male" : "Female"}
							<X
								className="h-3 w-3 cursor-pointer"
								onClick={() => clearFilter("isMale")}
							/>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
}
