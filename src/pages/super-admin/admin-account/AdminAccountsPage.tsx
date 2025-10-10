import { useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { Card, CardContent } from "@/components/ui/card";
import { DeleteConfirmationModal } from "@/components/modals";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import { useStaffs, useDeleteStaff } from "@/hooks/api/useStaffs";
import { usePaginationParams } from "@/hooks/usePaginationParams";
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
	const searchParams = useSearch({ strict: false }) as any;

	const { params, setSearch, updateParams } = usePaginationParams({
		defaultPage: 1,
		defaultLimit: 10,
		defaultSortBy: "createdAt",
		defaultSortOrder: "DESC",
	});

	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedAdminForPassword, setSelectedAdminForPassword] =
		useState<AdminAccount | null>(null);
	const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Role filter from URL
	const roleFilter = searchParams.role || "all";
	const setRoleFilter = (role: string) => {
		updateParams({ role: role === "all" ? undefined : role, page: 1 });
	};

	// Build API params
	const apiParams = {
		...params,
		sortBy:
			(params.sortBy as "createdAt" | "fullName" | "email") || "createdAt",
		...(roleFilter !== "all" && {
			role: roleFilter as "ADMIN" | "SUPER_ADMIN",
		}),
	};

	const { data: staffsData, isLoading } = useStaffs(apiParams);

	const deleteStaffMutation = useDeleteStaff();

	const totalCount = staffsData?.meta?.total || 0;
	const totalPages = Math.max(1, Math.ceil(totalCount / params.limit));

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

	const handleCreateAdmin = () => {
		void navigate({ to: "/super-admin/admin-accounts/create" });
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

	const handlePageChange = (page: number) => {
		updateParams({ page });
	};

	const handlePageSizeChange = (limit: number) => {
		updateParams({ limit, page: 1 });
	};

	const columns = createAdminColumns({
		onView: handleViewAdmin,
		onEdit: handleEditAdmin,
		onChangePassword: handleChangePassword,
		onDelete: handleDeleteAdmin,
	});

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<Card>
				<CardContent className="space-y-4 p-6">
					<DataTable
						columns={columns}
						data={adminAccounts}
						searchKey="fullName"
						searchValue={params.search || ""}
						onSearchChange={setSearch}
						isLoading={isLoading}
						loadingRows={params.limit}
						toolbar={
							<DataTableToolbar
								searchKey="fullName"
								searchPlaceholder="Search admins..."
								searchValue={params.search || ""}
								onSearchChange={setSearch}
								roleFilter={roleFilter}
								onRoleFilterChange={setRoleFilter}
								onCreateNew={handleCreateAdmin}
								createButtonText="Add Admin"
							/>
						}
						pageCount={totalPages}
						pageIndex={params.page}
						pageSize={params.limit}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
						totalCount={totalCount}
					/>
				</CardContent>
			</Card>

			{/* Change Password Modal */}
			<AdminChangePasswordModal
				open={showPasswordModal}
				onOpenChange={setShowPasswordModal}
				user={
					selectedAdminForPassword
						? {
								id: selectedAdminForPassword.id,
								fullName: selectedAdminForPassword.fullName,
								email: selectedAdminForPassword.email,
							}
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
