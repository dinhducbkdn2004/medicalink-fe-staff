import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	UserPlus,
	User,
	Calendar,
	Phone,
	Mail,
	MapPin,
	Stethoscope,
} from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateDoctor, useUpdateDoctor } from "@/hooks/api/useDoctors";
import { useActiveSpecialties } from "@/hooks/api/useSpecialties";
import { useActiveWorkLocations } from "@/hooks/api/useLocations";
import type { CreateDoctorRequest, UpdateDoctorRequest } from "@/types";

// Schema for profile update (no password)
const profileFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Full name must be at least 2 characters")
		.max(100, "Full name must not exceed 100 characters"),
	email: z
		.string()
		.email("Please enter a valid email address")
		.min(1, "Email is required"),
	phone: z
		.string()
		.optional()
		.or(z.literal(""))
		.refine((val) => !val || /^[+]?[\d\s\-()]{10,15}$/.test(val), {
			message: "Please enter a valid phone number",
		}),
	specialtyId: z.string().optional().or(z.literal("")),
	locationId: z.string().optional().or(z.literal("")),
	experience: z.number().optional(),
	qualification: z.string().optional().or(z.literal("")),
	consultationFee: z.number().optional(),
	isMale: z.boolean().optional(),
	dateOfBirth: z.string().optional().or(z.literal("")),
});

