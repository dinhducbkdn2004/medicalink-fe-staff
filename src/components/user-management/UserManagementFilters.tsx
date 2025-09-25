import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import type { StaffRole } from "@/types";

interface UserManagementFiltersProps {
	searchTerm: string;
	onSearchChange: (term: string) => void;
	roleFilter: StaffRole | "all";
	onRoleFilterChange: (role: StaffRole | "all") => void;
}

export const UserManagementFilters = ({
	searchTerm,
	onSearchChange,
	roleFilter,
	onRoleFilterChange,
}: UserManagementFiltersProps) => {
	const handleClearFilters = () => {
		onSearchChange("");
		onRoleFilterChange("all");
	};

	const hasActiveFilters = searchTerm || roleFilter !== "all";

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
					{/* Search */}
					<div className="relative flex-1">
						<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
						<Input
							placeholder="Search by name or email..."
							value={searchTerm}
							onChange={(e) => onSearchChange(e.target.value)}
							className="pl-9"
						/>
					</div>

					{/* Role Filter */}
					<Select
						value={roleFilter}
						onValueChange={(value) =>
							onRoleFilterChange(value as StaffRole | "all")
						}
					>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Filter by role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Roles</SelectItem>
							<SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
							<SelectItem value="ADMIN">Admin</SelectItem>
							<SelectItem value="DOCTOR">Doctor</SelectItem>
						</SelectContent>
					</Select>

					{/* Clear Filters */}
					{hasActiveFilters && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleClearFilters}
							className="whitespace-nowrap"
						>
							<X className="mr-2 h-4 w-4" />
							Clear
						</Button>
					)}
				</div>

				{/* Active Filters Display */}
				{hasActiveFilters && (
					<div className="mt-3 flex flex-wrap gap-2">
						{searchTerm && (
							<div className="flex items-center space-x-1 rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-200">
								<span>Search: "{searchTerm}"</span>
								<button
									onClick={() => onSearchChange("")}
									className="ml-1 rounded p-0.5 hover:bg-blue-200"
								>
									<X className="h-3 w-3" />
								</button>
							</div>
						)}
						{roleFilter !== "all" && (
							<div className="flex items-center space-x-1 rounded-md bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-900 dark:text-green-200">
								<span>Role: {roleFilter.replace("_", " ")}</span>
								<button
									onClick={() => onRoleFilterChange("all")}
									className="ml-1 rounded p-0.5 hover:bg-green-200"
								>
									<X className="h-3 w-3" />
								</button>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
