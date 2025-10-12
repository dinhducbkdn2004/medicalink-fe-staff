import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
	createDoctorColumns,
	type DoctorAccount,
} from "@/components/data-table/doctor-columns";
import type { ContextMenuAction } from "@/components/data-table";
import { DeleteConfirmationModal } from "@/components/modals";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import { useDoctors, useDeleteDoctor } from "@/hooks/api/useDoctors";
import { usePaginationParams } from "@/hooks/usePaginationParams";
import type { Doctor } from "@/types";
import { type SortDirection } from "@/components/ui/date-range-picker";
import { Eye, Pencil, Lock, Trash2 } from "lucide-react";

export function DoctorAccountsPage() {
	const navigate = useNavigate();

	const { params, setSearch, updateParams } = usePaginationParams({
		defaultPage: 1,
		defaultLimit: 10,
		defaultSortBy: "createdAt",
		defaultSortOrder: "DESC",
	});

	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedDoctorForPassword, setSelectedDoctorForPassword] =
		useState<Doctor | null>(null);
	const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Date range filter
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [dateSortDirection, setDateSortDirection] =
		useState<SortDirection>(null);

	const apiParams = {
		...params,
		sortBy:
			(params.sortBy as "createdAt" | "fullName" | "email") || "createdAt",
		// Apply date sort direction if set
		...(dateSortDirection && {
			sortOrder:
				dateSortDirection === "asc" ? ("ASC" as const) : ("DESC" as const),
		}),
	};
	const { data: doctorsData, isLoading } = useDoctors(apiParams);

	const deleteDoctorMutation = useDeleteDoctor();

	const doctors = doctorsData?.data || [];
	const totalCount = doctorsData?.meta?.total || 0;
	const totalPages = Math.max(1, Math.ceil(totalCount / params.limit));

	const doctorAccounts: DoctorAccount[] = doctors.map((doctor) => ({
		id: doctor.id,
		fullName: doctor.fullName,
		email: doctor.email,
		phone: doctor.phone ?? null,
		dateOfBirth: doctor.dateOfBirth ? String(doctor.dateOfBirth) : null,
		isMale: doctor.isMale ?? true,
		createdAt: String(doctor.createdAt),
		updatedAt: String(doctor.updatedAt),
	}));

	// Filter doctors by date range on client side
	const filteredDoctors = doctorAccounts.filter((doctor) => {
		if (!dateRange?.from) return true;

		const doctorDate = new Date(doctor.createdAt);
		const fromDate = new Date(dateRange.from);
		const toDate = dateRange.to ? new Date(dateRange.to) : fromDate;

		// Set time to start/end of day for proper comparison
		fromDate.setHours(0, 0, 0, 0);
		toDate.setHours(23, 59, 59, 999);

		return doctorDate >= fromDate && doctorDate <= toDate;
	});

	const handleView = (doctorId: string) => {
		void navigate({
			to: "/super-admin/doctor-accounts/$id/view",
			params: { id: doctorId },
		});
	};

	const handleEdit = (doctorId: string) => {
		void navigate({
			to: "/super-admin/doctor-accounts/$id/edit",
			params: { id: doctorId },
		});
	};

	const handleChangePassword = (doctorId: string) => {
		const doctor = doctors.find((d) => d.id === doctorId);
		if (doctor) {
			setSelectedDoctorForPassword(doctor);
			setShowPasswordModal(true);
		}
	};

	const handleDelete = (doctorId: string) => {
		setDoctorToDelete(doctorId);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
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

	const handleConfirmDelete = () => {
		void confirmDelete();
	};

	const handlePageChange = (page: number) => {
		updateParams({ page });
	};

	const handlePageSizeChange = (limit: number) => {
		updateParams({ limit, page: 1 });
	};

	const handleCreateDoctor = () => {
		void navigate({ to: "/super-admin/doctor-accounts/create" });
	};

	const columns = createDoctorColumns({
		onView: handleView,
		onEdit: handleEdit,
		onChangePassword: handleChangePassword,
		onDelete: handleDelete,
	});

	// Context menu actions
	const getRowContextMenuActions = (
		doctor: DoctorAccount
	): ContextMenuAction[] => [
		{
			label: "View Profile",
			icon: <Eye className="h-4 w-4" />,
			onClick: () => handleView(doctor.id),
		},
		{
			label: "Edit Profile",
			icon: <Pencil className="h-4 w-4" />,
			onClick: () => handleEdit(doctor.id),
		},
		{
			label: "Change Password",
			icon: <Lock className="h-4 w-4" />,
			onClick: () => handleChangePassword(doctor.id),
		},
		{
			label: "Delete",
			icon: <Trash2 className="h-4 w-4" />,
			onClick: () => handleDelete(doctor.id),
			className: "text-red-600 focus:text-red-600",
			separator: true,
		},
	];

	return (
		<div className="flex flex-1 flex-col gap-4 p-2 pt-2">
			<Card>
				<CardContent className="space-y-4 p-6">
					<DataTable
						columns={columns}
						data={filteredDoctors}
						searchKey="fullName"
						searchValue={params.search || ""}
						onSearchChange={setSearch}
						isLoading={isLoading}
						loadingRows={params.limit}
						getRowContextMenuActions={getRowContextMenuActions}
						toolbar={
							<DataTableToolbar
								searchKey="fullName"
								searchPlaceholder="Search doctor..."
								searchValue={params.search || ""}
								onSearchChange={setSearch}
								{...(dateRange ? { dateRange } : {})}
								onDateRangeChange={setDateRange}
								dateSortDirection={dateSortDirection}
								onDateSortChange={setDateSortDirection}
								onCreateNew={handleCreateDoctor}
								createButtonText="Add Doctor"
							/>
						}
						pageCount={totalPages}
						pageIndex={params.page}
						pageSize={params.limit}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
						totalCount={filteredDoctors.length}
					/>
				</CardContent>
			</Card>

			<AdminChangePasswordModal
				open={showPasswordModal}
				onOpenChange={setShowPasswordModal}
				user={
					selectedDoctorForPassword
						? {
								id: selectedDoctorForPassword.id,
								fullName: selectedDoctorForPassword.fullName,
								email: selectedDoctorForPassword.email,
							}
						: null
				}
				userType="doctor"
			/>

			<DeleteConfirmationModal
				open={showDeleteModal}
				onOpenChange={setShowDeleteModal}
				onConfirm={handleConfirmDelete}
				title="Delete Doctor Account"
				description="Are you sure you want to delete this doctor account? This will also remove their appointment history."
				itemName={
					doctorToDelete
						? doctors.find((d) => d.id === doctorToDelete)?.fullName ||
							"Unknown Doctor"
						: ""
				}
				isLoading={isDeleting}
			/>
		</div>
	);
}
