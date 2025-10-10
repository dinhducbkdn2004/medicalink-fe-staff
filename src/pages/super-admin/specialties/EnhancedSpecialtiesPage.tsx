import { useState, useEffect, useMemo } from "react";
import debounce from "debounce";
import {
	Search,
	Plus,
	MoreHorizontal,
	Eye,
	Edit,
	Trash2,
	Stethoscope,
	Users,
	ToggleLeft,
	ToggleRight,
	X,
	Loader2,
	Grid3X3,
	List,
	ArrowUpDown,
	CheckCircle,
	AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuLabel,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { usePagination } from "@/hooks/usePagination";
import {
	useSpecialties,
	useDeleteSpecialty,
	useToggleSpecialtyStatus,
} from "@/hooks/api/useSpecialties";
import { SpecialtyModal } from "@/components/modals/SpecialtyModal";
import { EnhancedSpecialtyViewModal } from "@/components/modals/EnhancedSpecialtyViewModal";

type ViewMode = "grid" | "list";
type SortBy = "name" | "createdAt" | "updatedAt";
type SortOrder = "asc" | "desc";
type FilterStatus = "all" | "active" | "inactive";

export function EnhancedSpecialtiesPage() {
	// State management
	const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [specialtyToDelete, setSpecialtyToDelete] = useState<any>(null);

	// View and filter states
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [sortBy, setSortBy] = useState<SortBy>("name");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

	// Search states
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	// Pagination
	const itemsPerPage = viewMode === "grid" ? 12 : 10;
	const { currentPage, setPage } = usePagination({
		totalItems: 0,
		itemsPerPage,
		initialPage: 1,
	});

	// Debounced search
	const debouncedSetSearch = useMemo(
		() =>
			debounce((value: string) => {
				setDebouncedSearchTerm(value);
				setIsSearching(false);
			}, 300),
		[]
	);

	useEffect(() => {
		if (searchTerm !== debouncedSearchTerm) {
			setIsSearching(true);
		}
		debouncedSetSearch(searchTerm);
		return () => {
			debouncedSetSearch.clear();
		};
	}, [searchTerm, debouncedSearchTerm, debouncedSetSearch]);

	// API calls
	const {
		data: specialtiesData,
		isLoading,
		error,
	} = useSpecialties({
		page: currentPage,
		limit: itemsPerPage,
		search: debouncedSearchTerm || "",
		sortBy,
		sortOrder: sortOrder.toUpperCase() as "ASC" | "DESC",
		...(filterStatus !== "all" && { isActive: filterStatus === "active" }),
	});

	const deleteSpecialtyMutation = useDeleteSpecialty();
	const toggleStatusMutation = useToggleSpecialtyStatus();

	const specialties = specialtiesData?.data || [];
	const meta = specialtiesData?.meta;

	// Handlers
	const handleCreateSpecialty = () => {
		setSelectedSpecialty(null);
		setIsModalOpen(true);
	};

	const handleEditSpecialty = (specialty: any) => {
		setSelectedSpecialty(specialty);
		setIsModalOpen(true);
	};

	const handleViewSpecialty = (specialty: any) => {
		setSelectedSpecialty(specialty);
		setIsViewModalOpen(true);
	};

	const handleDeleteSpecialty = (specialty: any) => {
		setSpecialtyToDelete(specialty);
		setDeleteDialogOpen(true);
	};

	const handleToggleStatus = async (specialty: any) => {
		try {
			await toggleStatusMutation.mutateAsync(specialty.id);
			toast.success(
				`Specialty ${specialty.isActive ? "deactivated" : "activated"} successfully`
			);
		} catch (error: any) {
			toast.error(error.message || "Failed to toggle specialty status");
		}
	};

	const confirmDelete = async () => {
		if (!specialtyToDelete) return;

		try {
			await deleteSpecialtyMutation.mutateAsync(specialtyToDelete.id);
			toast.success("Specialty deleted successfully");
			setDeleteDialogOpen(false);
			setSpecialtyToDelete(null);
		} catch (error: any) {
			toast.error(error.message || "Failed to delete specialty");
		}
	};

	const clearSearch = () => {
		setSearchTerm("");
	};

	const clearFilters = () => {
		setSearchTerm("");
		setFilterStatus("all");
		setSortBy("name");
		setSortOrder("asc");
	};

	// Loading skeleton
	const renderSkeleton = () => {
		if (viewMode === "grid") {
			return (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<Card key={i}>
							<CardHeader className="pb-3">
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-3 w-1/2" />
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<Skeleton className="h-3 w-full" />
									<Skeleton className="h-3 w-2/3" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			);
		}

		return (
			<Card>
				<CardContent className="p-0">
					<div className="space-y-4 p-6">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex items-center space-x-4">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-[200px]" />
									<Skeleton className="h-4 w-[150px]" />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	};

	// Grid view component
	const renderGridView = () => (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{specialties.map((specialty) => (
				<Card
					key={specialty.id}
					className="group transition-shadow hover:shadow-md"
				>
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-2">
								<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
									<Stethoscope className="text-primary h-5 w-5" />
								</div>
								<div>
									<CardTitle className="text-base leading-tight">
										{specialty.name}
									</CardTitle>
									<div className="mt-1 flex items-center gap-2">
										<Badge
											variant={specialty.isActive ? "default" : "secondary"}
											className="text-xs"
										>
											{specialty.isActive ? (
												<>
													<CheckCircle className="mr-1 h-3 w-3" />
													Active
												</>
											) : (
												<>
													<AlertTriangle className="mr-1 h-3 w-3" />
													Inactive
												</>
											)}
										</Badge>
									</div>
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
									>
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => handleViewSpecialty(specialty)}
									>
										<Eye className="mr-2 h-4 w-4" />
										View Details
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleEditSpecialty(specialty)}
									>
										<Edit className="mr-2 h-4 w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => handleToggleStatus(specialty)}
									>
										{specialty.isActive ? (
											<>
												<ToggleLeft className="mr-2 h-4 w-4" />
												Deactivate
											</>
										) : (
											<>
												<ToggleRight className="mr-2 h-4 w-4" />
												Activate
											</>
										)}
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => handleDeleteSpecialty(specialty)}
										className="text-destructive"
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground line-clamp-2 text-sm">
							{specialty.description || "No description available"}
						</p>
						<div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
							<div className="flex items-center gap-1">
								<Users className="h-3 w-3" />
								<span>{specialty.infoSections?.length || 0} sections</span>
							</div>
							<span>{new Date(specialty.createdAt).toLocaleDateString()}</span>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);

	// List view component
	const renderListView = () => (
		<Card>
			<CardContent className="p-0">
				<div className="divide-y">
					{specialties.map((specialty) => (
						<div
							key={specialty.id}
							className="hover:bg-muted/50 flex items-center justify-between p-6 transition-colors"
						>
							<div className="flex items-center gap-4">
								<div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
									<Stethoscope className="text-primary h-6 w-6" />
								</div>
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<h3 className="font-medium">{specialty.name}</h3>
										<Badge
											variant={specialty.isActive ? "default" : "secondary"}
											className="text-xs"
										>
											{specialty.isActive ? (
												<>
													<CheckCircle className="mr-1 h-3 w-3" />
													Active
												</>
											) : (
												<>
													<AlertTriangle className="mr-1 h-3 w-3" />
													Inactive
												</>
											)}
										</Badge>
									</div>
									<p className="text-muted-foreground max-w-md truncate text-sm">
										{specialty.description || "No description available"}
									</p>
									<div className="text-muted-foreground flex items-center gap-4 text-xs">
										<div className="flex items-center gap-1">
											<Users className="h-3 w-3" />
											<span>
												{specialty.infoSections?.length || 0} sections
											</span>
										</div>
										<span>
											Created{" "}
											{new Date(specialty.createdAt).toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => handleViewSpecialty(specialty)}
									>
										<Eye className="mr-2 h-4 w-4" />
										View Details
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleEditSpecialty(specialty)}
									>
										<Edit className="mr-2 h-4 w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => handleToggleStatus(specialty)}
									>
										{specialty.isActive ? (
											<>
												<ToggleLeft className="mr-2 h-4 w-4" />
												Deactivate
											</>
										) : (
											<>
												<ToggleRight className="mr-2 h-4 w-4" />
												Activate
											</>
										)}
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => handleDeleteSpecialty(specialty)}
										className="text-destructive"
									>
										<Trash2 className="mr-2 h-4 w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Filters and Controls */}
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						{/* Search */}
						<div className="relative max-w-md flex-1">
							<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
							<Input
								placeholder="Search specialties..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pr-10 pl-10"
							/>
							{searchTerm && (
								<Button
									variant="ghost"
									size="sm"
									onClick={clearSearch}
									className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 p-0"
								>
									<X className="h-3 w-3" />
								</Button>
							)}
							{isSearching && (
								<Loader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
							)}
						</div>
						<div>
							{/* Clear Filters */}
							{(searchTerm ||
								filterStatus !== "all" ||
								sortBy !== "name" ||
								sortOrder !== "asc") && (
								<Button variant="outline" size="sm" onClick={clearFilters}>
									Clear
								</Button>
							)}
						</div>

						{/* Controls */}
						<div className="flex items-center gap-2">
							{/* Status Filter */}
							<Select
								value={filterStatus}
								onValueChange={(value: FilterStatus) => setFilterStatus(value)}
							>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
								</SelectContent>
							</Select>

							{/* Sort */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="gap-2">
										<ArrowUpDown className="h-4 w-4" />
										Sort
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Sort by</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => {
											setSortBy("name");
											setSortOrder("asc");
										}}
									>
										Name (A-Z)
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setSortBy("name");
											setSortOrder("desc");
										}}
									>
										Name (Z-A)
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setSortBy("createdAt");
											setSortOrder("desc");
										}}
									>
										Newest First
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setSortBy("createdAt");
											setSortOrder("asc");
										}}
									>
										Oldest First
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							{/* View Mode */}
							<div className="flex items-center rounded-lg border">
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className="rounded-r-none"
								>
									<Grid3X3 className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("list")}
									className="rounded-l-none"
								>
									<List className="h-4 w-4" />
								</Button>
							</div>

							<Button onClick={handleCreateSpecialty} className="gap-2">
								<Plus className="h-4 w-4" />
								Add Specialty
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Content */}
			{isLoading ? (
				renderSkeleton()
			) : error ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<AlertTriangle className="text-muted-foreground mb-4 h-12 w-12" />
						<h3 className="mb-2 text-lg font-medium">
							Failed to load specialties
						</h3>
						<p className="text-muted-foreground text-center">
							There was an error loading the specialties. Please try again.
						</p>
					</CardContent>
				</Card>
			) : specialties.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Stethoscope className="text-muted-foreground mb-4 h-12 w-12" />
						<h3 className="mb-2 text-lg font-medium">No specialties found</h3>
						<p className="text-muted-foreground mb-4 text-center">
							{searchTerm || filterStatus !== "all"
								? "No specialties match your current filters."
								: "Get started by creating your first medical specialty."}
						</p>
						{!searchTerm && filterStatus === "all" && (
							<Button onClick={handleCreateSpecialty} className="gap-2">
								<Plus className="h-4 w-4" />
								Add First Specialty
							</Button>
						)}
					</CardContent>
				</Card>
			) : (
				<div className="space-y-6">
					{viewMode === "grid" ? renderGridView() : renderListView()}

					{/* Pagination */}
					{meta && meta.totalPages && meta.totalPages > 1 && (
						<div className="flex items-center justify-between">
							<p className="text-muted-foreground text-sm">
								Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
								{Math.min(currentPage * itemsPerPage, meta.total)} of{" "}
								{meta.total} specialties
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
				</div>
			)}

			{/* Modals */}
			<SpecialtyModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				specialty={selectedSpecialty}
			/>

			<EnhancedSpecialtyViewModal
				open={isViewModalOpen}
				onClose={() => setIsViewModalOpen(false)}
				specialty={selectedSpecialty}
				onEdit={() => {
					setIsViewModalOpen(false);
					setIsModalOpen(true);
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Specialty</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{specialtyToDelete?.name}"? This
							action cannot be undone and will permanently remove the specialty
							and all associated information sections.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-destructive hover:bg-destructive/90"
							disabled={deleteSpecialtyMutation.isPending}
						>
							{deleteSpecialtyMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
