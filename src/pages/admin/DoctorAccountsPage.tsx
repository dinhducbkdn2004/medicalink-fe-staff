import { useState } from "react";
import {
	Plus,
	MoreHorizontal,
	Pencil,
	Trash2,
	Stethoscope,
	Users,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorModal, DeleteConfirmationModal } from "@/components/modals";
import {
	EnhancedFilter,
	type EnhancedFilterParams,
} from "@/components/filters/EnhancedFilter";
import { useDoctors, useDeleteDoctor } from "@/hooks/api/useDoctors";
import { toast } from "sonner";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { PageTransition } from "@/components/ui/page-transition";
import { format } from "date-fns";
import type { Doctor } from "@/types";

export function DoctorAccountsPage() {
	const [filters, setFilters] = useState<EnhancedFilterParams>({
		sortBy: "createdAt",
		sortOrder: "desc",
		page: 1,
		limit: 10,
	});
	const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
	const [showDoctorModal, setShowDoctorModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const { data: doctorsResponse, isLoading } = useDoctors(filters);
	const deleteDoctorMutation = useDeleteDoctor();

	const doctorsData = doctorsResponse?.data || [];
	const meta = doctorsResponse?.meta;

	const doctorStats = {
		total: meta?.total || 0,
		active: doctorsData.length, // Since we only get active ones from API
	};

	const handleFiltersChange = (newFilters: EnhancedFilterParams) => {
		setFilters({ ...newFilters, page: 1 }); // Reset to page 1 when filters change
	};

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({ ...prev, page }));
	};

	const handlePageSizeChange = (limit: number) => {
		setFilters((prev) => ({ ...prev, limit, page: 1 }));
	};

	const handleCreateDoctor = () => {
		setSelectedDoctor(null);
		setShowDoctorModal(true);
	};

	const handleEditDoctor = (doctorId: string) => {
		const doctor = doctorsData.find((d: Doctor) => d.id === doctorId);
		if (doctor) {
			setSelectedDoctor(doctor);
			setShowDoctorModal(true);
		}
	};

	const handleDeleteDoctor = (doctorId: string) => {
		const doctor = doctorsData.find((d: Doctor) => d.id === doctorId);
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

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<PageTransition>
			<div className="flex flex-1 flex-col gap-6 p-6">
				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-2">
					<AnimatedCard delay={0}>
						<Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 transition-all duration-300 hover:shadow-lg">
							<CardContent className="flex items-center justify-between p-6">
								<div>
									<p className="text-sm font-medium text-blue-700">
										Total Doctors
									</p>
									<p className="text-3xl font-bold text-blue-800">
										{doctorStats.total}
									</p>
								</div>
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-200">
									<Users className="h-6 w-6 text-blue-600" />
								</div>
							</CardContent>
						</Card>
					</AnimatedCard>

					<AnimatedCard delay={1}>
						<Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 transition-all duration-300 hover:shadow-lg">
							<CardContent className="flex items-center justify-between p-6">
								<div>
									<p className="text-sm font-medium text-green-700">Active</p>
									<p className="text-3xl font-bold text-green-800">
										{doctorStats.active}
									</p>
								</div>
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200">
									<div className="h-6 w-6 rounded-full bg-green-600"></div>
								</div>
							</CardContent>
						</Card>
					</AnimatedCard>
				</div>

				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight">
							Doctor Accounts
						</h1>
						<p className="text-muted-foreground">
							Manage doctor accounts and their information
						</p>
					</div>
					<EnhancedButton
						onClick={handleCreateDoctor}
						className="gap-2 bg-blue-600 hover:bg-blue-700"
					>
						<Plus className="h-4 w-4" />
						Add Doctor
					</EnhancedButton>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Stethoscope className="h-5 w-5" />
							Doctor Management
						</CardTitle>
						<CardDescription>
							A list of all doctors in the system.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Enhanced Filter */}
						<EnhancedFilter
							filters={filters}
							onFiltersChange={handleFiltersChange}
							showRole={false}
							showGender={true}
							showSort={true}
						/>

						{/* Table */}
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Doctor</TableHead>
										<TableHead>Contact</TableHead>
										<TableHead>Created Date</TableHead>
										<TableHead className="w-[70px]">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isLoading ? (
										Array.from({ length: 5 }, (_, index) => (
											<TableRow key={`doctor-skeleton-${index}`}>
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
													<Skeleton className="h-4 w-[100px]" />
												</TableCell>
												<TableCell>
													<Skeleton className="h-8 w-8" />
												</TableCell>
											</TableRow>
										))
									) : doctorsData.length === 0 ? (
										<TableRow>
											<TableCell colSpan={4} className="h-24 text-center">
												<div className="text-muted-foreground">
													<Stethoscope className="mx-auto mb-2 h-8 w-8" />
													<p>No doctors found</p>
													<p className="text-sm">
														Try adjusting your search criteria
													</p>
												</div>
											</TableCell>
										</TableRow>
									) : (
										doctorsData.map((doctor: Doctor) => (
											<TableRow key={doctor.id}>
												<TableCell>
													<div className="flex items-center space-x-3">
														<Avatar className="h-10 w-10">
															<AvatarFallback>
																{getInitials(doctor.fullName)}
															</AvatarFallback>
														</Avatar>
														<div>
															<div className="font-medium">
																{doctor.fullName}
															</div>
															<div className="text-muted-foreground text-sm">
																{doctor.email}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div>
														<div className="font-medium">{doctor.email}</div>
														{doctor.phone && (
															<div className="text-muted-foreground text-sm">
																{doctor.phone}
															</div>
														)}
													</div>
												</TableCell>
												<TableCell className="text-sm">
													{format(new Date(doctor.createdAt), "MMM dd, yyyy")}
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
						{meta && (
							<div className="flex items-center justify-between space-x-2 py-4">
								<div className="text-muted-foreground text-sm">
									Showing {((meta.page || 1) - 1) * meta.limit + 1} to{" "}
									{Math.min((meta.page || 1) * meta.limit, meta.total)} of{" "}
									{meta.total} doctor(s)
								</div>
								<div className="flex items-center space-x-2">
									<div className="flex items-center space-x-2">
										<span className="text-muted-foreground text-sm">
											Rows per page:
										</span>
										<select
											value={meta.limit}
											onChange={(e) =>
												handlePageSizeChange(Number(e.target.value))
											}
											className="rounded border px-2 py-1 text-sm"
										>
											<option value={10}>10</option>
											<option value={20}>20</option>
											<option value={50}>50</option>
										</select>
									</div>
									<EnhancedButton
										variant="outline"
										size="sm"
										disabled={!meta.hasPrev}
										onClick={() => handlePageChange((meta.page || 1) - 1)}
									>
										Previous
									</EnhancedButton>
									<span className="text-sm">
										Page {meta.page || 1} of {meta.totalPages || 1}
									</span>
									<EnhancedButton
										variant="outline"
										size="sm"
										disabled={!meta.hasNext}
										onClick={() => handlePageChange((meta.page || 1) + 1)}
									>
										Next
									</EnhancedButton>
								</div>
							</div>
						)}
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
					onConfirm={() => void confirmDeleteDoctor()}
					title="Delete Doctor Account"
					description="Are you sure you want to delete this doctor account? This action cannot be undone."
					itemName={
						doctorToDelete
							? doctorsData.find((d: Doctor) => d.id === doctorToDelete)
									?.fullName || "Unknown Doctor"
							: ""
					}
					isLoading={isDeleting}
				/>
			</div>
		</PageTransition>
	);
}
