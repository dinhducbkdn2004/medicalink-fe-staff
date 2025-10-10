import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	ArrowLeft,
	User,
	Calendar,
	Phone,
	Mail,
	Save,
	Stethoscope,
} from "lucide-react";

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
import { useCreateDoctor } from "@/hooks/api/useDoctors";
import type { CreateDoctorRequest } from "@/types";

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

export function DoctorCreatePage() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CreateFormValues>({
		resolver: zodResolver(createFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			phone: "",
			isMale: true,
			dateOfBirth: "",
		},
	});

	const createDoctorMutation = useCreateDoctor();

	const onSubmit = async (values: CreateFormValues) => {
		try {
			setIsSubmitting(true);

			const createData: CreateDoctorRequest = {
				email: values.email,
				password: values.password,
				fullName: values.fullName,
				dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth) : null,
				isMale: values.isMale ?? null,
				phone: values.phone && values.phone.trim() !== "" ? values.phone : null,
			};

			await createDoctorMutation.mutateAsync(createData);
			toast.success("Doctor created successfully");

			// Navigate back to doctor list
			void navigate({ to: "/super-admin/doctor-accounts" });
		} catch (error: any) {
			toast.error(error.message || "Failed to create doctor");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		void navigate({ to: "/super-admin/doctor-accounts" });
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
					Back to Doctor List
				</Button>
			</div>

			<Card className="max-w-3xl">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Stethoscope className="h-5 w-5" />
						Create New Doctor Account
					</CardTitle>
					<CardDescription>
						Create a new doctor account with medical access. Required fields are
						marked with an asterisk (*). Additional information can be added now
						or later when editing the profile.
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
													<Input
														placeholder="Enter doctor's full name"
														{...field}
													/>
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
							</div>

							{/* Personal Information */}
							<div className="space-y-4">
								<div className="border-t pt-4">
									<h3 className="mb-4 text-lg font-medium">
										Personal Information (Optional)
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
											Create Doctor
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
