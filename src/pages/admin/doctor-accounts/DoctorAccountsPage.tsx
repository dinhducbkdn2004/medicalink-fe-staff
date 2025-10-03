import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
	createDoctorColumns,
	type DoctorAccount,
} from "@/components/data-table/doctor-columns";
import { DeleteConfirmationModal } from "@/components/modals";
import { DoctorProfileModal } from "@/components/modals/DoctorProfileModal";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import { useDoctors, useDeleteDoctor } from "@/hooks/api/useDoctors";
import type { Doctor } from "@/types";

export function DoctorAccountsPage() {
	const navigate = useNavigate();
	const [currentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [showDoctorModal, setShowDoctorModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
	const [selectedDoctorForPassword, setSelectedDoctorForPassword] =
		useState<Doctor | null>(null);
	const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const [searchValue, setSearchValue] = useState("");
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const sortBy = "createdAt";
	const sortOrder = "DESC" as const; // Changed to uppercase to match API

	const filters = {
		...(searchValue && { search: searchValue }),
		sortBy: sortBy as "createdAt" | "fullName" | "email",
		sortOrder,
		...(dateRange?.from && { createdFrom: dateRange.from.toISOString() }),
		...(dateRange?.to && { createdTo: dateRange.to.toISOString() }),
	};

	const { data: doctorsData, isLoading } = useDoctors({
		page: currentPage,
		limit: itemsPerPage,
		...filters,
	});

	const deleteDoctorMutation = useDeleteDoctor();

	const doctors = doctorsData?.data || [];
	const totalCount = doctorsData?.meta?.total || 0;

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
		setSelectedDoctor(null);
		setShowDoctorModal(true);
	};

	const columns = createDoctorColumns({
		onView: handleView,
		onEdit: handleEdit,
		onChangePassword: handleChangePassword,
		onDelete: handleDelete,
	});

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<Card>
				<CardHeader>
					<div className="flex flex-1 items-center justify-between space-y-0">
						<div className="space-y-1">
							<CardTitle>Doctor Management</CardTitle>
							<CardDescription>
								A list of all doctor accounts in the system.
							</CardDescription>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					<DataTable
						columns={columns}
						data={doctorAccounts}
						searchKey="fullName"
						searchValue={searchValue}
						onSearchChange={setSearchValue}
						toolbar={
							<DataTableToolbar
								searchKey="fullName"
								searchPlaceholder="Search doctors..."
								searchValue={searchValue}
								onSearchChange={setSearchValue}
								onCreateNew={handleCreateDoctor}
								createButtonText="Add Doctor"
								{...(dateRange ? { dateRange } : {})}
								onDateRangeChange={setDateRange}
							/>
						}
					/>

					{!isLoading && (
						<div className="flex items-center justify-between space-x-2 py-4">
							<div className="text-muted-foreground text-sm">
								Showing {Math.min(doctorAccounts.length, itemsPerPage)} of{" "}
								{totalCount} doctor(s)
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

			<DoctorProfileModal
				open={showDoctorModal}
				onOpenChange={setShowDoctorModal}
				doctor={
					selectedDoctor
						? {
								id: selectedDoctor.id,
								fullName: selectedDoctor.fullName,
								email: selectedDoctor.email,
								...(selectedDoctor.phone
									? { phone: selectedDoctor.phone }
									: {}),
								...(selectedDoctor.isMale !== null &&
								selectedDoctor.isMale !== undefined
									? { isMale: selectedDoctor.isMale }
									: {}),
								...(selectedDoctor.dateOfBirth
									? { dateOfBirth: String(selectedDoctor.dateOfBirth) }
									: {}),
							}
						: null
				}
			/>

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
