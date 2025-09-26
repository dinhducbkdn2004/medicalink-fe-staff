import { useState } from "react";
import {
	Plus,
	MoreHorizontal,
	Pencil,
	Trash2,
	Users,
	Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmationModal } from "@/components/modals";
import { DoctorProfileModal } from "@/components/modals/DoctorProfileModal";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import { useDoctors, useDeleteDoctor } from "@/hooks/api/useDoctors";
import { toast } from "sonner";
import {
	SimpleFilter,
	type SimpleFilterParams,
} from "@/components/filters/SimpleFilter";

export function DoctorAccountsPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [showDoctorModal, setShowDoctorModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
	const [selectedDoctorForPassword, setSelectedDoctorForPassword] = useState<
		any | null
	>(null);
	const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [filters, setFilters] = useState<SimpleFilterParams>({});

	// Fetch doctors with advanced filters
	const { data: doctorsData, isLoading } = useDoctors({
		page: currentPage,
		limit: itemsPerPage,
		...filters,
	});

	const deleteDoctorMutation = useDeleteDoctor();

	// Use real API data - extractPaginatedData returns { data: [...], meta: {...} }
	const doctorAccounts = doctorsData?.data || [];
	const totalCount = doctorsData?.meta?.total || 0;
	const totalPages = Math.ceil(totalCount / itemsPerPage);

	const doctorStats = {
		total: totalCount,
		active: doctorAccounts.length, // All fetched doctors are considered active
		male: doctorAccounts.filter((d) => d.isMale).length,
		female: doctorAccounts.filter((d) => !d.isMale).length,
	};

	// Reset page when filters change
	const handleFiltersChange = (newFilters: SimpleFilterParams) => {
		setFilters(newFilters);
		setCurrentPage(1);
	};

	const handleCreateDoctor = () => {
		setSelectedDoctor(null);
		setShowDoctorModal(true);
	};

	const handleEditDoctor = (doctorId: string) => {
		const doctor = doctorAccounts.find((d) => d.id === doctorId);
		if (doctor) {
			setSelectedDoctor(doctor);
			setShowDoctorModal(true);
		}
	};

	const handleChangePassword = (doctorId: string) => {
		const doctor = doctorAccounts.find((d) => d.id === doctorId);
		if (doctor) {
			setSelectedDoctorForPassword(doctor);
			setShowPasswordModal(true);
		}
	};

	const handleDeleteDoctor = (doctorId: string) => {
		const doctor = doctorAccounts.find((d) => d.id === doctorId);
		if (doctor) {
			setDoctorToDelete(doctorId);
			setShowDeleteModal(true);
		}
	};

	const confirmDeleteDoctor = async () => {
		if (!doctorToDelete) return;

		try {
			setIsDeleting(true);
			await deleteDoctorMutation.mutateAsync(doctorToDelete);

			toast.success("Doctor deleted successfully", {
				description: "The doctor account has been removed from the system.",
			});

			// Close modal and reset state
			setShowDeleteModal(false);
			setDoctorToDelete(null);
		} catch (error) {
			console.error("Failed to delete doctor:", error);
			toast.error("Failed to delete doctor", {
				description: "Please try again.",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const handleConfirmDelete = () => {
		void confirmDeleteDoctor();
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Total Doctors
							</p>
							<p className="text-2xl font-bold">{doctorStats.total}</p>
						</div>
						<Users className="text-muted-foreground h-8 w-8" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Active
							</p>
							<p className="text-2xl font-bold text-green-600">
								{doctorStats.active}
							</p>
						</div>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
							<div className="h-3 w-3 rounded-full bg-green-600"></div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Male Doctors
							</p>
							<p className="text-2xl font-bold text-blue-600">
								{doctorStats.male}
							</p>
						</div>
						<Users className="h-8 w-8 text-blue-600" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Female Doctors
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{doctorStats.female}
							</p>
						</div>
						<Users className="h-8 w-8 text-purple-600" />
					</CardContent>
				</Card>
			</div>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Doctor Accounts</h1>
					<p className="text-muted-foreground">
						Manage doctor accounts, specialties, and availability
					</p>
				</div>
				<Button onClick={handleCreateDoctor} className="gap-2">
					<Plus className="h-4 w-4" />
					Add Doctor
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Doctor Management
					</CardTitle>
					<CardDescription>
						A list of all doctors in the system with their specialties and
						status.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Simple Filters */}
					<SimpleFilter
						filters={filters}
						onFiltersChange={handleFiltersChange}
						showGender={true}
						showAvailability={true}
						className="mb-6"
					/>

					{/* Table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Doctor</TableHead>
									<TableHead>Contact Info</TableHead>
									<TableHead>Gender</TableHead>
									<TableHead>Availability</TableHead>
									<TableHead className="w-[70px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									// Loading skeletons
									Array.from({ length: 3 }, (_, index) => (
										<TableRow key={`doctor-skeleton-${Date.now()}-${index}`}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<Skeleton className="h-10 w-10 rounded-full" />
													<div>
														<Skeleton className="mb-1 h-4 w-[120px]" />
														<Skeleton className="h-3 w-[80px]" />
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Skeleton className="mb-1 h-4 w-[200px]" />
												<Skeleton className="h-3 w-[120px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[80px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-6 w-[80px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-8 w-8" />
											</TableCell>
										</TableRow>
									))
								) : doctorAccounts.length === 0 ? (
									<TableRow>
										<TableCell colSpan={5} className="h-24 text-center">
											No doctors found
										</TableCell>
									</TableRow>
								) : (
									doctorAccounts.map((doctor) => (
										<TableRow key={doctor.id}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<Avatar className="h-10 w-10">
														<AvatarFallback>
															{getInitials(doctor.fullName)}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-medium">{doctor.fullName}</div>
														<div className="text-muted-foreground text-sm">
															{doctor.qualification || "N/A"}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<div className="font-medium">{doctor.email}</div>
													<div className="text-muted-foreground text-sm">
														{doctor.phone || "No phone"}
													</div>
												</div>
											</TableCell>
											<TableCell className="text-sm font-medium">
												{doctor.isMale ? "Male" : "Female"}
											</TableCell>
											<TableCell>
												<Badge
													variant={doctor.isAvailable ? "default" : "secondary"}
												>
													{doctor.isAvailable ? "Available" : "Unavailable"}
												</Badge>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => handleEditDoctor(doctor.id)}
														>
															<Pencil className="mr-2 h-4 w-4" />
															Edit Profile
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleChangePassword(doctor.id)}
														>
															<Lock className="mr-2 h-4 w-4" />
															Change Password
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleDeleteDoctor(doctor.id)}
															className="text-red-600"
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between space-x-2 py-4">
						<div className="text-muted-foreground text-sm">
							Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
							{Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
							doctor(s)
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								disabled={currentPage <= 1}
								onClick={() => setCurrentPage(currentPage - 1)}
							>
								Previous
							</Button>
							<span className="text-sm">
								Page {currentPage} of {Math.max(1, totalPages)}
							</span>
							<Button
								variant="outline"
								size="sm"
								disabled={currentPage >= totalPages}
								onClick={() => setCurrentPage(currentPage + 1)}
							>
								Next
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Doctor Profile Modal */}
			<DoctorProfileModal
				open={showDoctorModal}
				onOpenChange={setShowDoctorModal}
				doctor={selectedDoctor}
			/>

			{/* Change Password Modal */}
			<AdminChangePasswordModal
				open={showPasswordModal}
				onOpenChange={setShowPasswordModal}
				user={selectedDoctorForPassword}
				userType="doctor"
			/>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmationModal
				open={showDeleteModal}
				onOpenChange={setShowDeleteModal}
				onConfirm={handleConfirmDelete}
				title="Delete Doctor Account"
				description="Are you sure you want to delete this doctor account? This will also remove their appointment history."
				itemName={
					doctorToDelete
						? doctorAccounts.find((d) => d.id === doctorToDelete)?.fullName ||
							"Unknown Doctor"
						: ""
				}
				isLoading={isDeleting}
			/>
		</div>
	);
}
