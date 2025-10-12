import React, { useState, useEffect, useCallback } from "react";
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
	ArrowLeft,
	User,
	Mail,
	Phone,
	Calendar,
	MapPin,
	Stethoscope,
	GraduationCap,
	Award,
	Briefcase,
	FileText,
	Camera,
	Plus,
	Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import * as doctorsApi from "@/api/doctors";
import type {
	DoctorComplete,
	UpdateDoctorProfileRequest,
} from "@/types/api/doctors.types";
import { Spinner } from "@/components/ui/spinner";
import { DoctorProfileSkeleton } from "@/components/ui/doctor-profile-skeleton";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useActiveSpecialties } from "@/hooks/api/useSpecialties";
import { useActiveWorkLocations } from "@/hooks/api/useWorkLocations";

export function EnhancedDoctorProfilePage() {
	const { id } = useParams({
		from: "/super-admin/doctor-accounts/$id/view",
	});
	const search = useSearch({
		from: "/super-admin/doctor-accounts/$id/view",
	});
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const isInitialEditMode = search.mode === "edit";

	// Fetch doctor data
	const {
		data: response,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["doctor-complete", id],
		queryFn: () => doctorsApi.getDoctorComplete(id),
		enabled: !!id,
	});

	// Fetch specialties and locations for dropdowns
	const { data: specialties } = useActiveSpecialties();
	const { data: workLocations } = useActiveWorkLocations();

	const doctor = response?.data?.data;

	// State management
	const [isEditMode, setIsEditMode] = useState(isInitialEditMode);
	const [activeTab, setActiveTab] = useState("basic");
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
	const [isToggleActiveDialogOpen, setIsToggleActiveDialogOpen] =
		useState(false);

	// Form data state
	const [formData, setFormData] = useState({
		// Basic info
		fullName: "",
		email: "",
		phone: "",
		dateOfBirth: "",
		isMale: true,

		// Professional info
		degree: "",
		position: [] as string[],
		introduction: "",

		// Lists
		memberships: [] as string[],
		awards: [] as string[],
		research: "",
		trainingProcess: [] as string[],
		experience: [] as string[],

		// Media
		avatarUrl: "",
		portrait: "",

		// Relations
		specialtyIds: [] as string[],
		locationIds: [] as string[],
	});

	// Initialize form data when doctor data loads
	useEffect(() => {
		if (doctor) {
			setFormData({
				fullName: doctor.fullName || "",
				email: doctor.email || "",
				phone: doctor.phone || "",
				dateOfBirth: doctor.dateOfBirth?.split("T")[0] || "",
				isMale: doctor.isMale ?? true,
				degree: doctor.degree || "",
				position: doctor.position || [],
				introduction: doctor.introduction || "",
				memberships: doctor.memberships || [],
				awards: doctor.awards || [],
				research: doctor.research || "",
				trainingProcess: doctor.trainingProcess || [],
				experience: doctor.experience || [],
				avatarUrl: doctor.avatarUrl || "",
				portrait: doctor.portrait || "",
				specialtyIds: doctor.specialties?.map((s) => s.id) || [],
				locationIds: doctor.workLocations?.map((l) => l.id) || [],
			});
		}
	}, [doctor]);

	// Mutations
	const updateProfileMutation = useMutation({
		mutationFn: (data: UpdateDoctorProfileRequest) =>
			doctorsApi.updateDoctorProfile(doctor?.profileId || "", data),
		onSuccess: (updatedData) => {
			// Update cache immediately for instant UI update
			queryClient.setQueryData(["doctor-complete", id], (oldData: any) => {
				if (oldData?.data?.data) {
					return {
						...oldData,
						data: {
							...oldData.data,
							data: {
								...oldData.data.data,
								...updatedData?.data?.data,
							},
						},
					};
				}
				return oldData;
			});
			queryClient.invalidateQueries({ queryKey: ["doctor-complete", id] });
			toast.success("Profile updated successfully");
			setIsEditMode(false);
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to update profile");
		},
	});

	const toggleActiveMutation = useMutation({
		mutationFn: () =>
			doctorsApi.toggleDoctorProfileActive(doctor?.profileId || ""),
		onSuccess: () => {
			// Update cache immediately for instant UI update
			queryClient.setQueryData(["doctor-complete", id], (oldData: any) => {
				if (oldData?.data?.data) {
					return {
						...oldData,
						data: {
							...oldData.data,
							data: {
								...oldData.data.data,
								isActive: !oldData.data.data.isActive,
							},
						},
					};
				}
				return oldData;
			});
			queryClient.invalidateQueries({ queryKey: ["doctor-complete", id] });
			toast.success(
				`Doctor profile ${doctor?.isActive ? "deactivated" : "activated"} successfully`
			);
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to toggle profile status");
		},
	});

	// Handlers
	const handleFormChange = useCallback((field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	}, []);

	const handleSave = async () => {
		if (!doctor?.profileId) return;

		const updateData: UpdateDoctorProfileRequest = {
			degree: formData.degree,
			position: formData.position,
			introduction: formData.introduction,
			memberships: formData.memberships,
			awards: formData.awards,
			research: formData.research,
			trainingProcess: formData.trainingProcess,
			experience: formData.experience,
			avatarUrl: formData.avatarUrl,
			portrait: formData.portrait,
			specialtyIds: formData.specialtyIds,
			locationIds: formData.locationIds,
		};

		await updateProfileMutation.mutateAsync(updateData);
	};

	const handleCancel = () => {
		if (doctor) {
			setFormData({
				fullName: doctor.fullName || "",
				email: doctor.email || "",
				phone: doctor.phone || "",
				dateOfBirth: doctor.dateOfBirth?.split("T")[0] || "",
				isMale: doctor.isMale ?? true,
				degree: doctor.degree || "",
				position: doctor.position || [],
				introduction: doctor.introduction || "",
				memberships: doctor.memberships || [],
				awards: doctor.awards || [],
				research: doctor.research || "",
				trainingProcess: doctor.trainingProcess || [],
				experience: doctor.experience || [],
				avatarUrl: doctor.avatarUrl || "",
				portrait: doctor.portrait || "",
				specialtyIds: doctor.specialties?.map((s) => s.id) || [],
				locationIds: doctor.workLocations?.map((l) => l.id) || [],
			});
		}
		setIsEditMode(false);
	};

	const handleBack = () => {
		navigate({ to: "/super-admin/doctor-accounts" });
	};

	// Array field handlers
	const addArrayItem = (field: string) => {
		const currentArray = formData[field as keyof typeof formData] as string[];
		handleFormChange(field, [...currentArray, ""]);
	};

	const updateArrayItem = (field: string, index: number, value: string) => {
		const currentArray = formData[field as keyof typeof formData] as string[];
		const newArray = [...currentArray];
		newArray[index] = value;
		handleFormChange(field, newArray);
	};

	const removeArrayItem = (field: string, index: number) => {
		const currentArray = formData[field as keyof typeof formData] as string[];
		const newArray = currentArray.filter((_, i) => i !== index);
		handleFormChange(field, newArray);
	};

	// Loading state
	if (isLoading) {
		return <DoctorProfileSkeleton />;
	}

	// Error state
	if (error || !doctor) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-2 pt-2">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-2xl font-bold">Doctor Not Found</h1>
				</div>
				<Card>
					<CardContent className="p-6">
						<p className="text-muted-foreground">
							The doctor profile you're looking for doesn't exist or has been
							deleted.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50/30">
			{/* Enhanced Header */}
			<div className="border-b border-gray-200 bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-end">
						{/* Right side - Actions */}
						<div className="flex items-center space-x-3">
							{isEditMode ? (
								<>
									<Button
										variant="outline"
										onClick={handleCancel}
										className="gap-2 border-gray-300 hover:bg-gray-50"
									>
										<X className="h-4 w-4" />
										<span className="hidden sm:inline">Cancel</span>
									</Button>
									<Button
										onClick={handleSave}
										disabled={updateProfileMutation.isPending}
										className="gap-2 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
									>
										{updateProfileMutation.isPending ? (
											<>
												<Spinner size={16} />
												<span className="hidden sm:inline">Saving...</span>
											</>
										) : (
											<>
												<Save className="h-4 w-4" />
												<span className="hidden sm:inline">Save Changes</span>
											</>
										)}
									</Button>
								</>
							) : (
								<>
									<Button
										variant="outline"
										onClick={() => setIsChangePasswordOpen(true)}
										className="gap-2 border-gray-300 hover:bg-gray-50"
									>
										<Key className="h-4 w-4" />
										<span className="hidden sm:inline">Change Password</span>
									</Button>
									<Button
										variant="outline"
										onClick={() => setIsToggleActiveDialogOpen(true)}
										className={`gap-2 border-gray-300 hover:bg-gray-50 ${
											doctor.isActive
												? "text-red-600 hover:border-red-300 hover:text-red-700"
												: "text-green-600 hover:border-green-300 hover:text-green-700"
										}`}
									>
										{doctor.isActive ? (
											<>
												<PowerOff className="h-4 w-4" />
												<span className="hidden sm:inline">Deactivate</span>
											</>
										) : (
											<>
												<Power className="h-4 w-4" />
												<span className="hidden sm:inline">Activate</span>
											</>
										)}
									</Button>
									<Button
										onClick={() => setIsEditMode(true)}
										className="gap-2 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
									>
										<Edit3 className="h-4 w-4" />
										<span className="hidden sm:inline">Edit Profile</span>
									</Button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Status Banner */}
			{isEditMode && (
				<div className="border-b border-blue-200 bg-blue-50">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-12 items-center">
							<div className="flex items-center space-x-2">
								<div className="bg-background h-2 w-2 animate-pulse rounded-full"></div>
								<span className="text-foreground text-sm font-medium">
									Editing Mode - Make your changes and save when ready
								</span>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Profile Content */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
					{/* Sidebar */}
					<div className="lg:col-span-4">
						<Card>
							<CardContent className="p-6">
								{/* Avatar Section */}
								<div className="flex flex-col items-center space-y-4">
									<div className="relative">
										<Avatar className="h-24 w-24">
											<AvatarImage src={formData.avatarUrl} />
											<AvatarFallback className="text-lg">
												{doctor.fullName
													.split(" ")
													.map((n) => n[0])
													.join("")
													.toUpperCase()
													.slice(0, 2)}
											</AvatarFallback>
										</Avatar>
										{isEditMode && (
											<Button
												size="sm"
												variant="outline"
												className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full p-0"
											>
												<Camera className="h-4 w-4" />
											</Button>
										)}
									</div>
									<div className="text-center">
										<h3 className="text-lg font-bold">{doctor.fullName}</h3>
										<p className="text-muted-foreground text-base">
											{doctor.email}
										</p>
										<Badge
											variant={doctor.isActive ? "default" : "secondary"}
											className="mt-2"
										>
											{doctor.isActive ? (
												<>
													<CheckCircle className="mr-1 h-3 w-3" />
													Active
												</>
											) : (
												<>
													<AlertTriangle className="mr-1 h-3 w-3" />
													Inactive
												</>
											)}
										</Badge>
									</div>
								</div>

								<Separator className="my-6" />

								{/* Quick Info */}
								<div className="space-y-3">
									<div className="flex items-center gap-3 text-sm">
										<Mail className="text-muted-foreground h-4 w-4" />
										<span>{doctor.email}</span>
									</div>
									{doctor.phone && (
										<div className="flex items-center gap-3 text-sm">
											<Phone className="text-muted-foreground h-4 w-4" />
											<span>{doctor.phone}</span>
										</div>
									)}
									{doctor.dateOfBirth && (
										<div className="flex items-center gap-3 text-sm">
											<Calendar className="text-muted-foreground h-4 w-4" />
											<span>
												{new Date(doctor.dateOfBirth).toLocaleDateString()}
											</span>
										</div>
									)}
									{doctor.degree && (
										<div className="flex items-center gap-3 text-sm">
											<GraduationCap className="text-muted-foreground h-4 w-4" />
											<span>{doctor.degree}</span>
										</div>
									)}
								</div>

								{/* Specialties */}
								{doctor.specialties && doctor.specialties.length > 0 && (
									<>
										<Separator className="my-6" />
										<div>
											<h4 className="mb-3 flex items-center gap-2 text-base font-semibold">
												<Stethoscope className="h-4 w-4" />
												Specialties
											</h4>
											<div className="space-y-2">
												{doctor.specialties.map((specialty) => (
													<Badge
														key={specialty.id}
														variant="outline"
														className="w-full justify-start"
													>
														{specialty.name}
													</Badge>
												))}
											</div>
										</div>
									</>
								)}

								{/* Work Locations */}
								{doctor.workLocations && doctor.workLocations.length > 0 && (
									<>
										<Separator className="my-6" />
										<div>
											<h4 className="mb-3 flex items-center gap-2 text-base font-semibold">
												<MapPin className="h-4 w-4" />
												Work Locations
											</h4>
											<div className="space-y-2">
												{doctor.workLocations.map((location) => (
													<div key={location.id} className="text-base">
														<p className="font-semibold">{location.name}</p>
														<p className="text-muted-foreground text-sm">
															{location.address}
														</p>
													</div>
												))}
											</div>
										</div>
									</>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Main Content */}
					<div className="space-y-6 lg:col-span-8">
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="basic">Basic Info</TabsTrigger>
								<TabsTrigger value="professional">Professional</TabsTrigger>
								<TabsTrigger value="experience">Experience</TabsTrigger>
								<TabsTrigger value="introduction">Introduction</TabsTrigger>
							</TabsList>

							<TabsContent value="basic" className="space-y-6">
								<BasicInfoSection
									doctor={doctor}
									formData={formData}
									isEditMode={isEditMode}
									onFormChange={handleFormChange}
									specialties={specialties || []}
									workLocations={workLocations || []}
								/>
							</TabsContent>

							<TabsContent value="professional" className="space-y-6">
								<ProfessionalInfoSection
									doctor={doctor}
									formData={formData}
									isEditMode={isEditMode}
									onFormChange={handleFormChange}
									onAddItem={addArrayItem}
									onUpdateItem={updateArrayItem}
									onRemoveItem={removeArrayItem}
								/>
							</TabsContent>

							{/* Experience Tab */}
							<TabsContent value="experience" className="space-y-6">
								<ExperienceSection
									doctor={doctor}
									formData={formData}
									isEditMode={isEditMode}
									onFormChange={handleFormChange}
									onAddItem={addArrayItem}
									onUpdateItem={updateArrayItem}
									onRemoveItem={removeArrayItem}
								/>
							</TabsContent>

							{/* Introduction Tab */}
							<TabsContent value="introduction" className="space-y-6">
								<IntroductionSection
									doctor={doctor}
									formData={formData}
									isEditMode={isEditMode}
									onFormChange={handleFormChange}
								/>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>

			{/* Modals */}
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
						<AlertDialogTitle>
							{doctor.isActive ? "Deactivate" : "Activate"} Doctor Profile
						</AlertDialogTitle>
						<AlertDialogDescription>
							{doctor.isActive
								? "This will deactivate the doctor's profile and they won't be visible to patients. Are you sure?"
								: "This will activate the doctor's profile and make them visible to patients. Are you sure?"}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								toggleActiveMutation.mutate();
								setIsToggleActiveDialogOpen(false);
							}}
							className={
								doctor.isActive ? "bg-destructive hover:bg-destructive/90" : ""
							}
						>
							{doctor.isActive ? "Deactivate" : "Activate"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

// Component sections
interface SectionProps {
	doctor: DoctorComplete;
	formData: any;
	isEditMode: boolean;
	onFormChange: (field: string, value: any) => void;
}

interface ArraySectionProps extends SectionProps {
	onAddItem: (field: string) => void;
	onUpdateItem: (field: string, index: number, value: string) => void;
	onRemoveItem: (field: string, index: number) => void;
}

function BasicInfoSection({
	doctor,
	formData,
	isEditMode,
	onFormChange,
	specialties,
	workLocations,
}: SectionProps & {
	specialties: any[];
	workLocations: any[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<User className="h-5 w-5" />
					Basic Information
				</CardTitle>
				<CardDescription>Personal and contact information</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="fullName">Full Name</Label>
						{isEditMode ? (
							<Input
								id="fullName"
								value={formData.fullName}
								onChange={(e) => onFormChange("fullName", e.target.value)}
							/>
						) : (
							<p className="text-sm">{doctor.fullName}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						{isEditMode ? (
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => onFormChange("email", e.target.value)}
							/>
						) : (
							<p className="text-sm">{doctor.email}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone</Label>
						{isEditMode ? (
							<Input
								id="phone"
								value={formData.phone}
								onChange={(e) => onFormChange("phone", e.target.value)}
							/>
						) : (
							<p className="text-sm">{doctor.phone || "Not provided"}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="dateOfBirth">Date of Birth</Label>
						{isEditMode ? (
							<Input
								id="dateOfBirth"
								type="date"
								value={formData.dateOfBirth}
								onChange={(e) => onFormChange("dateOfBirth", e.target.value)}
							/>
						) : (
							<p className="text-sm">
								{doctor.dateOfBirth
									? new Date(doctor.dateOfBirth).toLocaleDateString()
									: "Not provided"}
							</p>
						)}
					</div>
				</div>

				{/* Specialties Selection */}
				{isEditMode && (
					<div className="space-y-2">
						<Label>Medical Specialties</Label>
						<Select
							value=""
							onValueChange={(value) => {
								if (!formData.specialtyIds.includes(value)) {
									onFormChange("specialtyIds", [
										...formData.specialtyIds,
										value,
									]);
								}
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Add specialty..." />
							</SelectTrigger>
							<SelectContent>
								{specialties
									.filter((s) => !formData.specialtyIds.includes(s.id))
									.map((specialty) => (
										<SelectItem key={specialty.id} value={specialty.id}>
											{specialty.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
						<div className="mt-2 flex flex-wrap gap-2">
							{formData.specialtyIds.map((id: string) => {
								const specialty = specialties.find((s) => s.id === id);
								return specialty ? (
									<Badge key={id} variant="secondary" className="gap-1">
										{specialty.name}
										<X
											className="h-3 w-3 cursor-pointer"
											onClick={() => {
												onFormChange(
													"specialtyIds",
													formData.specialtyIds.filter(
														(sid: string) => sid !== id
													)
												);
											}}
										/>
									</Badge>
								) : null;
							})}
						</div>
					</div>
				)}

				{/* Work Locations Selection */}
				{isEditMode && (
					<div className="space-y-2">
						<Label>Work Locations</Label>
						<Select
							value=""
							onValueChange={(value) => {
								if (!formData.locationIds.includes(value)) {
									onFormChange("locationIds", [...formData.locationIds, value]);
								}
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Add work location..." />
							</SelectTrigger>
							<SelectContent>
								{workLocations
									.filter((l) => !formData.locationIds.includes(l.id))
									.map((location) => (
										<SelectItem key={location.id} value={location.id}>
											{location.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
						<div className="mt-2 flex flex-wrap gap-2">
							{formData.locationIds.map((id: string) => {
								const location = workLocations.find((l) => l.id === id);
								return location ? (
									<Badge key={id} variant="secondary" className="gap-1">
										{location.name}
										<X
											className="h-3 w-3 cursor-pointer"
											onClick={() => {
												onFormChange(
													"locationIds",
													formData.locationIds.filter(
														(lid: string) => lid !== id
													)
												);
											}}
										/>
									</Badge>
								) : null;
							})}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function ProfessionalInfoSection({
	doctor,
	formData,
	isEditMode,
	onFormChange,
	onAddItem,
	onUpdateItem,
	onRemoveItem,
}: ArraySectionProps) {
	return (
		<div className="space-y-6">
			{/* Degree */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<GraduationCap className="h-5 w-5" />
						Degree & Qualifications
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isEditMode ? (
						<Input
							value={formData.degree}
							onChange={(e) => onFormChange("degree", e.target.value)}
							placeholder="e.g., MD, PhD, Associate Professor"
						/>
					) : (
						<p className="text-sm">{doctor.degree || "Not provided"}</p>
					)}
				</CardContent>
			</Card>

			{/* Positions */}
			<ArrayFieldCard
				title="Positions & Titles"
				icon={<Briefcase className="h-5 w-5" />}
				field="position"
				items={formData.position}
				displayItems={doctor.position}
				isEditMode={isEditMode}
				placeholder="Enter position or title"
				onAdd={() => onAddItem("position")}
				onUpdate={(index, value) => onUpdateItem("position", index, value)}
				onRemove={(index) => onRemoveItem("position", index)}
			/>

			{/* Memberships */}
			<ArrayFieldCard
				title="Professional Memberships"
				icon={<Award className="h-5 w-5" />}
				field="memberships"
				items={formData.memberships}
				displayItems={doctor.memberships}
				isEditMode={isEditMode}
				placeholder="Enter membership details"
				onAdd={() => onAddItem("memberships")}
				onUpdate={(index, value) => onUpdateItem("memberships", index, value)}
				onRemove={(index) => onRemoveItem("memberships", index)}
			/>

			{/* Awards */}
			<ArrayFieldCard
				title="Awards & Recognition"
				icon={<Award className="h-5 w-5" />}
				field="awards"
				items={formData.awards}
				displayItems={doctor.awards}
				isEditMode={isEditMode}
				placeholder="Enter award or recognition"
				onAdd={() => onAddItem("awards")}
				onUpdate={(index, value) => onUpdateItem("awards", index, value)}
				onRemove={(index) => onRemoveItem("awards", index)}
			/>
		</div>
	);
}

function ExperienceSection({
	doctor,
	formData,
	isEditMode,
	onAddItem,
	onUpdateItem,
	onRemoveItem,
}: ArraySectionProps) {
	return (
		<div className="space-y-6">
			{/* Training Process */}
			<ArrayFieldCard
				title="Training & Education"
				icon={<GraduationCap className="h-5 w-5" />}
				field="trainingProcess"
				items={formData.trainingProcess}
				displayItems={doctor.trainingProcess}
				isEditMode={isEditMode}
				placeholder="Enter training or education details"
				onAdd={() => onAddItem("trainingProcess")}
				onUpdate={(index, value) =>
					onUpdateItem("trainingProcess", index, value)
				}
				onRemove={(index) => onRemoveItem("trainingProcess", index)}
			/>

			{/* Experience */}
			<ArrayFieldCard
				title="Professional Experience"
				icon={<Briefcase className="h-5 w-5" />}
				field="experience"
				items={formData.experience}
				displayItems={doctor.experience}
				isEditMode={isEditMode}
				placeholder="Enter professional experience"
				onAdd={() => onAddItem("experience")}
				onUpdate={(index, value) => onUpdateItem("experience", index, value)}
				onRemove={(index) => onRemoveItem("experience", index)}
			/>
		</div>
	);
}

function IntroductionSection({
	doctor,
	formData,
	isEditMode,
	onFormChange,
}: SectionProps) {
	return (
		<div className="space-y-6">
			{/* Introduction */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Professional Introduction
					</CardTitle>
					<CardDescription>
						Share your expertise, experience, and approach to patient care
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isEditMode ? (
						<RichTextEditor
							value={formData.introduction}
							onChange={(html) => onFormChange("introduction", html)}
							placeholder={`Tell patients about ${doctor.fullName}'s expertise, experience, and approach to care...`}
							minHeight="200px"
						/>
					) : (
						<div className="prose prose-sm max-w-none">
							{doctor.introduction ? (
								<div
									dangerouslySetInnerHTML={{ __html: doctor.introduction }}
									className="leading-relaxed"
								/>
							) : (
								<p className="text-muted-foreground italic">
									No introduction provided
								</p>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Research */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Research & Publications
					</CardTitle>
					<CardDescription>
						Research work, publications, and scientific contributions
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isEditMode ? (
						<RichTextEditor
							value={formData.research}
							onChange={(html) => onFormChange("research", html)}
							placeholder="Enter research work, publications, and scientific contributions..."
							minHeight="200px"
						/>
					) : (
						<div className="prose prose-sm max-w-none">
							{doctor.research ? (
								<div
									dangerouslySetInnerHTML={{ __html: doctor.research }}
									className="leading-relaxed"
								/>
							) : (
								<p className="text-muted-foreground italic">
									No research information provided
								</p>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

// Helper component for array fields
interface ArrayFieldCardProps {
	title: string;
	icon: React.ReactNode;
	field: string;
	items: string[];
	displayItems?: string[] | undefined;
	isEditMode: boolean;
	placeholder: string;
	onAdd: () => void;
	onUpdate: (index: number, value: string) => void;
	onRemove: (index: number) => void;
}

function ArrayFieldCard({
	title,
	icon,
	items,
	displayItems,
	isEditMode,
	placeholder,
	onAdd,
	onUpdate,
	onRemove,
}: ArrayFieldCardProps) {
	const hasData = displayItems && displayItems.length > 0;
	const showSection = hasData || isEditMode;

	if (!showSection) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{icon}
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isEditMode ? (
					<div className="space-y-3">
						{items.map((item, index) => (
							<div key={index} className="flex gap-2">
								<Textarea
									value={item}
									onChange={(e) => onUpdate(index, e.target.value)}
									placeholder={placeholder}
									className="min-h-[80px] resize-none"
									rows={3}
								/>
								<Button
									variant="outline"
									size="sm"
									onClick={() => onRemove(index)}
									className="shrink-0 px-2"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
						<Button variant="outline" onClick={onAdd} className="gap-2">
							<Plus className="h-4 w-4" />
							Add {title.split(" ")[0]}
						</Button>
					</div>
				) : (
					<div className="space-y-3">
						{displayItems?.map((item, index) => (
							<div key={index} className="bg-muted/50 rounded-lg border p-4">
								<p className="text-sm leading-relaxed">{item}</p>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
