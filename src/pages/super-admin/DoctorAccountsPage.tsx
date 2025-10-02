import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table/data-table";
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
	const [search, setSearch] = useState("");

	// Modal states
	const [showDoctorModal, setShowDoctorModal] = useState(false);
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
	const [selectedDoctorForPassword, setSelectedDoctorForPassword] =
		useState<Doctor | null>(null);
	const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);

	// Fetch doctors data
	const { data: doctorsData } = useDoctors({
		page: 1,
		limit: 100,
		...(search ? { search } : {}),
	});

	const deleteDoctorMutation = useDeleteDoctor();

	const doctors = doctorsData?.data || [];
	const totalCount = doctorsData?.meta?.total || 0;

	// Transform Doctor[] to DoctorAccount[] for DataTable
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

	const doctorStats = {
		total: totalCount,
		active: doctors.length,
		male: doctors.filter((d) => d.isMale).length,
		female: doctors.filter((d) => !d.isMale).length,
	};

	// Action handlers
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
		}
	};

	const handleCreateDoctor = () => {
		setSelectedDoctor(null);
		setShowDoctorModal(true);
	};

	// Create columns with action handlers
	const columns = createDoctorColumns({
		onView: handleView,
		onEdit: handleEdit,
		onChangePassword: handleChangePassword,
		onDelete: handleDelete,
	});

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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
					<h1 className="text-xl font-semibold">Doctor Accounts</h1>
					<p className="text-muted-foreground text-sm">
						Manage doctor accounts, specialties, and availability
					</p>
				</div>
				<Button onClick={handleCreateDoctor}>
					<Plus className="mr-2 h-4 w-4" />
					Add Doctor
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-base">
						<Users className="h-4 w-4" />
						Doctor Management
					</CardTitle>
					<CardDescription className="text-xs">
						A list of all doctors in the system with their contact information
						and status
					</CardDescription>
				</CardHeader>
				<CardContent className="p-4 pt-0">
					<DataTable
						data={doctorAccounts}
						columns={columns}
						searchKey="fullName"
						searchValue={search}
						onSearchChange={setSearch}
					/>
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
				onConfirm={confirmDelete}
				title="Delete Doctor Account"
				description="Are you sure you want to delete this doctor account? This will also remove their appointment history."
				itemName={
					doctorToDelete
						? doctors.find((d) => d.id === doctorToDelete)?.fullName ||
							"Unknown Doctor"
						: ""
				}
				isLoading={deleteDoctorMutation.isPending}
			/>
		</div>
	);
}
