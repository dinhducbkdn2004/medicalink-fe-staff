import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stethoscope, Eye, EyeOff } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useCreateDoctor, useUpdateDoctor } from "@/hooks/api/useDoctors";
import type { CreateDoctorRequest, UpdateDoctorRequest } from "@/types";

const doctorFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Full name must be at least 2 characters")
		.max(100, "Full name must not exceed 100 characters"),
	email: z
		.string()
		.min(1, "Email is required")
		.refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
			message: "Please enter a valid email address",
		}),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
	phone: z
		.string()
		.optional()
		.or(z.literal(""))
		.refine((val) => !val || /^[+]?[\d\s\-()]{10,15}$/.test(val), {
			message: "Please enter a valid phone number",
		}),
	isMale: z.string().optional().or(z.literal("")),
	specialty: z.string().min(1, "Please select a specialty"),
	qualification: z.string().min(1, "Qualification is required"),
	experience: z
		.number()
		.min(0, "Experience must be at least 0 years")
		.max(50, "Experience cannot exceed 50 years"),
	consultationFee: z
		.number()
		.min(0, "Consultation fee must be at least 0")
		.max(10000000, "Consultation fee cannot exceed 10,000,000 VND"),
	isAvailable: z.boolean(),
	dateOfBirth: z.string().optional().or(z.literal("")),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

interface DoctorModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	doctor?: {
		id: string;
		fullName: string;
		email: string;
		phone?: string;
		specialty: string;
		qualification?: string;
		experience: number;
		consultationFee?: number;
		isAvailable: boolean;
		dateOfBirth?: string;
	} | null;
}

// Mock specialties data
const specialties = [
	"Cardiology",
	"Dermatology",
	"Emergency Medicine",
	"Endocrinology",
	"Gastroenterology",
	"General Medicine",
	"Neurology",
	"Obstetrics & Gynecology",
	"Orthopedics",
	"Pediatrics",
	"Psychiatry",
	"Pulmonology",
	"Radiology",
	"Surgery",
	"Urology",
];

