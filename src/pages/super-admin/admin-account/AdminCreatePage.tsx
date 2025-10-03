import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, User, Calendar, Phone, Mail, Save } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { useCreateStaff } from "@/hooks/api/useStaffs";
import type { CreateStaffRequest } from "@/types";

const createFormSchema = z.object({
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
	role: z.enum(["ADMIN", "SUPER_ADMIN"], {
		message: "Please select a role.",
	}),
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

type CreateFormValues = z.infer<typeof createFormSchema>;

export function AdminCreatePage() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CreateFormValues>({
		resolver: zodResolver(createFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			role: "ADMIN",
			phone: "",
			isMale: true,
			dateOfBirth: "",
		},
	});

	const createStaffMutation = useCreateStaff();

	const onSubmit = async (values: CreateFormValues) => {
		try {
			setIsSubmitting(true);

			const createData: CreateStaffRequest = {
				fullName: values.fullName,
				email: values.email,
				password: values.password,
				role: values.role,
				isMale: values.isMale,
				dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth) : null,
			};

			if (values.phone) {
				createData.phone = values.phone;
			}

			await createStaffMutation.mutateAsync(createData);
			toast.success("Admin created successfully");

			// Navigate back to admin list
			void navigate({ to: "/super-admin/admin-accounts" });
		} catch (error: any) {
			toast.error(error.message || "Failed to create admin");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		void navigate({ to: "/super-admin/admin-accounts" });
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="flex items-center gap-4">
				<Button
					variant="outline"
					size="sm"
					onClick={handleCancel}
					className="h-8"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Admin List
				</Button>
			</div>

			<Card className="max-w-3xl">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Create New Admin Account
					</CardTitle>
					<CardDescription>
						Create a new admin account. Required fields are marked with an
						asterisk (*). Additional information can be added now or later when
						editing the profile.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								void form.handleSubmit(onSubmit)(e);
							}}
							className="space-y-6"
						>
							{/* Required Information */}
							<div className="space-y-4">
								<h3 className="text-lg font-medium">Basic Information</h3>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
								</div>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

									<FormField
										control={form.control}
										name="role"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Role *</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select role" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="ADMIN">Admin</SelectItem>
														<SelectItem value="SUPER_ADMIN">
															Super Admin
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							{/* Optional Information */}
							<div className="space-y-4">
								<div className="border-t pt-4">
									<h3 className="mb-4 text-lg font-medium">
										Additional Information (Optional)
									</h3>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="flex items-center gap-2">
														<Phone className="h-4 w-4" />
														Phone Number
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Enter phone number"
															{...field}
														/>
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
															field.value === undefined
																? ""
																: String(field.value)
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
								</div>
							</div>

							{/* Form Actions */}
							<div className="flex justify-end gap-4 border-t pt-6">
								<Button
									type="button"
									variant="outline"
									onClick={handleCancel}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
											Creating...
										</>
									) : (
										<>
											<Save className="mr-2 h-4 w-4" />
											Create Admin
										</>
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