// Schema for create (includes password)
const createFormSchema = profileFormSchema.extend({
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type CreateFormValues = z.infer<typeof createFormSchema>;

interface DoctorProfileModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	doctor?: {
		id: string;
		fullName: string;
		email: string;
		phone?: string;
		specialtyId?: string;
		locationId?: string;
		experience?: number;
		qualification?: string;
		consultationFee?: number;
		isMale?: boolean;
		dateOfBirth?: string;
	} | null;
}

export function DoctorProfileModal({
	open,
	onOpenChange,
	doctor,
}: DoctorProfileModalProps) {
	const isEditing = Boolean(doctor);
	const isCreating = !isEditing;

	const form = useForm<ProfileFormValues | CreateFormValues>({
		resolver: zodResolver(isCreating ? createFormSchema : profileFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			specialtyId: "none",
			locationId: "none",
			experience: undefined,
			qualification: "",
			consultationFee: undefined,
			isMale: true,
			dateOfBirth: "",
			...(isCreating ? { password: "" } : {}),
		},
	});

	const createDoctorMutation = useCreateDoctor();
	const updateDoctorMutation = useUpdateDoctor();
	const { data: specialties } = useActiveSpecialties();
	const { data: workLocations } = useActiveWorkLocations();

	// Reset form when doctor changes or modal opens
	useEffect(() => {
		if (open) {
			if (doctor) {
				form.reset({
					fullName: doctor.fullName,
					email: doctor.email,
					phone: doctor.phone || "",
					isMale: doctor.isMale ?? true,
					dateOfBirth: doctor.dateOfBirth || "",
					specialtyId: doctor.specialtyId || "none",
					locationId: doctor.locationId || "none",
					experience: doctor.experience,
					qualification: doctor.qualification || "",
					consultationFee: doctor.consultationFee,
				});
			} else {
				form.reset({
					fullName: "",
					email: "",
					phone: "",
					isMale: true,
					dateOfBirth: "",
					specialtyId: "none",
					locationId: "none",
					experience: undefined,
					qualification: "",
					consultationFee: undefined,
					...(isCreating ? { password: "" } : {}),
				});
			}
		}
	}, [doctor, open, form, isCreating]);

	const onSubmit = async (values: ProfileFormValues | CreateFormValues) => {
		try {
			if (isEditing && doctor) {
				// Update profile (no password) - only send changed fields
				const updateData: Partial<UpdateDoctorRequest> = {};

				if (values.fullName !== doctor.fullName) {
					updateData.fullName = values.fullName;
				}
				if (values.email !== doctor.email) {
					updateData.email = values.email;
				}
				if (values.phone !== (doctor.phone || "")) {
					updateData.phone = values.phone || null;
				}
				if (values.isMale !== doctor.isMale) {
					updateData.isMale = values.isMale;
				}
				if (values.dateOfBirth !== (doctor.dateOfBirth || "")) {
					updateData.dateOfBirth = values.dateOfBirth
						? new Date(values.dateOfBirth)
						: null;
				}
				if (values.specialtyId !== (doctor.specialtyId || "none")) {
					updateData.specialtyId =
						values.specialtyId === "none" ? null : values.specialtyId || null;
				}
				if (values.locationId !== (doctor.locationId || "none")) {
					updateData.locationId =
						values.locationId === "none" ? null : values.locationId || null;
				}
				if (values.experience !== doctor.experience) {
					updateData.experience = values.experience;
				}
				if (values.qualification !== (doctor.qualification || "")) {
					updateData.qualification = values.qualification || null;
				}
				if (values.consultationFee !== doctor.consultationFee) {
					updateData.consultationFee = values.consultationFee;
				}

				// Only send request if there are changes
				if (Object.keys(updateData).length > 0) {
					await updateDoctorMutation.mutateAsync({
						id: doctor.id,
						data: updateData,
					});

					toast.success("Doctor profile updated successfully");
				} else {
					toast.info("No changes detected");
				}
			} else {
				// Create new doctor (with password)
				const createData: CreateDoctorRequest = {
					fullName: values.fullName,
					email: values.email,
					password: (values as CreateFormValues).password,
					phone: values.phone || null,
					isMale: values.isMale,
					dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth) : null,
					specialtyId:
						values.specialtyId === "none" ? null : values.specialtyId || null,
					locationId:
						values.locationId === "none" ? null : values.locationId || null,
					experience: values.experience,
					qualification: values.qualification || null,
					consultationFee: values.consultationFee,
				};

				await createDoctorMutation.mutateAsync(createData);
				toast.success("Doctor created successfully");
			}

			onOpenChange(false);
		} catch (error: any) {
			toast.error(
				error.message || `Failed to ${isEditing ? "update" : "create"} doctor`
			);
		}
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	const isLoading =
		createDoctorMutation.isPending || updateDoctorMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{isEditing ? (
							<User className="h-5 w-5" />
						) : (
							<UserPlus className="h-5 w-5" />
						)}
						{isEditing ? "Edit Doctor Profile" : "Create New Doctor"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update doctor profile information (use 'Change Password' for password changes)"
							: "Create a new doctor account with medical permissions"}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							void form.handleSubmit(onSubmit)(e);
						}}
						className="space-y-4"
					>
						{/* Full Name */}
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<User className="h-4 w-4" />
										Full Name *
									</FormLabel>
									<FormControl>
										<Input placeholder="Enter full name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Email */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<Mail className="h-4 w-4" />
										Email *
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="Enter email address"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Password - Only for creation */}
						{isCreating && (
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password *</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Enter password (min 8 chars)"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<div className="grid grid-cols-2 gap-4">
							{/* Phone */}
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Phone className="h-4 w-4" />
											Phone
										</FormLabel>
										<FormControl>
											<Input placeholder="Phone number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Gender */}
							<FormField
								control={form.control}
								name="isMale"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<Select
											onValueChange={(value) =>
												field.onChange(value === "true")
											}
											value={
												field.value === undefined ? "" : String(field.value)
											}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select gender" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="true">Male</SelectItem>
												<SelectItem value="false">Female</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Specialty and Location */}
						<div className="grid grid-cols-2 gap-4">
							{/* Specialty */}
							<FormField
								control={form.control}
								name="specialtyId"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<Stethoscope className="h-4 w-4" />
											Specialty
										</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select specialty" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="none">No specialty</SelectItem>
												{specialties?.map((specialty) => (
													<SelectItem key={specialty.id} value={specialty.id}>
														{specialty.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Location */}
							<FormField
								control={form.control}
								name="locationId"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="flex items-center gap-2">
											<MapPin className="h-4 w-4" />
											Work Location
										</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select location" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="none">No location</SelectItem>
												{workLocations?.map((location) => (
													<SelectItem key={location.id} value={location.id}>
														{location.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Experience and Qualification */}
						<div className="grid grid-cols-2 gap-4">
							{/* Experience */}
							<FormField
								control={form.control}
								name="experience"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Years of Experience</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Years of experience"
												min="0"
												{...field}
												onChange={(e) =>
													field.onChange(
														e.target.value
															? parseInt(e.target.value)
															: undefined
													)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Consultation Fee */}
							<FormField
								control={form.control}
								name="consultationFee"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Consultation Fee</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Consultation fee"
												min="0"
												step="0.01"
												{...field}
												onChange={(e) =>
													field.onChange(
														e.target.value
															? parseFloat(e.target.value)
															: undefined
													)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Qualification */}
						<FormField
							control={form.control}
							name="qualification"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Qualification</FormLabel>
									<FormControl>
										<Input
											placeholder="Medical qualification/degrees"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Date of Birth */}
						<FormField
							control={form.control}
							name="dateOfBirth"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<Calendar className="h-4 w-4" />
										Date of Birth
									</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={handleClose}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? isEditing
										? "Updating..."
										: "Creating..."
									: isEditing
										? "Update Profile"
										: "Create Doctor"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
