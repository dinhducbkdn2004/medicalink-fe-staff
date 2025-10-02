import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/modals";
import { DoctorProfileModal } from "@/components/modals/DoctorProfileModal";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import { useDoctors, useDeleteDoctor } from "@/hooks/api/useDoctors";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import {
	createDoctorColumns,
	type DoctorAccount,
} from "@/components/data-table/doctor-columns";
import type { Doctor } from "@/types/staff";

export function DoctorAccountsPage() {
	const [currentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [showDoctorModal, setShowDoctorModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedDoctor, setSelectedDoctor] = useState<DoctorAccount | null>(
		null
	);
	const [selectedDoctorForPassword, setSelectedDoctorForPassword] =
		useState<DoctorAccount | null>(null);
	const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Data table filters
	const [searchValue, setSearchValue] = useState("");
	const [dateRange] = useState<DateRange | undefined>();
	const sortBy = "createdAt";
	const sortOrder = "desc" as const;

	// Build filters for API
	const filters = {
		...(searchValue && { search: searchValue }),
		sortBy: sortBy as "createdAt" | "fullName" | "email",
		sortOrder,
		...(dateRange?.from && { createdFrom: dateRange.from.toISOString() }),
		...(dateRange?.to && { createdTo: dateRange.to.toISOString() }),
	};

	const { data: doctorsData } = useDoctors({
		page: currentPage,
		limit: itemsPerPage,
		...filters,
	});

	const deleteDoctorMutation = useDeleteDoctor();

	const doctorAccounts: DoctorAccount[] =
		doctorsData?.data.map((doctor: Doctor): DoctorAccount => {
			// Convert Date to string for display
			let dateOfBirthStr: string | null = null;
			if (doctor.dateOfBirth) {
				dateOfBirthStr =
					typeof doctor.dateOfBirth === "string"
						? doctor.dateOfBirth
						: doctor.dateOfBirth.toISOString();
			}

			const createdAtStr =
				typeof doctor.createdAt === "string"
					? doctor.createdAt
					: doctor.createdAt.toISOString();

			const updatedAtStr =
				typeof doctor.updatedAt === "string"
					? doctor.updatedAt
					: doctor.updatedAt.toISOString();

			return {
				id: doctor.id,
				fullName: doctor.fullName,
				email: doctor.email,
				phone: doctor.phone ?? null,
				dateOfBirth: dateOfBirthStr,
				isMale: doctor.isMale ?? false,
				createdAt: createdAtStr,
				updatedAt: updatedAtStr,
			};
		}) || [];

	const handleViewDoctor = (doctorId: string) => {
		const doctor = doctorAccounts.find((d) => d.id === doctorId);
		if (doctor) {
			setSelectedDoctor(doctor);
			setShowDoctorModal(true);
		}
	};

	const handleEditDoctor = (_doctorId: string) => {
		// Edit page route not implemented yet
		toast.info("Feature coming soon", {
			description: "Doctor edit page is being developed.",
		});
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

			setShowDeleteModal(false);
			setDoctorToDelete(null);
		} catch (error: unknown) {
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

	const doctorColumns = createDoctorColumns({
		onView: handleViewDoctor,
		onEdit: handleEditDoctor,
		onChangePassword: handleChangePassword,
		onDelete: handleDeleteDoctor,
	});

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-semibold">Doctor Management</h1>
					<p className="text-muted-foreground text-sm">
						A list of all doctor accounts in the system
					</p>
				</div>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Doctor
				</Button>
			</div>

			<DataTable
				columns={doctorColumns}
				data={doctorAccounts}
				searchKey="fullName"
				searchValue={searchValue}
				onSearchChange={setSearchValue}
			/>

			<DoctorProfileModal
				open={showDoctorModal}
				onOpenChange={setShowDoctorModal}
				doctor={
					selectedDoctor
						? {
								id: selectedDoctor.id,
								fullName: selectedDoctor.fullName,
								email: selectedDoctor.email,
								...(selectedDoctor.phone && { phone: selectedDoctor.phone }),
								...(typeof selectedDoctor.isMale === "boolean" && {
									isMale: selectedDoctor.isMale,
								}),
								...(selectedDoctor.dateOfBirth && {
									dateOfBirth: selectedDoctor.dateOfBirth,
								}),
							}
						: null
				}
			/>

			<AdminChangePasswordModal
				open={showPasswordModal}
				onOpenChange={setShowPasswordModal}
				user={selectedDoctorForPassword}
				userType="doctor"
			/>

			<DeleteConfirmationModal
				open={showDeleteModal}
				onOpenChange={setShowDeleteModal}
				onConfirm={handleConfirmDelete}
				title="Delete Doctor Account"
				description="Are you sure you want to delete this doctor account? This action cannot be undone."
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
