import { useState } from "react";
import {
	Plus,
	Search,
	Filter,
	MoreHorizontal,
	Pencil,
	Trash2,
	Stethoscope,
	Users,
	Heart,
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
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorModal, DeleteConfirmationModal } from "@/components/modals";
import { useDoctors, useDeleteDoctor } from "@/hooks/api/useDoctors";
import { toast } from "sonner";

// Mock data for demonstration - currently unused
/* const mockDoctorAccounts = [
	{
		id: "1",
		fullName: "Dr. Nguyễn Văn Minh",
		email: "dr.minh@medicalink.com",
		specialty: "Cardiology",
		experience: 10,
		status: "active",
		isAvailable: true,
		consultationFee: 500000,
		qualification: "MD, PhD",
		phone: "+84 901 234 567",
		lastLogin: "2024-01-15 14:30:00",
		createdAt: "2024-01-01 00:00:00",
		avatar: null,
	},
	{
		id: "2",
		fullName: "Dr. Trần Thị Hoa",
		email: "dr.hoa@medicalink.com",
		specialty: "Pediatrics",
		experience: 8,
		status: "active",
		isAvailable: true,
		consultationFee: 450000,
		qualification: "MD",
		phone: "+84 901 234 568",
		lastLogin: "2024-01-14 10:15:00",
		createdAt: "2024-01-02 00:00:00",
		avatar: null,
	},
	{
		id: "3",
		fullName: "Dr. Lê Văn Đức",
		email: "dr.duc@medicalink.com",
		specialty: "Neurology",
		experience: 15,
		status: "inactive",
		isAvailable: false,
		consultationFee: 600000,
		qualification: "MD, PhD",
		phone: "+84 901 234 569",
		lastLogin: "2024-01-10 16:45:00",
		createdAt: "2024-01-03 00:00:00",
		avatar: null,
	},
]; */

