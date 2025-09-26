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
		.email("Please enter a valid email address")
		.min(1, "Email is required"),
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
	specialty: z.string().min(1, "Please select a specialty"),
	qualification: z.string().min(1, "Qualification is required"),
	experience: z
		.number()
		.min(0, "Experience must be at least 0 years")
		.max(50, "Experience cannot exceed 50 years"),
	isAvailable: z.boolean().default(true),
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
		qualification: string;
		experience: number;
		consultationFee: number;
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

export function DoctorModal({ open, onOpenChange, doctor }: DoctorModalProps) {
	const createDoctorMutation = useCreateDoctor();
	const updateDoctorMutation = useUpdateDoctor();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const isEditing = !!doctor;

	const form = useForm<DoctorFormValues>({
		resolver: zodResolver(doctorFormSchema),
		defaultValues: {
			fullName: doctor?.fullName || "",
			email: doctor?.email || "",
			password: "",
			phone: doctor?.phone || "",
			specialty: doctor?.specialty || "",
			qualification: doctor?.qualification || "",
			experience: doctor?.experience || 0,
			isAvailable: doctor?.isAvailable ?? true,
			dateOfBirth: doctor?.dateOfBirth || "",
		},
	});

	// Reset form when doctor changes
	useEffect(() => {
		if (doctor) {
			form.reset({
				fullName: doctor.fullName,
				email: doctor.email,
				password: "",
				phone: doctor.phone || "",
				specialty: doctor.specialty,
				qualification: doctor.qualification,
				experience: doctor.experience,
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
				qualification: "",
				experience: 0,
				isAvailable: true,
				dateOfBirth: "",
			});
		}
	}, [doctor, form]);

	const onSubmit = async (values: DoctorFormValues) => {
		setIsLoading(true);
		try {
			if (isEditing && doctor) {
				// Update existing doctor
				const updateData: UpdateDoctorRequest = {
					fullName: values.fullName,
					email: values.email,
					specialty: values.specialty,
					qualification: values.qualification,
					experience: values.experience,
					consultationFee: values.consultationFee,
					isAvailable: values.isAvailable,
					phone: values.phone || undefined,
					dateOfBirth: values.dateOfBirth || undefined,
				};

				await updateDoctorMutation.mutateAsync({
					id: doctor.id,
					data: updateData,
				});
				toast.success("Doctor updated successfully", {
					description: `Dr. ${values.fullName} has been updated.`,
				});
			} else {
				// Create new doctor
				const createData: CreateDoctorRequest = {
					fullName: values.fullName,
					email: values.email,
					password: values.password,
					specialty: values.specialty,
					qualification: values.qualification,
					experience: values.experience,
					consultationFee: values.consultationFee,
					isAvailable: values.isAvailable,
					phone: values.phone || undefined,
					dateOfBirth: values.dateOfBirth || undefined,
				};

				await createDoctorMutation.mutateAsync(createData);
				toast.success("Doctor created successfully", {
					description: `Dr. ${values.fullName} has been added to the system.`,
				});
			}

			handleClose();
		} catch (error: unknown) {
			console.error("Error managing doctor:", error);
			toast.error(`Failed to ${isEditing ? "update" : "create"} doctor`, {
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

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Stethoscope className="h-5 w-5" />
						{isEditing ? "Edit Doctor Account" : "Create Doctor Account"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the doctor account information below."
							: "Fill in the information below to create a new doctor account."}
					</DialogDescription>
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
										<FormLabel>
											{isEditing
												? "New Password (leave blank to keep current)"
												: "Password *"}
										</FormLabel>
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
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
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
								{isLoading
									? isEditing
										? "Updating..."
										: "Creating..."
									: isEditing
										? "Update Doctor"
										: "Create Doctor"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
