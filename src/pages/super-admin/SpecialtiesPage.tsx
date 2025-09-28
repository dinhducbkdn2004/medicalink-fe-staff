import { useState, useEffect, useMemo } from "react";
import debounce from "debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
	Plus,
	Stethoscope,
	Search,
	MoreHorizontal,
	Eye,
	Edit,
	Trash2,
	ToggleLeft,
	ToggleRight,
	Activity,
	Users,
	X,
	Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { usePagination } from "@/hooks/usePagination";
import {
	useSpecialties,
	useDeleteSpecialty,
	useToggleSpecialtyStatus,
	useSpecialtyStats,
} from "@/hooks/api/useSpecialties";
import { SpecialtyModal } from "@/components/modals/SpecialtyModal";
import { SpecialtyViewModal } from "@/components/modals/SpecialtyViewModal";

export function SpecialtiesPage() {
	const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
	const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [specialtyToDelete, setSpecialtyToDelete] = useState<any>(null);

	const itemsPerPage = 10;
	const { currentPage, setPage } = usePagination({
		totalItems: 0, // Will be updated from API response
		itemsPerPage,
		initialPage: 1,
	});

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

	const {
		data: specialties,
		isLoading: specialtiesLoading,
		error: specialtiesError,
	} = useSpecialties({
		page: currentPage,
		limit: itemsPerPage,
		search: debouncedSearchTerm || "",
		...(isActive !== undefined && { isActive }),
	});

	const { data: stats, isLoading: statsLoading } = useSpecialtyStats();

	const deleteSpecialtyMutation = useDeleteSpecialty();
	const toggleStatusMutation = useToggleSpecialtyStatus();

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

	const handleToggleStatus = async (specialty: any) => {
		try {
			await toggleStatusMutation.mutateAsync({
				id: specialty.id,
				isActive: !specialty.isActive,
			});
			toast.success(
				`Specialty ${!specialty.isActive ? "activated" : "deactivated"} successfully`
			);
		} catch (error: any) {
			toast.error(error.message || "Failed to update specialty status");
		}
	};

	const handleFilterChange = (filter: "all" | "active" | "inactive") => {
		setIsActive(filter === "all" ? undefined : filter === "active");
		setPage(1);
	};

	const filteredSpecialties = specialties?.data || [];
	const isLoading = specialtiesLoading || statsLoading;

	const renderTableContent = () => {
		if (specialtiesLoading) {
			return (
				<div className="space-y-3">
					{Array.from({ length: 5 }, (_, index) => (
						<Skeleton
							key={`specialty-loading-${index + 1}`}
							className="h-16 w-full"
						/>
					))}
				</div>
			);
		}

		if (specialtiesError) {
			return (
				<div className="py-8 text-center">
					<p className="text-muted-foreground">Failed to load specialties</p>
				</div>
			);
		}

		if (filteredSpecialties.length === 0) {
			return (
				<div className="py-8 text-center">
					<Stethoscope className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
					<p className="text-muted-foreground">No specialties found</p>
				</div>
			);
		}

		return (
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Doctors</TableHead>
							<TableHead>Created</TableHead>
							<TableHead className="w-[70px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredSpecialties.map((specialty: any) => (
							<TableRow key={specialty.id}>
								<TableCell className="font-medium">
									<div className="flex items-center gap-3">
										<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
											<Stethoscope className="text-primary h-4 w-4" />
										</div>
										{specialty.name}
									</div>
								</TableCell>
								<TableCell className="max-w-xs">
									<p className="text-muted-foreground truncate text-sm">
										{specialty.description || "No description provided"}
									</p>
								</TableCell>
								<TableCell>
									<Badge
										variant={specialty.isActive ? "default" : "secondary"}
										className={
											specialty.isActive
												? "border-green-200 bg-green-100 text-green-800"
												: "border-gray-200 bg-gray-100 text-gray-600"
										}
									>
										{specialty.isActive ? "Active" : "Inactive"}
									</Badge>
								</TableCell>
								<TableCell>
									<div className="text-sm">
										{specialty._count?.doctors || 0} doctors
									</div>
								</TableCell>
								<TableCell className="text-muted-foreground text-sm">
									{new Date(specialty.createdAt).toLocaleDateString()}
								</TableCell>
								<TableCell>
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
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => handleEditSpecialty(specialty)}
											>
												<Edit className="mr-2 h-4 w-4" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => void handleToggleStatus(specialty)}
											>
												{specialty.isActive ? (
													<ToggleLeft className="mr-2 h-4 w-4" />
												) : (
													<ToggleRight className="mr-2 h-4 w-4" />
												)}
												{specialty.isActive ? "Deactivate" : "Activate"}
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className="text-red-600"
												onClick={() => handleDeleteSpecialty(specialty)}
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
		);
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Medical Specialties
					</h1>
					<p className="text-muted-foreground">
						Manage medical specialties and their configurations
					</p>
				</div>
				<Button onClick={handleCreateSpecialty} className="gap-2">
					<Plus className="h-4 w-4" />
					Add Specialty
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Specialties
						</CardTitle>
						<Stethoscope className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold">{stats?.total || 0}</div>
						)}
						<p className="text-muted-foreground text-xs">
							All medical specialties
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Specialties
						</CardTitle>
						<Activity className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold text-green-600">
								{stats?.active || 0}
							</div>
						)}
						<p className="text-muted-foreground text-xs">Currently available</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
						<Users className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold">
								{stats?.withDoctors || 0}
							</div>
						)}
						<p className="text-muted-foreground text-xs">
							Across all specialties
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Stethoscope className="h-5 w-5" />
						Specialties Management
					</CardTitle>
					<div className="flex items-center gap-4">
						<div className="relative max-w-sm flex-1">
							<Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
							<Input
								placeholder="Search specialties..."
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
					{renderTableContent()}

					{/* Pagination */}
					{specialties?.meta && (
						<div className="flex items-center justify-between pt-4">
							<p className="text-muted-foreground text-sm">
								Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
								{Math.min(currentPage * itemsPerPage, specialties.meta.total)}{" "}
								of {specialties.meta.total} specialties
							</p>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage(currentPage - 1)}
									disabled={!specialties.meta.hasPrev}
								>
									Previous
								</Button>
								<span className="text-sm">
									Page {currentPage} of {specialties.meta.totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage(currentPage + 1)}
									disabled={!specialties.meta.hasNext}
								>
									Next
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							specialty "{specialtyToDelete?.name}" and remove all associated
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

			{/* Specialty Modal */}
			<SpecialtyModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				specialty={selectedSpecialty}
			/>

			{/* Specialty View Modal */}
			<SpecialtyViewModal
				open={isViewModalOpen}
				onClose={() => setIsViewModalOpen(false)}
				specialty={selectedSpecialty}
				onEdit={() => {
					setIsViewModalOpen(false);
					setIsModalOpen(true);
				}}
			/>
		</div>
	);
}
