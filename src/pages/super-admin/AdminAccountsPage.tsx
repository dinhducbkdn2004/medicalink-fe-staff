import { useState } from "react";
import {
	Plus,
	MoreHorizontal,
	Pencil,
	Trash2,
	Users,
	Lock,
	Eye,
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
import { DeleteConfirmationModal } from "@/components/modals";
import { AdminProfileModal } from "@/components/modals/AdminProfileModal";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import { StaffViewModal } from "@/components/modals/StaffViewModal";
import { useStaffs, useDeleteStaff } from "@/hooks/api/useStaffs";
import { toast } from "sonner";
import {
	SimpleFilter,
	type SimpleFilterParams,
} from "@/components/filters/SimpleFilter";

export function AdminAccountsPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [showAdminModal, setShowAdminModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
	const [selectedAdminForPassword, setSelectedAdminForPassword] = useState<
		any | null
	>(null);
	const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [filters, setFilters] = useState<SimpleFilterParams>({
		// No default role filter needed - this page is specifically for admins
	});

	// Fetch staff with advanced filters
	const { data: staffsData, isLoading } = useStaffs({
		page: currentPage,
		limit: itemsPerPage,
		...filters,
	});

	const deleteStaffMutation = useDeleteStaff();

	// Use real API data - API trả về { data: [...admins], meta: {...} }
	const adminAccounts = staffsData?.data || [];
	const totalCount = staffsData?.meta?.total || 0;
	const totalPages = Math.ceil(totalCount / itemsPerPage);

	const adminStats = {
		total: totalCount,
		active: adminAccounts.filter((a) => a.role === "ADMIN").length,
		superAdmins: adminAccounts.filter((a) => a.role === "SUPER_ADMIN").length,
	};

	// Reset page when filters change - always maintain ADMIN role for this page
	const handleFiltersChange = (newFilters: SimpleFilterParams) => {
		// Force role to ADMIN since this page only manages admins, but don't show it in UI
		const filtersForUI = { ...newFilters };
		delete filtersForUI.role; // Remove role from filters
		setFilters({ ...filtersForUI, role: "ADMIN" });
		setCurrentPage(1);
	};

	const handleCreateAdmin = () => {
		setSelectedAdmin(null);
		setShowAdminModal(true);
	};

	const handleEditAdmin = (adminId: string) => {
		const admin = adminAccounts.find((a) => a.id === adminId);
		if (admin) {
			setSelectedAdmin(admin);
			setShowAdminModal(true);
		}
	};

	const handleChangePassword = (adminId: string) => {
		const admin = adminAccounts.find((a) => a.id === adminId);
		if (admin) {
			setSelectedAdminForPassword(admin);
			setShowPasswordModal(true);
		}
	};

	const handleViewAdmin = (adminId: string) => {
		const admin = adminAccounts.find((a) => a.id === adminId);
		if (admin) {
			setSelectedAdmin(admin);
			setShowViewModal(true);
		}
	};

	const handleDeleteAdmin = (adminId: string) => {
		const admin = adminAccounts.find((a) => a.id === adminId);
		if (admin) {
			setAdminToDelete(adminId);
			setShowDeleteModal(true);
		}
	};

	const confirmDeleteAdmin = async () => {
		if (!adminToDelete) return;

		try {
			setIsDeleting(true);
			await deleteStaffMutation.mutateAsync(adminToDelete);

			toast.success("Admin deleted successfully", {
				description: "The admin account has been removed from the system.",
			});

			// Close modal and reset state
			setShowDeleteModal(false);
			setAdminToDelete(null);
		} catch (error) {
			console.error("Failed to delete admin:", error);
			toast.error("Failed to delete admin", {
				description: "Please try again.",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const handleConfirmDelete = () => {
		void confirmDeleteAdmin();
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
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Total Admins
							</p>
							<p className="text-2xl font-bold">{adminStats.total}</p>
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
								{adminStats.active}
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
								Super Admins
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{adminStats.superAdmins}
							</p>
						</div>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
							<div className="h-3 w-3 rounded-full bg-purple-600"></div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Admin Accounts</h1>
					<p className="text-muted-foreground">
						Manage administrator accounts and permissions
					</p>
				</div>
				<Button onClick={handleCreateAdmin} className="gap-2">
					<Plus className="h-4 w-4" />
					Add Admin
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Admin Management</CardTitle>
					<CardDescription>
						A list of all administrator accounts in the system.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Simple Filters - No role filter needed for admin-specific page */}
					<SimpleFilter
						filters={(() => {
							const filtersWithoutRole = { ...filters };
							delete filtersWithoutRole.role;
							return filtersWithoutRole;
						})()}
						onFiltersChange={handleFiltersChange}
						showGender={true}
						className="mb-6"
					/>

					{/* Table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Admin</TableHead>
									<TableHead>Contact Info</TableHead>
									<TableHead>Gender</TableHead>
									<TableHead>Created</TableHead>
									<TableHead className="w-[70px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									// Loading skeletons
									Array.from({ length: 3 }, (_, index) => (
										<TableRow key={`admin-skeleton-${Date.now()}-${index}`}>
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
												<Skeleton className="h-4 w-[200px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-6 w-[60px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[100px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-8 w-8" />
											</TableCell>
										</TableRow>
									))
								) : adminAccounts.length === 0 ? (
									<TableRow>
										<TableCell colSpan={5} className="h-24 text-center">
											No admin accounts found
										</TableCell>
									</TableRow>
								) : (
									adminAccounts.map((admin) => (
										<TableRow key={admin.id}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<Avatar className="h-10 w-10">
														<AvatarFallback>
															{getInitials(admin.fullName)}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-medium">{admin.fullName}</div>
														<div className="text-muted-foreground text-sm">
															ID: {admin.id.slice(0, 8)}...
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div>
													<div className="font-medium">{admin.email}</div>
													<div className="text-muted-foreground text-sm">
														{admin.phone || "No phone"}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<span className="text-sm font-medium">
													{admin.isMale ? "Male" : "Female"}
												</span>
											</TableCell>
											<TableCell className="text-sm">
												{new Date(admin.createdAt).toLocaleDateString()}
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
															onClick={() => handleViewAdmin(admin.id)}
														>
															<Eye className="mr-2 h-4 w-4" />
															View Details
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleEditAdmin(admin.id)}
														>
															<Pencil className="mr-2 h-4 w-4" />
															Edit Profile
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleChangePassword(admin.id)}
														>
															<Lock className="mr-2 h-4 w-4" />
															Change Password
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleDeleteAdmin(admin.id)}
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
							admin(s)
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

			{/* Admin Profile Modal */}
			<AdminProfileModal
				open={showAdminModal}
				onOpenChange={setShowAdminModal}
				admin={selectedAdmin}
			/>

			{/* Change Password Modal */}
			<AdminChangePasswordModal
				open={showPasswordModal}
				onOpenChange={setShowPasswordModal}
				user={selectedAdminForPassword}
				userType="admin"
			/>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmationModal
				open={showDeleteModal}
				onOpenChange={setShowDeleteModal}
				onConfirm={handleConfirmDelete}
				title="Delete Admin Account"
				description="Are you sure you want to delete this admin account? This action cannot be undone."
				itemName={
					adminToDelete
						? adminAccounts.find((a) => a.id === adminToDelete)?.fullName ||
							"Unknown Admin"
						: ""
				}
				isLoading={isDeleting}
			/>

			{/* Staff View Modal */}
			<StaffViewModal
				open={showViewModal}
				onClose={() => setShowViewModal(false)}
				staff={selectedAdmin}
				onEdit={() => {
					setShowViewModal(false);
					setShowAdminModal(true);
				}}
			/>
		</div>
	);
}
