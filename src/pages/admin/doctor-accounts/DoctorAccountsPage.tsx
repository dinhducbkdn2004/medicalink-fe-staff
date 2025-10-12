import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
	createDoctorColumns,
	type DoctorAccount,
} from "@/components/data-table/doctor-columns";
import { DeleteConfirmationModal } from "@/components/modals";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import { useDoctors, useDeleteDoctor } from "@/hooks/api/useDoctors";
import { usePaginationParams } from "@/hooks/usePaginationParams";
import type { Doctor } from "@/types";

export function DoctorAccountsPage() {
	const navigate = useNavigate();

	// Use URL-synced pagination params
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

	const apiParams = {
		...params,
		sortBy:
			(params.sortBy as "createdAt" | "fullName" | "email") || "createdAt",
	};

	const { data: doctorsData, isLoading } = useDoctors(apiParams);

	const deleteDoctorMutation = useDeleteDoctor();

	const doctors = doctorsData?.data || [];
	const totalCount = doctorsData?.meta?.total || 0;
	const totalPages = Math.max(1, Math.ceil(totalCount / params.limit));

	const handlePageChange = (page: number) => {
		updateParams({ page });
	};

	const handlePageSizeChange = (limit: number) => {
		updateParams({ limit, page: 1 });
	};

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

	const handleCreateDoctor = () => {
		void navigate({ to: "/admin/doctor-accounts/create" });
	};

	const columns = createDoctorColumns({
		onView: handleView,
		onEdit: handleEdit,
		onChangePassword: handleChangePassword,
		onDelete: handleDelete,
	});

	return (
		<div className="flex flex-1 flex-col gap-4 p-2 pt-2">
			{/* Compact Header */}
			<div className="flex items-center justify-between border-b bg-white px-6 py-4">
				<h1 className="text-xl font-semibold text-gray-900">Doctor Accounts</h1>
				<Button
					onClick={handleCreateDoctor}
					className="bg-blue-600 hover:bg-blue-700"
				>
					+ Add Doctor
				</Button>
			</div>

			<Card>
				<CardContent className="space-y-4 p-6">
					<DataTable
						columns={columns}
						data={doctorAccounts}
						searchKey="fullName"
						searchValue={params.search || ""}
						onSearchChange={setSearch}
						isLoading={isLoading}
						loadingRows={params.limit}
						toolbar={
							<DataTableToolbar
								searchKey="fullName"
								searchPlaceholder="Search doctors..."
								searchValue={params.search || ""}
								onSearchChange={setSearch}
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
