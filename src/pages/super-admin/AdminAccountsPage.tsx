import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DateRange } from "react-day-picker";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DeleteConfirmationModal } from "@/components/modals";
import { AdminProfileModal } from "@/components/modals/AdminProfileModal";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import { useStaffs, useDeleteStaff } from "@/hooks/api/useStaffs";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
	createAdminColumns,
	type AdminAccount,
} from "@/components/data-table/admin-columns";
import type { StaffAccount } from "@/types/common";

export function AdminAccountsPage() {
	const navigate = useNavigate();
	const [currentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [showAdminModal, setShowAdminModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedAdmin, setSelectedAdmin] = useState<AdminAccount | null>(null);
	const [selectedAdminForPassword, setSelectedAdminForPassword] =
		useState<AdminAccount | null>(null);
	const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Data table filters
	const [searchValue, setSearchValue] = useState("");
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const sortBy = "createdAt";
	const sortOrder = "desc" as const;
	const [roleFilter, setRoleFilter] = useState<string>("all");

	// Build filters for API
	const filters = {
		...(roleFilter !== "all" && {
			role: roleFilter as "ADMIN" | "SUPER_ADMIN",
		}),
		...(searchValue && { search: searchValue }),
		sortBy: sortBy as "createdAt" | "fullName" | "email",
		sortOrder,
		...(dateRange?.from && { createdFrom: dateRange.from.toISOString() }),
		...(dateRange?.to && { createdTo: dateRange.to.toISOString() }),
	};

	const { data: staffsData, isLoading } = useStaffs({
		page: currentPage,
		limit: itemsPerPage,
		...filters,
	});

	const deleteStaffMutation = useDeleteStaff();

	const adminAccounts: AdminAccount[] = (staffsData?.data || []).map(
		(staff: StaffAccount) => {
			let dateOfBirth: string | null = null;
			if (staff.dateOfBirth) {
				dateOfBirth =
					typeof staff.dateOfBirth === "string"
						? staff.dateOfBirth
						: staff.dateOfBirth.toISOString();
			}

			return {
				id: staff.id,
				fullName: staff.fullName,
				email: staff.email,
				phone: staff.phone || null,
				dateOfBirth,
				role: staff.role as "ADMIN" | "SUPER_ADMIN",
				isMale: staff.isMale || false,
				createdAt:
					typeof staff.createdAt === "string"
						? staff.createdAt
						: staff.createdAt.toISOString(),
				updatedAt:
					typeof staff.updatedAt === "string"
						? staff.updatedAt
						: staff.updatedAt.toISOString(),
			};
		}
	);

	const totalCount = staffsData?.meta?.total || 0;
	const convertToModalProps = (admin: AdminAccount) => ({
		id: admin.id,
		fullName: admin.fullName,
		email: admin.email,
		...(admin.phone && { phone: admin.phone }),
		role: admin.role,
		isMale: admin.isMale,
	});

	const handleCreateAdmin = () => {
		setSelectedAdmin(null);
		setShowAdminModal(true);
	};

	const handleEditAdmin = (adminId: string) => {
		void navigate({
			to: "/super-admin/admin-accounts/$id/edit",
			params: { id: adminId },
		});
	};

	const handleChangePassword = (adminId: string) => {
		const admin = adminAccounts.find((a) => a.id === adminId);
		if (admin) {
			setSelectedAdminForPassword(admin);
			setShowPasswordModal(true);
		}
	};

	const handleViewAdmin = (adminId: string) => {
		void navigate({
			to: "/super-admin/admin-accounts/$id/view",
			params: { id: adminId },
		});
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

	// Create columns with action handlers
	const columns = createAdminColumns({
		onView: handleViewAdmin,
		onEdit: handleEditAdmin,
		onChangePassword: handleChangePassword,
		onDelete: handleDeleteAdmin,
	});

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<Card>
				<CardHeader>
					<div className="flex flex-1 items-center justify-between space-y-0">
						<div className="space-y-1">
							<CardTitle>Admin Management</CardTitle>
							<CardDescription>
								A list of all administrator accounts in the system.
							</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					<DataTable
						columns={columns}
						data={adminAccounts}
						searchKey="fullName"
						searchValue={searchValue}
						onSearchChange={setSearchValue}
						toolbar={
							<DataTableToolbar
								searchKey="fullName"
								searchPlaceholder="Search admins..."
								searchValue={searchValue}
								onSearchChange={setSearchValue}
								onCreateNew={handleCreateAdmin}
								createButtonText="Add Admin"
								{...(dateRange ? { dateRange } : {})}
								onDateRangeChange={setDateRange}
								roleFilter={roleFilter}
								onRoleFilterChange={setRoleFilter}
							/>
						}
					/>

					{!isLoading && (
						<div className="flex items-center justify-between space-x-2 py-4">
							<div className="text-muted-foreground text-sm">
								Showing {Math.min(adminAccounts.length, itemsPerPage)} of{" "}
								{totalCount} admin(s)
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-sm">
									Page {currentPage} of{" "}
									{Math.max(1, Math.ceil(totalCount / itemsPerPage))}
								</span>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Admin Profile Modal */}
			<AdminProfileModal
				open={showAdminModal}
				onOpenChange={setShowAdminModal}
				admin={selectedAdmin ? convertToModalProps(selectedAdmin) : null}
			/>

			{/* Change Password Modal */}
			<AdminChangePasswordModal
				open={showPasswordModal}
				onOpenChange={setShowPasswordModal}
				user={
					selectedAdminForPassword
						? convertToModalProps(selectedAdminForPassword)
						: null
				}
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
		</div>
	);
}
