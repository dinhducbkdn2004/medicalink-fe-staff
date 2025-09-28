import { useState, useEffect, useMemo } from "react";
import debounce from "debounce";
import {
	Plus,
	Search,
	MoreHorizontal,
	Pencil,
	Trash2,
	MapPin,
	Building2,
	Eye,
	ToggleLeft,
	ToggleRight,
	Phone,
	Clock,
	X,
	Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { usePagination } from "@/hooks/usePagination";
import {
	useWorkLocations,
	useDeleteWorkLocation,
} from "@/hooks/api/useLocations";
import { WorkLocationModal } from "@/components/modals/WorkLocationModal";
import { WorkLocationViewModal } from "@/components/modals/WorkLocationViewModal";

export function WorkLocationsPage() {
	const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
	const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [locationToDelete, setLocationToDelete] = useState<any | null>(null);

	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	// Create debounced function for search
	const debouncedSetSearch = useMemo(
		() =>
			debounce((value: string) => {
				setDebouncedSearchTerm(value);
				setIsSearching(false);
			}, 300),
		[]
	);

	// Update debounced search when searchTerm changes
	useEffect(() => {
		if (searchTerm !== debouncedSearchTerm) {
			setIsSearching(true);
		}
		debouncedSetSearch(searchTerm);
		return () => {
			debouncedSetSearch.clear();
		};
	}, [searchTerm, debouncedSearchTerm, debouncedSetSearch]);

	const clearSearch = () => {
		setSearchTerm("");
	};

	const itemsPerPage = 10;
	const { currentPage, setPage } = usePagination({
		totalItems: 0,
		itemsPerPage,
		initialPage: 1,
	});

	const {
		data: locationsData,
		isLoading,
		error,
	} = useWorkLocations({
		page: currentPage,
		limit: itemsPerPage,
		search: debouncedSearchTerm || "",
	});

	const deleteLocationMutation = useDeleteWorkLocation();

	const locations = locationsData?.data || [];
	const meta = locationsData?.meta;

	const handleCreateLocation = () => {
		setSelectedLocation(null);
		setIsModalOpen(true);
	};

	const handleEditLocation = (location: any) => {
		setSelectedLocation(location);
		setIsModalOpen(true);
	};

	const handleViewLocation = (location: any) => {
		setSelectedLocation(location);
		setIsViewModalOpen(true);
	};

	const handleDeleteLocation = (location: any) => {
		setLocationToDelete(location);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!locationToDelete) return;

		try {
			await deleteLocationMutation.mutateAsync(locationToDelete.id);
			toast.success("Work location deleted successfully");
			setDeleteDialogOpen(false);
			setLocationToDelete(null);
		} catch (error: any) {
			toast.error(error.message || "Failed to delete work location");
		}
	};

	const handleToggleStatus = (location: any) => {
		// TODO: Implement toggle status functionality when backend API is ready
		toast.success(
			`Location ${!location.isActive ? "activated" : "deactivated"} successfully`
		);
	};

	const handleFilterChange = (filter: "all" | "active" | "inactive") => {
		setIsActive(filter === "all" ? undefined : filter === "active");
		setPage(1);
	};

	const activeLocations = locations.filter((l: any) => l.isActive !== false);
	const uniqueCities = new Set(
		locations.map((l: any) => l.address?.city || l.city).filter(Boolean)
	);

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Work Locations</h1>
					<p className="text-muted-foreground">
						Manage hospital work locations and branches
					</p>
				</div>
				<Button onClick={handleCreateLocation} className="gap-2">
					<Plus className="h-4 w-4" />
					Add Location
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Locations
						</CardTitle>
						<Building2 className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold">
								{meta?.total || locations.length}
							</div>
						)}
						<p className="text-muted-foreground text-xs">All work locations</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Locations
						</CardTitle>
						<div className="h-4 w-4 rounded-full bg-green-500" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold text-green-600">
								{activeLocations.length}
							</div>
						)}
						<p className="text-muted-foreground text-xs">Currently available</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Cities</CardTitle>
						<MapPin className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold text-blue-600">
								{uniqueCities.size}
							</div>
						)}
						<p className="text-muted-foreground text-xs">Different cities</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Timezones</CardTitle>
						<Clock className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold text-purple-600">
								{new Set(locations.map((l: any) => l.timezone).filter(Boolean))
									.size || 1}
							</div>
						)}
						<p className="text-muted-foreground text-xs">Different timezones</p>
					</CardContent>
				</Card>
			</div>

			{/* Locations Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Building2 className="h-5 w-5" />
						Location Management
					</CardTitle>
					<div className="flex items-center gap-4">
						<div className="relative max-w-sm flex-1">
							<Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
							<Input
								placeholder="Search locations..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pr-10 pl-10"
							/>
							{isSearching && (
								<Loader2 className="text-muted-foreground absolute top-3 right-3 h-4 w-4 animate-spin" />
							)}
							{searchTerm && !isSearching && (
								<Button
									variant="ghost"
									size="sm"
									className="absolute top-1 right-1 h-8 w-8 p-0"
									onClick={clearSearch}
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
						<div className="flex gap-2">
							<Button
								variant={isActive === undefined ? "default" : "outline"}
								size="sm"
								onClick={() => handleFilterChange("all")}
							>
								All
							</Button>
							<Button
								variant={isActive === true ? "default" : "outline"}
								size="sm"
								onClick={() => handleFilterChange("active")}
							>
								Active
							</Button>
							<Button
								variant={isActive === false ? "default" : "outline"}
								size="sm"
								onClick={() => handleFilterChange("inactive")}
							>
								Inactive
							</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={`skeleton-${i}`} className="h-16 w-full" />
							))}
						</div>
					) : error ? (
						<div className="py-8 text-center">
							<p className="text-muted-foreground">Failed to load locations</p>
						</div>
					) : locations.length === 0 ? (
						<div className="py-8 text-center">
							<Building2 className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
							<p className="text-muted-foreground">No locations found</p>
						</div>
					) : (
						<div className="overflow-hidden rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Location</TableHead>
										<TableHead>Address</TableHead>
										<TableHead>Contact</TableHead>
										<TableHead>Timezone</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="w-[70px]">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{locations.map((location: any) => (
										<TableRow key={location.id}>
											<TableCell className="font-medium">
												<div className="flex items-center gap-3">
													<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
														<Building2 className="text-primary h-4 w-4" />
													</div>
													<div>
														<div className="font-medium">{location.name}</div>
														{location.city && (
															<div className="text-muted-foreground text-sm">
																{location.city}
															</div>
														)}
													</div>
												</div>
											</TableCell>
											<TableCell className="max-w-xs">
												<div className="text-sm">
													<div>{location.address || "No address"}</div>
												</div>
											</TableCell>
											<TableCell>
												{location.phone && (
													<div className="flex items-center gap-2 text-sm">
														<Phone className="h-3 w-3" />
														{location.phone}
													</div>
												)}
											</TableCell>
											<TableCell className="text-sm">
												<div className="flex items-center gap-2">
													<Clock className="h-3 w-3" />
													{location.timezone || "Asia/Ho_Chi_Minh"}
												</div>
											</TableCell>
											<TableCell>
												<Badge
													variant={location.isActive ? "default" : "secondary"}
													className={
														location.isActive
															? "border-green-200 bg-green-100 text-green-800"
															: "border-gray-200 bg-gray-100 text-gray-600"
													}
												>
													{location.isActive ? "Active" : "Inactive"}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{location.createdAt
													? new Date(location.createdAt).toLocaleDateString()
													: "N/A"}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-8 w-8 p-0"
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => handleViewLocation(location)}
														>
															<Eye className="mr-2 h-4 w-4" />
															View Details
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleEditLocation(location)}
														>
															<Pencil className="mr-2 h-4 w-4" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleToggleStatus(location)}
														>
															{location.isActive ? (
																<ToggleLeft className="mr-2 h-4 w-4" />
															) : (
																<ToggleRight className="mr-2 h-4 w-4" />
															)}
															{location.isActive ? "Deactivate" : "Activate"}
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															className="text-red-600"
															onClick={() => handleDeleteLocation(location)}
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}

					{/* Pagination */}
					{meta && (
						<div className="flex items-center justify-between pt-4">
							<p className="text-muted-foreground text-sm">
								Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
								{Math.min(currentPage * itemsPerPage, meta.total)} of{" "}
								{meta.total} locations
							</p>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage(currentPage - 1)}
									disabled={!meta.hasPrev}
								>
									Previous
								</Button>
								<span className="text-sm">
									Page {currentPage} of {meta.totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage(currentPage + 1)}
									disabled={!meta.hasNext}
								>
									Next
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Work Location Modal */}
			<WorkLocationModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				location={selectedLocation}
			/>

			{/* Work Location View Modal */}
			<WorkLocationViewModal
				open={isViewModalOpen}
				onClose={() => setIsViewModalOpen(false)}
				location={selectedLocation}
				onEdit={() => {
					setIsViewModalOpen(false);
					setIsModalOpen(true);
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							work location "{locationToDelete?.name}" and remove all associated
							data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => void confirmDelete()}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
