import React, { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearch, useNavigate } from "@tanstack/react-router";
import {
	Edit3,
	Save,
	X,
	Power,
	PowerOff,
	Key,
	AlertTriangle,
	CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as doctorsApi from "@/api/doctors";
import type { DoctorComplete } from "@/types/api/doctors.types";
import { MESSAGES } from "@/lib/messages";

// Component imports
import { DoctorProfileHeader } from "@/components/doctor-profile/DoctorProfileHeader";
import { ContactInformation } from "@/components/doctor-profile/ContactInformation";
import { ProfessionalInformation } from "@/components/doctor-profile/ProfessionalInformation";
import { IntroductionEditor } from "@/components/doctor-profile/IntroductionEditor";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

export function ModernDoctorProfilePage() {
	const { id } = useParams({
		from: "/super-admin/doctor-accounts/$id/view",
	});
	const search = useSearch({
		from: "/super-admin/doctor-accounts/$id/view",
	});
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const isInitialEditMode = search.mode === "edit";

	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["doctor-complete", id],
		queryFn: () => doctorsApi.getDoctorComplete(id),
		enabled: !!id,
	});

	const doctor = response?.data?.data;

	const [isEditMode, setIsEditMode] = useState(isInitialEditMode);
	const [isEditingIntroduction, setIsEditingIntroduction] = useState(false);
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
	const [isToggleActiveDialogOpen, setIsToggleActiveDialogOpen] =
		useState(false);

	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		dateOfBirth: "",
		isMale: true,
		degree: "",
		position: [] as string[],
		memberships: [] as string[],
		awards: [] as string[],
		research: "",
		trainingProcess: [] as string[],
		experience: [] as string[],
		avatarPreview: "",
		portraitPreview: "",
		specialtyIds: [] as string[],
		locationIds: [] as string[],
	});

	const [introductionContent, setIntroductionContent] = useState("");

	const avatarInputRef = useRef<HTMLInputElement | null>(null);
	const portraitInputRef = useRef<HTMLInputElement | null>(null);
	const [uploadingAvatar, setUploadingAvatar] = useState(false);
	const [uploadingPortrait, setUploadingPortrait] = useState(false);

	const updateDoctorMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) =>
			doctorsApi.updateDoctor(id, data),
		onSuccess: () => {
			toast.success(MESSAGES.SUCCESS.DOCTOR.UPDATED);
			queryClient.invalidateQueries({ queryKey: ["doctor-complete", id] });
			setIsEditMode(false);
		},
		onError: () => {
			toast.error(MESSAGES.ERROR.DOCTOR.UPDATE_FAILED);
		},
	});

	const updateProfileMutation = useMutation({
		mutationFn: ({ profileId, data }: { profileId: string; data: any }) =>
			doctorsApi.updateDoctorProfile(profileId, data),
		onSuccess: () => {
			toast.success(MESSAGES.SUCCESS.DOCTOR.PROFILE_UPDATED);
			queryClient.invalidateQueries({ queryKey: ["doctor-complete", id] });
		},
		onError: () => {
			toast.error(MESSAGES.ERROR.DOCTOR.PROFILE_UPDATE_FAILED);
		},
	});

	const toggleActiveMutation = useMutation({
		mutationFn: (profileId: string) =>
			doctorsApi.toggleDoctorProfileActive(profileId),
		onSuccess: () => {
			const message = doctor?.isActive
				? MESSAGES.SUCCESS.DOCTOR.DEACTIVATED
				: MESSAGES.SUCCESS.DOCTOR.ACTIVATED;
			toast.success(message);
			queryClient.invalidateQueries({ queryKey: ["doctor-complete", id] });
			setIsToggleActiveDialogOpen(false);
		},
		onError: () => {
			toast.error(MESSAGES.ERROR.DOCTOR.TOGGLE_STATUS_FAILED);
		},
	});

	useEffect(() => {
		if (doctor) {
			setFormData({
				fullName: doctor.fullName || "",
				email: doctor.email || "",
				phone: doctor.phone || "",
				dateOfBirth: (doctor.dateOfBirth
					? new Date(doctor.dateOfBirth).toISOString().split("T")[0]
					: "") as string,
				isMale: doctor.isMale ?? true,
				degree: doctor.degree || "",
				position: doctor.position || [],
				memberships: doctor.memberships || [],
				awards: doctor.awards || [],
				research: doctor.research || "",
				trainingProcess: doctor.trainingProcess || [],
				experience: doctor.experience || [],
				avatarPreview: doctor.avatarUrl || "",
				portraitPreview: doctor.portrait || "",
				specialtyIds: doctor.specialties?.map((s) => s.id) || [],
				locationIds: doctor.workLocations?.map((l) => l.id) || [],
			});
			setIntroductionContent(doctor.introduction || "");
		}
	}, [doctor]);

	const handleBack = () => {
		navigate({ to: "/super-admin/doctor-accounts" });
	};

	const handleToggleEditMode = () => {
		if (isEditMode) {
			handleCancel();
		} else {
			setIsEditMode(true);
			navigate({
				to: "/super-admin/doctor-accounts/$id/view",
				params: { id },
				search: { mode: "edit" },
			});
		}
	};

	const handleSwitchToViewMode = () => {
		setIsEditMode(false);
		navigate({
			to: "/super-admin/doctor-accounts/$id/view",
			params: { id },
			search: { mode: "view" },
		});
	};

	const handleFormChange = (
		field: string,
		value: string | boolean | string[]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const collectAccountChanges = (doctor: DoctorComplete, formData: any) => {
		const updateData: any = {};

		if (formData.fullName !== doctor.fullName) {
			updateData.fullName = formData.fullName;
		}
		if (formData.email !== doctor.email) {
			updateData.email = formData.email;
		}
		if (formData.phone !== (doctor.phone || "")) {
			updateData.phone = formData.phone || null;
		}
		if (formData.isMale !== doctor.isMale) {
			updateData.isMale = formData.isMale;
		}

		const doctorDob = doctor.dateOfBirth
			? new Date(doctor.dateOfBirth).toISOString().split("T")[0]
			: "";
		if (formData.dateOfBirth !== doctorDob) {
			updateData.dateOfBirth = formData.dateOfBirth
				? new Date(formData.dateOfBirth).toISOString()
				: null;
		}

		return updateData;
	};

	const collectProfileChanges = (doctor: DoctorComplete, formData: any) => {
		const updateData: any = {};

		if (formData.degree !== (doctor.degree || "")) {
			updateData.degree = formData.degree;
		}
		if (
			JSON.stringify(formData.position) !==
			JSON.stringify(doctor.position || [])
		) {
			updateData.position = formData.position;
		}
		if (
			JSON.stringify(formData.memberships) !==
			JSON.stringify(doctor.memberships || [])
		) {
			updateData.memberships = formData.memberships;
		}
		if (
			JSON.stringify(formData.awards) !== JSON.stringify(doctor.awards || [])
		) {
			updateData.awards = formData.awards;
		}
		if (formData.research !== (doctor.research || "")) {
			updateData.research = formData.research;
		}
		if (
			JSON.stringify(formData.trainingProcess) !==
			JSON.stringify(doctor.trainingProcess || [])
		) {
			updateData.trainingProcess = formData.trainingProcess;
		}
		if (
			JSON.stringify(formData.experience) !==
			JSON.stringify(doctor.experience || [])
		) {
			updateData.experience = formData.experience;
		}
		if (
			JSON.stringify(formData.specialtyIds) !==
			JSON.stringify(doctor.specialties?.map((s: any) => s.id) || [])
		) {
			updateData.specialtyIds = formData.specialtyIds;
		}
		if (
			JSON.stringify(formData.locationIds) !==
			JSON.stringify(doctor.workLocations?.map((l: any) => l.id) || [])
		) {
			updateData.locationIds = formData.locationIds;
		}

		return updateData;
	};

	const handleSave = async () => {
		if (!doctor) return;

		try {
			const accountUpdateData = collectAccountChanges(doctor, formData);
			const profileUpdateData = collectProfileChanges(doctor, formData);

			const promises = [];

			if (Object.keys(accountUpdateData).length > 0) {
				promises.push(
					updateDoctorMutation.mutateAsync({
						id: doctor.id,
						data: accountUpdateData,
					})
				);
			}

			if (Object.keys(profileUpdateData).length > 0 && doctor.profileId) {
				promises.push(
					updateProfileMutation.mutateAsync({
						profileId: doctor.profileId,
						data: profileUpdateData,
					})
				);
			}

			if (promises.length > 0) {
				await Promise.all(promises);
				setIsEditMode(false);
			} else {
				toast.info(MESSAGES.INFO.NO_CHANGES_DETECTED);
				setIsEditMode(false);
			}
		} catch (error) {
			console.error("Error saving profile:", error);
		}
	};

	const handleCancel = () => {
		if (doctor) {
			setFormData({
				fullName: doctor.fullName || "",
				email: doctor.email || "",
				phone: doctor.phone || "",
				dateOfBirth: (doctor.dateOfBirth
					? new Date(doctor.dateOfBirth).toISOString().split("T")[0]
					: "") as string,
				isMale: doctor.isMale ?? true,
				degree: doctor.degree || "",
				position: doctor.position || [],
				memberships: doctor.memberships || [],
				awards: doctor.awards || [],
				research: doctor.research || "",
				trainingProcess: doctor.trainingProcess || [],
				experience: doctor.experience || [],
				avatarPreview: doctor.avatarUrl || "",
				portraitPreview: doctor.portrait || "",
				specialtyIds: doctor.specialties?.map((s) => s.id) || [],
				locationIds: doctor.workLocations?.map((l) => l.id) || [],
			});
			setIntroductionContent(doctor.introduction || "");
		}
		handleSwitchToViewMode();
	};

	const handleToggleActive = () => {
		if (doctor?.profileId) {
			toggleActiveMutation.mutate(doctor.profileId);
		}
	};

	const handleToggleEditIntroduction = useCallback(() => {
		setIsEditingIntroduction(!isEditingIntroduction);
		if (isEditingIntroduction) {
			setIntroductionContent(doctor?.introduction || "");
		}
	}, [isEditingIntroduction, doctor?.introduction]);

	const handleSaveIntroduction = useCallback(async () => {
		if (!doctor?.profileId) {
			toast.error(MESSAGES.ERROR.DOCTOR.PROFILE_ID_NOT_FOUND);
			return;
		}

		try {
			await updateProfileMutation.mutateAsync({
				profileId: doctor.profileId,
				data: { introduction: introductionContent },
			});
			setIsEditingIntroduction(false);
		} catch (error) {
			console.error("Error saving introduction:", error);
		}
	}, [introductionContent, doctor?.profileId, updateProfileMutation]);

	const handleIntroductionChange = useCallback((content: string) => {
		setIntroductionContent(content);
	}, []);

	const handleAvatarUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploadingAvatar(true);
		try {
			const reader = new FileReader();
			reader.onload = (e) => {
				setFormData((prev) => ({
					...prev,
					avatarPreview: e.target?.result as string,
				}));
			};
			reader.readAsDataURL(file);

			// Simulate API call - replace with actual upload logic
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success(MESSAGES.SUCCESS.DOCTOR.AVATAR_UPLOADED);
		} catch (error) {
			console.error("Error uploading avatar:", error);
			toast.error(MESSAGES.ERROR.DOCTOR.AVATAR_UPLOAD_FAILED);
		} finally {
			setUploadingAvatar(false);
		}
	};

	const handlePortraitUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploadingPortrait(true);
		try {
			const reader = new FileReader();
			reader.onload = (e) => {
				setFormData((prev) => ({
					...prev,
					portraitPreview: e.target?.result as string,
				}));
			};
			reader.readAsDataURL(file);

			// Simulate API call - replace with actual upload logic
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success(MESSAGES.SUCCESS.DOCTOR.PORTRAIT_UPLOADED);
		} catch (error) {
			console.error("Error uploading portrait:", error);
			toast.error(MESSAGES.ERROR.DOCTOR.PORTRAIT_UPLOAD_FAILED);
		} finally {
			setUploadingPortrait(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size={40} className="text-primary" />
			</div>
		);
	}

	if (error || !doctor) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="border-destructive/20 max-w-md rounded-xl border p-8 shadow-sm">
					<div className="space-y-4 text-center">
						<div className="bg-destructive/10 mx-auto w-fit rounded-full p-3">
							<X className="text-destructive h-8 w-8" />
						</div>
						<div>
							<h3 className="text-destructive text-lg font-semibold">
								Error Loading Doctor Profile
							</h3>
							<p className="text-muted-foreground mt-1">
								Unable to load doctor profile. Please try again later.
							</p>
						</div>
						<Button
							variant="outline"
							onClick={() => window.location.reload()}
							className="gap-2"
						>
							Retry
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const isSubmitting =
		updateDoctorMutation.isPending || updateProfileMutation.isPending;

	return (
		<>
			<div className="min-h-screen">
				<div className="bg-background shadow-sm">
					<div className="container mx-auto max-w-6xl px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex gap-3">
								<Button
									variant="outline"
									onClick={() => setIsChangePasswordOpen(true)}
									className="gap-2"
								>
									<Key className="h-4 w-4" />
									Change Password
								</Button>
								<Button
									variant={doctor?.isActive ? "destructive" : "default"}
									onClick={() => setIsToggleActiveDialogOpen(true)}
									className="gap-2"
								>
									{doctor?.isActive ? (
										<PowerOff className="h-4 w-4" />
									) : (
										<Power className="h-4 w-4" />
									)}
									{doctor?.isActive ? "Deactivate" : "Activate"}
								</Button>{" "}
								{isEditMode ? (
									<>
										<Button
											onClick={handleSave}
											disabled={isSubmitting}
											className="gap-2"
										>
											{isSubmitting ? (
												<>
													<Spinner size={16} />
													{MESSAGES.LOADING.GENERAL.SAVING}
												</>
											) : (
												<>
													<Save className="h-4 w-4" />
													Save Changes
												</>
											)}
										</Button>
										<Button
											variant="outline"
											onClick={handleCancel}
											disabled={isSubmitting}
											className="gap-2"
										>
											<X className="h-4 w-4" />
											Cancel
										</Button>
									</>
								) : (
									<Button onClick={handleToggleEditMode} className="gap-2">
										<Edit3 className="h-4 w-4" />
										Edit Profile
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="container mx-auto max-w-6xl px-6 py-6">
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
						<div className="space-y-4 lg:col-span-4">
							<DoctorProfileHeader
								doctor={doctor}
								isEditMode={isEditMode}
								formData={formData}
								uploadingAvatar={uploadingAvatar}
								onFormChange={handleFormChange}
								onAvatarUpload={handleAvatarUpload}
								avatarInputRef={avatarInputRef}
							/>

							<ContactInformation
								doctor={doctor}
								isEditMode={isEditMode}
								formData={formData}
								onFormChange={handleFormChange}
							/>
						</div>

						<div className="space-y-4 lg:col-span-8">
							<ProfessionalInformation
								doctor={doctor}
								isEditMode={isEditMode}
								formData={formData}
								uploadingPortrait={uploadingPortrait}
								onFormChange={handleFormChange}
								onPortraitUpload={handlePortraitUpload}
								portraitInputRef={portraitInputRef}
							/>

							<IntroductionEditor
								doctor={doctor}
								isEditingIntroduction={isEditingIntroduction}
								introductionContent={introductionContent}
								onToggleEditIntroduction={handleToggleEditIntroduction}
								onSaveIntroduction={handleSaveIntroduction}
								onIntroductionChange={handleIntroductionChange}
							/>
						</div>
					</div>
				</div>
			</div>

			<AdminChangePasswordModal
				open={isChangePasswordOpen}
				onOpenChange={setIsChangePasswordOpen}
				user={
					doctor
						? {
								id: doctor.id,
								fullName: doctor.fullName,
								email: doctor.email,
							}
						: null
				}
				userType="doctor"
			/>

			<AlertDialog
				open={isToggleActiveDialogOpen}
				onOpenChange={setIsToggleActiveDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							{doctor?.isActive ? (
								<>
									<AlertTriangle className="text-destructive h-5 w-5" />
									Deactivate Doctor Account
								</>
							) : (
								<>
									<CheckCircle className="text-primary h-5 w-5" />
									Activate Doctor Account
								</>
							)}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{doctor?.isActive ? (
								<>
									Are you sure you want to deactivate{" "}
									<strong>{doctor.fullName}</strong>? This will prevent them
									from logging in and accessing the system.
								</>
							) : (
								<>
									Are you sure you want to activate{" "}
									<strong>{doctor.fullName}</strong>? They will be able to log
									in and access the system.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleToggleActive}
							className={
								doctor?.isActive ? "bg-destructive hover:bg-destructive/90" : ""
							}
						>
							{doctor?.isActive ? "Deactivate" : "Activate"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