export function DoctorAccountsPage() {
	const { data: doctorsData, isLoading } = useDoctors();
	const deleteDoctorMutation = useDeleteDoctor();

	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "active" | "inactive"
	>("all");
	const [availabilityFilter, setAvailabilityFilter] = useState<
		"all" | "available" | "busy"
	>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [showDoctorModal, setShowDoctorModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
	const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Use real API data instead of mock data
	const mockDoctorAccounts = doctorsData?.data || [];

	const doctorStats = {
		total: mockDoctorAccounts.length,
		active: mockDoctorAccounts.filter((d) => d.status === "active").length,
		available: mockDoctorAccounts.filter(
			(d) => d.status === "active" && d.isAvailable
		).length,
		specialties: new Set(mockDoctorAccounts.map((d) => d.specialty)).size,
	};

	const filteredAccounts = mockDoctorAccounts.filter((doctor) => {
		const matchesSearch =
			doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || doctor.status === statusFilter;

		const matchesAvailability =
			availabilityFilter === "all" ||
			(availabilityFilter === "available" &&
				doctor.isAvailable &&
				doctor.status === "active") ||
			(availabilityFilter === "busy" &&
				(!doctor.isAvailable || doctor.status === "inactive"));

		return matchesSearch && matchesStatus && matchesAvailability;
	});

	// Pagination logic
	const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedAccounts = filteredAccounts.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	const handleCreateDoctor = () => {
		setSelectedDoctor(null);
		setShowDoctorModal(true);
	};

	const handleEditDoctor = (doctorId: string) => {
		const doctor = mockDoctorAccounts.find((d) => d.id === doctorId);
		if (doctor) {
			setSelectedDoctor(doctor);
			setShowDoctorModal(true);
		}
	};

	const handleDeleteDoctor = (doctorId: string) => {
		const doctor = mockDoctorAccounts.find((d) => d.id === doctorId);
		if (doctor) {
			setDoctorToDelete(doctorId);
			setShowDeleteModal(true);
		}
	};

	const getEmptyStateMessage = () => {
		if (searchTerm || statusFilter !== "all" || availabilityFilter !== "all") {
			return "No doctors found matching your search criteria.";
		}
		return "No doctor accounts found.";
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

	const getStatusBadge = (status: string, isAvailable: boolean) => {
		if (status === "active") {
			return isAvailable ? (
				<Badge
					variant="default"
					className="bg-green-100 text-green-800 hover:bg-green-100"
				>
					Available
				</Badge>
			) : (
				<Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
					Busy
				</Badge>
			);
		}
		return (
			<Badge variant="secondary" className="bg-gray-100 text-gray-800">
				Inactive
			</Badge>
		);
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
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
								Available
							</p>
							<p className="text-2xl font-bold text-blue-600">
								{doctorStats.available}
							</p>
						</div>
						<Heart className="h-8 w-8 text-blue-600" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Specialties
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{doctorStats.specialties}
							</p>
						</div>
						<Stethoscope className="h-8 w-8 text-purple-600" />
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
						<Stethoscope className="h-5 w-5" />
						Doctor Management
					</CardTitle>
					<CardDescription>
						A list of all doctors in the system with their specialties and
						status.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Search and Filter Bar */}
					<div className="mb-6 flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
							<Input
								placeholder="Search by name, email, or specialty..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="gap-2">
									<Filter className="h-4 w-4" />
									Filter
									{(statusFilter !== "all" || availabilityFilter !== "all") && (
										<span className="ml-1 rounded-sm bg-blue-100 px-1 text-xs text-blue-800">
											{
												[
													statusFilter !== "all",
													availabilityFilter !== "all",
												].filter(Boolean).length
											}
										</span>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
								<DropdownMenuCheckboxItem
									checked={statusFilter === "all"}
									onCheckedChange={() => setStatusFilter("all")}
								>
									All Status
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={statusFilter === "active"}
									onCheckedChange={() => setStatusFilter("active")}
								>
									Active Only
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={statusFilter === "inactive"}
									onCheckedChange={() => setStatusFilter("inactive")}
								>
									Inactive Only
								</DropdownMenuCheckboxItem>
								<DropdownMenuSeparator />
								<DropdownMenuLabel>Filter by Availability</DropdownMenuLabel>
								<DropdownMenuCheckboxItem
									checked={availabilityFilter === "all"}
									onCheckedChange={() => setAvailabilityFilter("all")}
								>
									All Availability
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={availabilityFilter === "available"}
									onCheckedChange={() => setAvailabilityFilter("available")}
								>
									Available Only
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={availabilityFilter === "busy"}
									onCheckedChange={() => setAvailabilityFilter("busy")}
								>
									Busy/Inactive Only
								</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Doctor</TableHead>
									<TableHead>Contact</TableHead>
									<TableHead>Specialty</TableHead>
									<TableHead>Experience</TableHead>
									<TableHead>Fee</TableHead>
									<TableHead>Status</TableHead>
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
												<Skeleton className="h-6 w-[80px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[60px]" />
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
								) : filteredAccounts.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7} className="h-24 text-center">
											{getEmptyStateMessage()}
										</TableCell>
									</TableRow>
								) : (
									paginatedAccounts.map((doctor) => (
										<TableRow key={doctor.id}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<Avatar className="h-10 w-10">
														<AvatarImage src={doctor.avatar ?? undefined} />
														<AvatarFallback>
															{getInitials(doctor.fullName)}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-medium">{doctor.fullName}</div>
														<div className="text-muted-foreground text-sm">
															{doctor.qualification}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<div className="font-medium">{doctor.email}</div>
													<div className="text-muted-foreground text-sm">
														{doctor.phone}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline">{doctor.specialty}</Badge>
											</TableCell>
											<TableCell className="text-sm">
												{doctor.experience} years
											</TableCell>
											<TableCell className="text-sm font-medium">
												{formatCurrency(doctor.consultationFee)}
											</TableCell>
											<TableCell>
												{getStatusBadge(doctor.status, doctor.isAvailable)}
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
															Edit
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
							Showing {startIndex + 1} to{" "}
							{Math.min(startIndex + itemsPerPage, filteredAccounts.length)} of{" "}
							{filteredAccounts.length} doctor(s)
							{(statusFilter !== "all" || availabilityFilter !== "all") &&
								" (filtered)"}
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

			{/* Doctor Modal */}
			<DoctorModal
				open={showDoctorModal}
				onOpenChange={setShowDoctorModal}
				doctor={selectedDoctor}
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
						? mockDoctorAccounts.find((d) => d.id === doctorToDelete)
								?.fullName || "Unknown Doctor"
						: ""
				}
				isLoading={isDeleting}
			/>
		</div>
	);
}