export function DoctorModal({
	open,
	onOpenChange,
	doctor,
}: Readonly<DoctorModalProps>) {
	const createDoctorMutation = useCreateDoctor();
	const updateDoctorMutation = useUpdateDoctor();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const isEditing = !!doctor;

	const form = useForm<DoctorFormValues>({
		resolver: zodResolver(doctorFormSchema),
		mode: "onChange",
		defaultValues: {
			fullName: doctor?.fullName || "",
			email: doctor?.email || "",
			password: "",
			phone: doctor?.phone || "",
			specialty: doctor?.specialty || "",
			qualification: doctor?.qualification || "",
			experience: doctor?.experience || 0,
			consultationFee: doctor?.consultationFee || 0,
			isAvailable: doctor?.isAvailable ?? true,
			dateOfBirth: doctor?.dateOfBirth || "",
		},
	});

	useEffect(() => {
		if (doctor) {
			form.reset({
				fullName: doctor.fullName,
				email: doctor.email,
				password: "",
				phone: doctor.phone || "",
				specialty: doctor.specialty,
				qualification: doctor.qualification || "",
				experience: doctor.experience,
				consultationFee: doctor.consultationFee || 0,
				isAvailable: doctor.isAvailable,
				dateOfBirth: doctor.dateOfBirth || "",
			});
		} else {
			form.reset({
				fullName: "",
				email: "",
				password: "",
				phone: "",
				specialty: "",
				experience: 0,
				consultationFee: 0,
				isAvailable: true,
				dateOfBirth: "",
			});
		}
	}, [doctor, form]);

	// Helper functions to convert form values to API format
	const convertDateValue = (dateString?: string): Date | null => {
		if (!dateString || dateString === "") return null;
		return new Date(dateString);
	};

	const createUpdateData = (values: DoctorFormValues): UpdateDoctorRequest => {
		return {
			fullName: values.fullName,
			email: values.email,
			specialty: values.specialty,
			qualification: values.qualification,
			experience: values.experience,
			consultationFee: values.consultationFee,
			isAvailable: values.isAvailable,
			phone: values.phone && values.phone.trim() !== "" ? values.phone : null,
			dateOfBirth: convertDateValue(values.dateOfBirth),
		};
	};

	const createCreateData = (values: DoctorFormValues): CreateDoctorRequest => {
		return {
			fullName: values.fullName,
			email: values.email,
			password: values.password,
			phone: values.phone && values.phone.trim() !== "" ? values.phone : null,
			isMale: values.isMale === "" ? null : values.isMale === "true",
			dateOfBirth: convertDateValue(values.dateOfBirth),
		};
	};

	const handleUpdateDoctor = async (values: DoctorFormValues) => {
		if (!doctor) return;

		const updateData = createUpdateData(values);
		await updateDoctorMutation.mutateAsync({
			id: doctor.id,
			data: updateData,
		});

		toast.success("Doctor updated successfully", {
			description: `Dr. ${values.fullName} has been updated.`,
		});
	};

	const handleCreateDoctor = async (values: DoctorFormValues) => {
		const createData = createCreateData(values);
		await createDoctorMutation.mutateAsync(createData);

		toast.success("Doctor created successfully", {
			description: `Dr. ${values.fullName} has been added to the system.`,
		});
	};

	const onSubmit = async (values: DoctorFormValues) => {
		setIsLoading(true);
		try {
			if (isEditing) {
				await handleUpdateDoctor(values);
			} else {
				await handleCreateDoctor(values);
			}
			handleClose();
		} catch (error: unknown) {
			console.error("Error managing doctor:", error);
			const action = isEditing ? "update" : "create";
			toast.error(`Failed to ${action} doctor`, {
				description: "Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		void form.handleSubmit(onSubmit)(e);
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	const getPasswordLabel = () => {
		return isEditing
			? "New Password (leave blank to keep current)"
			: "Password *";
	};

	const getSubmitButtonText = () => {
		if (isLoading) {
			return isEditing ? "Updating..." : "Creating...";
		}
		return isEditing ? "Update Doctor" : "Create Doctor";
	};

	const getDialogTitle = () => {
		return isEditing ? "Edit Doctor Account" : "Create Doctor Account";
	};

	const getDialogDescription = () => {
		return isEditing
			? "Update the doctor account information below."
			: "Fill in the information below to create a new doctor account.";
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Stethoscope className="h-5 w-5" />
						{getDialogTitle()}
					</DialogTitle>
					<DialogDescription>{getDialogDescription()}</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Personal Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Personal Information</h3>

							{/* Full Name */}
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name *</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Dr. Nguyen Van A" />
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
										<FormLabel>Email Address *</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="email"
												placeholder="doctor@medicalink.com"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{getPasswordLabel()}</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													{...field}
													type={showPassword ? "text" : "password"}
													placeholder="Enter password"
													className="pr-10"
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Phone & Date of Birth */}
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input {...field} placeholder="+84 901 234 567" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="dateOfBirth"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Date of Birth</FormLabel>
											<FormControl>
												<Input {...field} type="date" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Professional Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">
								Professional Information
							</h3>

							{/* Specialty */}
							<FormField
								control={form.control}
								name="specialty"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Specialty *</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select specialty" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{specialties.map((specialty) => (
													<SelectItem key={specialty} value={specialty}>
														{specialty}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Qualification */}
							<FormField
								control={form.control}
								name="qualification"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Qualification *</FormLabel>
										<FormControl>
											<Input {...field} placeholder="MD, PhD" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Experience & Consultation Fee */}
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="experience"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Experience (years) *</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="number"
													placeholder="10"
													min="0"
													max="50"
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="consultationFee"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Consultation Fee (VND) *</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="number"
													placeholder="500000"
													min="0"
													max="10000000"
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Availability */}
							<FormField
								control={form.control}
								name="isAvailable"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-y-0 space-x-3">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Available for consultations</FormLabel>
											<p className="text-muted-foreground text-sm">
												Check this if the doctor is currently available for
												appointments.
											</p>
										</div>
									</FormItem>
								)}
							/>
						</div>

						{/* Actions */}
						<div className="flex justify-end space-x-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={handleClose}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{getSubmitButtonText()}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
