import { useState } from "react";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface FilterParams {
	search?: string;
	email?: string;
	isMale?: boolean;
	createdFrom?: string;
	createdTo?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	specialtyId?: string;
	locationId?: string;
	isAvailable?: boolean;
}

interface AdvancedFilterProps {
	filters: FilterParams;
	onFiltersChange: (filters: FilterParams) => void;
	showRole?: boolean;
	showSpecialty?: boolean;
	showAvailability?: boolean;
	className?: string;
}

export function AdvancedFilter({
	filters,
	onFiltersChange,
	showRole = false,
	showSpecialty = false,
	showAvailability = false,
	className,
}: Readonly<AdvancedFilterProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const [createdFromDate, setCreatedFromDate] = useState<Date>();
	const [createdToDate, setCreatedToDate] = useState<Date>();

	const handleFilterChange = (key: keyof FilterParams, value: any) => {
		onFiltersChange({
			...filters,
			[key]: value,
		});
	};

	const handleDateChange = (type: "from" | "to", date: Date | undefined) => {
		if (type === "from") {
			setCreatedFromDate(date);
			handleFilterChange("createdFrom", date?.toISOString());
		} else {
			setCreatedToDate(date);
			handleFilterChange("createdTo", date?.toISOString());
		}
	};

	const clearFilter = (key: keyof FilterParams) => {
		const newFilters = { ...filters };
		delete newFilters[key];
		onFiltersChange(newFilters);

		if (key === "createdFrom") setCreatedFromDate(undefined);
		if (key === "createdTo") setCreatedToDate(undefined);
	};

	const clearAllFilters = () => {
		onFiltersChange({});
		setCreatedFromDate(undefined);
		setCreatedToDate(undefined);
	};

	const activeFiltersCount = Object.keys(filters).filter(
		(key) => filters[key as keyof FilterParams] !== undefined
	).length;

	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex items-center gap-2">
				<Popover open={isOpen} onOpenChange={setIsOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" size="sm">
							<Filter className="mr-2 h-4 w-4" />
							Advanced Filters
							{activeFiltersCount > 0 && (
								<Badge variant="secondary" className="ml-2">
									{activeFiltersCount}
								</Badge>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-96 p-4" align="start">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h4 className="font-medium">Advanced Filters</h4>
								{activeFiltersCount > 0 && (
									<Button variant="ghost" size="sm" onClick={clearAllFilters}>
										Clear All
									</Button>
								)}
							</div>

							<Separator />

							<div className="space-y-2">
								<Label htmlFor="search">Search by Name</Label>
								<Input
									id="search"
									placeholder="Enter name..."
									value={filters.search || ""}
									onChange={(e) =>
										handleFilterChange("search", e.target.value || undefined)
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Search by Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter email..."
									value={filters.email || ""}
									onChange={(e) =>
										handleFilterChange("email", e.target.value || undefined)
									}
								/>
							</div>

							<div className="space-y-2">
								<Label>Gender</Label>
								<Select
									value={(() => {
										if (filters.isMale === undefined) return "all";
										return filters.isMale ? "male" : "female";
									})()}
									onValueChange={(value) => {
										let isMaleValue: boolean | undefined;
										if (value === "all") {
											isMaleValue = undefined;
										} else {
											isMaleValue = value === "male";
										}
										handleFilterChange("isMale", isMaleValue);
									}}
								>
									<SelectValue placeholder="Select gender" />
									<SelectContent>
										<SelectItem value="all">All Genders</SelectItem>
										<SelectItem value="male">Male</SelectItem>
										<SelectItem value="female">Female</SelectItem>
									</SelectContent>
								</Select>
							</div>

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

							{showAvailability && (
								<div className="space-y-2">
									<Label>Availability</Label>
									<Select
										value={(() => {
											if (filters.isAvailable === undefined) return "all";
											return filters.isAvailable ? "available" : "unavailable";
										})()}
										onValueChange={(value) => {
											let availabilityValue: boolean | undefined;
											if (value === "all") {
												availabilityValue = undefined;
											} else {
												availabilityValue = value === "available";
											}
											handleFilterChange("isAvailable", availabilityValue);
										}}
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

							<div className="space-y-2">
								<Label>Created Date Range</Label>
								<div className="flex gap-2">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!createdFromDate && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{createdFromDate ? (
													format(createdFromDate, "PPP")
												) : (
													<span>From date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={createdFromDate}
												onSelect={(date) => handleDateChange("from", date)}
												autoFocus
											/>
										</PopoverContent>
									</Popover>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal",
													!createdToDate && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{createdToDate ? (
													format(createdToDate, "PPP")
												) : (
													<span>To date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={createdToDate}
												onSelect={(date) => handleDateChange("to", date)}
												autoFocus
											/>
										</PopoverContent>
									</Popover>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Sort By</Label>
								<div className="flex gap-2">
									<Select
										value={filters.sortBy || "createdAt"}
										onValueChange={(value) =>
											handleFilterChange("sortBy", value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Sort field" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="createdAt">Created Date</SelectItem>
											<SelectItem value="fullName">Name</SelectItem>
											<SelectItem value="email">Email</SelectItem>
											{showSpecialty && (
												<SelectItem value="specialty">Specialty</SelectItem>
											)}
										</SelectContent>
									</Select>
									<Select
										value={filters.sortOrder || "desc"}
										onValueChange={(value) =>
											handleFilterChange("sortOrder", value as "asc" | "desc")
										}
									>
										<SelectTrigger className="w-32">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="asc">Ascending</SelectItem>
											<SelectItem value="desc">Descending</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				{activeFiltersCount > 0 && (
					<div className="flex flex-wrap items-center gap-1">
						{filters.search && (
							<Badge variant="secondary" className="gap-1">
								Name: {filters.search}
								<X
									className="h-3 w-3 cursor-pointer"
									onClick={() => clearFilter("search")}
								/>
							</Badge>
						)}
						{filters.email && (
							<Badge variant="secondary" className="gap-1">
								Email: {filters.email}
								<X
									className="h-3 w-3 cursor-pointer"
									onClick={() => clearFilter("email")}
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
						{filters.role && (
							<Badge variant="secondary" className="gap-1">
								Role: {filters.role}
								<X
									className="h-3 w-3 cursor-pointer"
									onClick={() => clearFilter("role")}
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
						{filters.createdFrom && (
							<Badge variant="secondary" className="gap-1">
								From: {format(new Date(filters.createdFrom), "MMM dd, yyyy")}
								<X
									className="h-3 w-3 cursor-pointer"
									onClick={() => clearFilter("createdFrom")}
								/>
							</Badge>
						)}
						{filters.createdTo && (
							<Badge variant="secondary" className="gap-1">
								To: {format(new Date(filters.createdTo), "MMM dd, yyyy")}
								<X
									className="h-3 w-3 cursor-pointer"
									onClick={() => clearFilter("createdTo")}
								/>
							</Badge>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
