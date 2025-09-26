import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
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

export interface SimpleFilterParams {
	search?: string;
	role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	isMale?: boolean;
	isAvailable?: boolean;
}

interface SimpleFilterProps {
	filters: SimpleFilterParams;
	onFiltersChange: (filters: SimpleFilterParams) => void;
	showRole?: boolean;
	showGender?: boolean;
	showAvailability?: boolean;
	className?: string;
}

export function SimpleFilter({
	filters,
	onFiltersChange,
	showRole = false,
	showGender = false,
	showAvailability = false,
	className = "",
}: SimpleFilterProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleFilterChange = (key: keyof SimpleFilterParams, value: any) => {
		onFiltersChange({
			...filters,
			[key]: value,
		});
	};

	const clearFilter = (key: keyof SimpleFilterParams) => {
		const newFilters = { ...filters };
		delete newFilters[key];
		onFiltersChange(newFilters);
	};

	const clearAllFilters = () => {
		onFiltersChange({});
	};

	const activeFiltersCount = Object.keys(filters).filter(
		(key) => filters[key as keyof SimpleFilterParams] !== undefined
	).length;

	return (
		<div className={`flex items-center gap-4 ${className}`}>
			{/* Search Input */}
			<div className="relative flex-1">
				<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
				<Input
					placeholder="Search by name..."
					value={filters.search || ""}
					onChange={(e) =>
						handleFilterChange("search", e.target.value || undefined)
					}
					className="border-border focus:border-primary focus:ring-primary/20 border-2 pl-10 focus:ring-2"
				/>
			</div>

			{/* Filter Popover */}
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
				<PopoverContent className="w-80 p-4" align="end">
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

						{/* Role Filter */}
						{showRole && (
							<div className="space-y-2">
								<Label>Role</Label>
								<Select
									value={filters.role || "all"}
									onValueChange={(value) =>
										handleFilterChange(
											"role",
											value === "all" ? undefined : value
										)
									}
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

						{/* Gender Filter */}
						{showGender && (
							<div className="space-y-2">
								<Label>Gender</Label>
								<Select
									value={
										filters.isMale === undefined
											? "all"
											: filters.isMale
												? "male"
												: "female"
									}
									onValueChange={(value) =>
										handleFilterChange(
											"isMale",
											value === "all"
												? undefined
												: value === "male"
													? true
													: false
										)
									}
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

						{/* Availability Filter */}
						{showAvailability && (
							<div className="space-y-2">
								<Label>Availability</Label>
								<Select
									value={
										filters.isAvailable === undefined
											? "all"
											: filters.isAvailable
												? "available"
												: "unavailable"
									}
									onValueChange={(value) =>
										handleFilterChange(
											"isAvailable",
											value === "all"
												? undefined
												: value === "available"
													? true
													: false
										)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select availability" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										<SelectItem value="available">Available</SelectItem>
										<SelectItem value="unavailable">Not Available</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>

			{/* Active Filters Display */}
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
					{filters.role && (
						<Badge variant="secondary" className="gap-1">
							Role: {filters.role}
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
					{filters.isAvailable !== undefined && (
						<Badge variant="secondary" className="gap-1">
							{filters.isAvailable ? "Available" : "Not Available"}
							<X
								className="h-3 w-3 cursor-pointer"
								onClick={() => clearFilter("isAvailable")}
							/>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
}
