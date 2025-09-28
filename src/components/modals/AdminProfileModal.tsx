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
import { useCreateStaff, useUpdateStaff } from "@/hooks/api/useStaffs";
import type { CreateStaffRequest, UpdateStaffRequest } from "@/types";

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
	role: z.enum(["ADMIN", "SUPER_ADMIN"], {
		message: "Please select a role.",
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

interface AdminProfileModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	admin?: {
		id: string;
		fullName: string;
		email: string;
		phone?: string;
		role: string;
		isMale?: boolean;
		dateOfBirth?: string;
	} | null;
}

export function AdminProfileModal({
	open,
	onOpenChange,
	admin,
}: Readonly<AdminProfileModalProps>) {
	const isEditing = Boolean(admin);
	const isCreating = !isEditing;

	const form = useForm<ProfileFormValues | CreateFormValues>({
		resolver: zodResolver(isCreating ? createFormSchema : profileFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			role: "ADMIN",
			isMale: true,
			dateOfBirth: "",
			...(isCreating ? { password: "" } : {}),
		},
	});

	const createStaffMutation = useCreateStaff();
	const updateStaffMutation = useUpdateStaff();

	useEffect(() => {
		if (open) {
			if (admin) {
				form.reset({
					fullName: admin.fullName,
					email: admin.email,
					phone: admin.phone || "",
					role: admin.role as "ADMIN" | "SUPER_ADMIN",
					isMale: admin.isMale ?? true,
					dateOfBirth: admin.dateOfBirth || "",
				});
				form.unregister("password");
			} else {
				form.reset({
					fullName: "",
					email: "",
					phone: "",
					role: "ADMIN",
					isMale: true,
					dateOfBirth: "",
					...(isCreating ? { password: "" } : {}),
				});
			}
		}
	}, [admin, open, form, isCreating]);

	const onSubmit = async (values: ProfileFormValues | CreateFormValues) => {
		try {
			if (isEditing && admin) {
				const updateData: Partial<UpdateStaffRequest> = {};

				if (values.fullName !== admin.fullName) {
					updateData.fullName = values.fullName;
				}
				if (values.email !== admin.email) {
					updateData.email = values.email;
				}
				if (values.phone !== (admin.phone || "")) {
					updateData.phone = values.phone || undefined;
				}
				if (values.isMale !== admin.isMale) {
					updateData.isMale = values.isMale;
				}
				if (values.dateOfBirth !== (admin.dateOfBirth || "")) {
					updateData.dateOfBirth = values.dateOfBirth
						? new Date(values.dateOfBirth)
						: null;
				}

				if (Object.keys(updateData).length > 0) {
					await updateStaffMutation.mutateAsync({
						id: admin.id,
						data: updateData,
					});

					toast.success("Admin profile updated successfully");
				} else {
					toast.info("No changes detected");
				}
			} else {
				const createData: CreateStaffRequest = {
					fullName: values.fullName,
					email: values.email,
					password: (values as CreateFormValues).password,
					role: "ADMIN",
					isMale: values.isMale,
					dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth) : null,
				};

				if (values.phone) {
					createData.phone = values.phone;
				}

				await createStaffMutation.mutateAsync(createData);
				toast.success("Admin created successfully");
			}

			onOpenChange(false);
		} catch (error: any) {
			toast.error(
				error.message || `Failed to ${isEditing ? "update" : "create"} admin`
			);
		}
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	const isLoading =
		createStaffMutation.isPending || updateStaffMutation.isPending;

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
						{isEditing ? "Edit Admin Profile" : "Create New Admin"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update admin profile information (use 'Change Password' for password changes)"
							: "Create a new admin account with full access permissions"}
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

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role *</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="ADMIN">Admin</SelectItem>
												<SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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
								{(() => {
									if (isLoading) {
										return isEditing ? "Updating..." : "Creating...";
									}
									return isEditing ? "Update Profile" : "Create Admin";
								})()}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
