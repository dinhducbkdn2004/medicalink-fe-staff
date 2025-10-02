import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, User, Calendar, Phone, Mail } from "lucide-react";

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
import type { CreateDoctorRequest, UpdateDoctorRequest } from "@/types";

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
	isMale: z.boolean().optional(),
	dateOfBirth: z.string().optional().or(z.literal("")),
});

const createFormSchema = profileFormSchema.extend({
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
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
		isMale?: boolean;
		dateOfBirth?: string;
	} | null;
}

export function DoctorProfileModal({
	open,
	onOpenChange,
	doctor,
}: Readonly<DoctorProfileModalProps>) {
	const isEditing = Boolean(doctor);
	const isCreating = !isEditing;

	const form = useForm<ProfileFormValues | CreateFormValues>({
		resolver: zodResolver(isCreating ? createFormSchema : profileFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			isMale: true,
			dateOfBirth: "",
			...(isCreating ? { password: "" } : {}),
		},
	});

	const createDoctorMutation = useCreateDoctor();
	const updateDoctorMutation = useUpdateDoctor();

	useEffect(() => {
		if (open) {
			if (doctor) {
				form.reset({
					fullName: doctor.fullName,
					email: doctor.email,
					phone: doctor.phone || "",
					isMale: doctor.isMale ?? true,
					dateOfBirth: doctor.dateOfBirth || "",
				});
				form.unregister("password");
			} else {
				form.reset({
					fullName: "",
					email: "",
					phone: "",
					isMale: true,
					dateOfBirth: "",
					...(isCreating ? { password: "" } : {}),
				});
			}
		}
	}, [doctor, open, form, isCreating]);

	const onSubmit = async (values: ProfileFormValues | CreateFormValues) => {
		try {
			if (isEditing && doctor) {
				const updateData: Partial<UpdateDoctorRequest> = {};

				if (values.fullName !== doctor.fullName) {
					updateData.fullName = values.fullName;
				}
				if (values.email !== doctor.email) {
					updateData.email = values.email;
				}
				if (values.phone !== (doctor.phone || "")) {
					updateData.phone =
						values.phone && values.phone.trim() !== "" ? values.phone : null;
				}
				if (values.isMale !== doctor.isMale) {
					updateData.isMale = values.isMale ?? null;
				}
				if (values.dateOfBirth !== (doctor.dateOfBirth || "")) {
					updateData.dateOfBirth = values.dateOfBirth
						? new Date(values.dateOfBirth)
						: null;
				}

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
				const createData: CreateDoctorRequest = {
					fullName: values.fullName,
					email: values.email,
					password: (values as CreateFormValues).password,
					phone:
						values.phone && values.phone.trim() !== "" ? values.phone : null,
					isMale: values.isMale ?? null,
					dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth) : null,
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
