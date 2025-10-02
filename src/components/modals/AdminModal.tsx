import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Eye, EyeOff } from "lucide-react";

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

const adminFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Full name must be at least 2 characters")
		.max(100, "Full name must not exceed 100 characters"),
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z.string().optional().or(z.literal("")),
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
	isMale: z.string().optional(),
	dateOfBirth: z.string().optional().or(z.literal("")),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

interface AdminModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	admin?: {
		id: string;
		fullName: string;
		email: string;
		phone?: string;
		role: string;
		dateOfBirth?: string;
	} | null;
}

export function AdminModal({
	open,
	onOpenChange,
	admin,
}: Readonly<AdminModalProps>) {
	const createStaffMutation = useCreateStaff();
	const updateStaffMutation = useUpdateStaff();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const isEditing = !!admin;

	const form = useForm<AdminFormValues>({
		resolver: zodResolver(adminFormSchema),
		defaultValues: {
			fullName: admin?.fullName || "",
			email: admin?.email || "",
			password: "",
			phone: admin?.phone || "",
			role: (admin?.role as "ADMIN" | "SUPER_ADMIN") || "ADMIN",
			dateOfBirth: admin?.dateOfBirth || "",
		},
	});

	useEffect(() => {
		if (admin) {
			form.reset({
				fullName: admin.fullName,
				email: admin.email,
				password: "",
				phone: admin.phone || "",
				role: admin.role as "ADMIN" | "SUPER_ADMIN",
				dateOfBirth: admin.dateOfBirth || "",
			});
		} else {
			form.reset({
				fullName: "",
				email: "",
				password: "",
				phone: "",
				role: "ADMIN",
				dateOfBirth: "",
			});
		}
	}, [admin, form]);

	const convertGenderValue = (isMaleString?: string): boolean | undefined => {
		if (isMaleString === "true") return true;
		if (isMaleString === "false") return false;
		return undefined;
	};

	const convertDateValue = (dateString?: string): Date | null => {
		if (!dateString) return null;
		return new Date(dateString);
	};

	const createUpdateData = (values: AdminFormValues): UpdateStaffRequest => {
		return {
			fullName: values.fullName,
			email: values.email,
			role: values.role as "ADMIN",
			phone: values.phone || undefined,
			isMale: convertGenderValue(values.isMale),
			dateOfBirth: convertDateValue(values.dateOfBirth),
		};
	};

	const createCreateData = (values: AdminFormValues): CreateStaffRequest => {
		return {
			fullName: values.fullName,
			email: values.email,
			password: values.password || "",
			role: values.role as "ADMIN",
			phone: values.phone || undefined,
			isMale: convertGenderValue(values.isMale),
			dateOfBirth: convertDateValue(values.dateOfBirth),
		};
	};

	const handleUpdateAdmin = async (values: AdminFormValues) => {
		if (!admin) return;

		const updateData = createUpdateData(values);
		await updateStaffMutation.mutateAsync({
			id: admin.id,
			data: updateData,
		});

		toast.success("Admin updated successfully", {
			description: `${values.fullName} has been updated.`,
		});
	};

	const handleCreateAdmin = async (values: AdminFormValues) => {
		const createData = createCreateData(values);
		await createStaffMutation.mutateAsync(createData);

		toast.success("Admin created successfully", {
			description: `${values.fullName} has been added to the system.`,
		});
	};

	const onSubmit = async (values: AdminFormValues) => {
		setIsLoading(true);
		try {
			if (isEditing) {
				await handleUpdateAdmin(values);
			} else {
				await handleCreateAdmin(values);
			}
			handleClose();
		} catch (error: unknown) {
			console.error("Error managing admin:", error);
			const action = isEditing ? "update" : "create";
			toast.error(`Failed to ${action} admin`, {
				description: "Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		void form.handleSubmit(onSubmit)(e);
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
		return isEditing ? "Update Admin" : "Create Admin";
	};

	const getDialogTitle = () => {
		return isEditing ? "Edit Admin Account" : "Create Admin Account";
	};

	const getDialogDescription = () => {
		return isEditing
			? "Update the admin account information below."
			: "Fill in the information below to create a new admin account.";
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<UserPlus className="h-5 w-5" />
						{getDialogTitle()}
					</DialogTitle>
					<DialogDescription>{getDialogDescription()}</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit} className="space-y-4">
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name *</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Enter full name" />
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
									<FormLabel>Email Address *</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											placeholder="Enter email address"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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

						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Enter phone number" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role *</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a role" />
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

						<FormField
							control={form.control}
							name="isMale"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Gender</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value || ""}
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

						<FormField
							control={form.control}
							name="dateOfBirth"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date of Birth</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="date"
											placeholder="Select date of birth"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
