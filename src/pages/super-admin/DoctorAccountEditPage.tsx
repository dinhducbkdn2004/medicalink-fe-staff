import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	ArrowLeft,
	Save,
	User,
	Mail,
	Phone,
	Calendar,
	Eye,
	AlertCircle,
	Key,
	Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDoctors, useUpdateDoctor } from "@/hooks/api/useDoctors";
import type { UpdateDoctorRequest } from "@/types";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";

const editFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Full name must be at least 2 characters")
		.max(100, "Full name must not exceed 100 characters"),
	email: z.string().email("Please enter a valid email address"),
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

type EditFormValues = z.infer<typeof editFormSchema>;

export function DoctorAccountEditPage() {
	const params = useParams({ from: "/super-admin/doctor-accounts/$id/edit" });
	const id = params.id;
	const navigate = useNavigate();
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

	// Fetch doctor data
	const { data: doctorsData, isLoading } = useDoctors({
		page: 1,
		limit: 100,
	});

	const doctor = doctorsData?.data?.find((d) => d.id === id);
	const updateDoctorMutation = useUpdateDoctor();

	const form = useForm<EditFormValues>({
		resolver: zodResolver(editFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			isMale: true,
			dateOfBirth: "",
		},
	});

	// Populate form when doctor data is loaded
	useEffect(() => {
		if (doctor) {
			form.reset({
				fullName: doctor.fullName,
				email: doctor.email,
				phone: doctor.phone || "",
				isMale: doctor.isMale ?? true,
				dateOfBirth: doctor.dateOfBirth
					? new Date(doctor.dateOfBirth).toISOString().split("T")[0]
					: "",
			});
		}
	}, [doctor, form]);

	const handleBack = () => {
		void navigate({ to: "/super-admin/doctor-accounts" });
	};

	const handleViewProfile = () => {
		void navigate({
			to: "/super-admin/doctor-accounts/$id/view",
			params: { id },
		});
	};

	const onSubmit = async (values: EditFormValues) => {
		if (!doctor) return;

		try {
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
				updateData.isMale = values.isMale || false;
			}
			const doctorDob = doctor.dateOfBirth
				? new Date(doctor.dateOfBirth).toISOString().split("T")[0]
				: "";
			if (values.dateOfBirth !== doctorDob) {
				updateData.dateOfBirth = values.dateOfBirth
					? new Date(values.dateOfBirth)
					: null;
			}

			if (Object.keys(updateData).length > 0) {
				await updateDoctorMutation.mutateAsync({
					id: doctor.id,
					data: updateData,
				});

				toast.success("Doctor profile updated successfully", {
					description: "The changes have been saved.",
				});

				// Navigate to view page after successful update
				void navigate({
					to: "/super-admin/doctor-accounts/$id/view",
					params: { id },
				});
			} else {
				toast.info("No changes detected");
			}
		} catch (error: any) {
			toast.error(error.message || "Failed to update doctor profile");
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-2xl font-bold">Loading...</h1>
				</div>
			</div>
		);
	}

	if (!doctor) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-2xl font-bold">Doctor Not Found</h1>
				</div>
				<Card>
					<CardContent className="p-6">
						<p className="text-muted-foreground">
							The doctor account you're looking for doesn't exist or has been
							deleted.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	const isSubmitting = updateDoctorMutation.isPending;

	return (
		<>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" onClick={handleBack}>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<div>
							<h1 className="text-xl font-semibold">Edit Doctor</h1>
							<p className="text-muted-foreground text-sm">
								Update doctor account information and details
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => setIsChangePasswordOpen(true)}
						>
							<Key className="mr-2 h-4 w-4" />
							Change Password
						</Button>
						<Button variant="outline" onClick={handleViewProfile}>
							<Eye className="mr-2 h-4 w-4" />
							View Profile
						</Button>
					</div>
				</div>

				{/* Warning Banner */}
				<div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950">
					<AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
					<div>
						<p className="text-sm font-medium text-amber-900 dark:text-amber-100">
							Important: Doctor Account
						</p>
						<p className="text-muted-foreground mt-0.5 text-xs">
							Changes to this account will affect appointment scheduling and
							patient care. Please verify all information before saving.
						</p>
					</div>
				</div>

				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							void form.handleSubmit(onSubmit)(e);
						}}
						className="space-y-4"
					>
						{/* Account Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<Stethoscope className="h-4 w-4" />
									Account Information
								</CardTitle>
								<CardDescription className="text-xs">
									Essential account details and contact information
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-4">
								<div className="grid gap-4 md:grid-cols-2">
									<FormField
										control={form.control}
										name="fullName"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-1.5 text-sm">
													<User className="h-3.5 w-3.5" />
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
												<FormLabel className="flex items-center gap-1.5 text-sm">
													<Mail className="h-3.5 w-3.5" />
													Email Address *
												</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="doctor@medicalink.com"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						{/* Personal Information Card */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<User className="h-4 w-4" />
									Personal Information
								</CardTitle>
								<CardDescription className="text-xs">
									Contact details and personal demographics
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 pt-4">
								<div className="grid gap-4 md:grid-cols-3">
									<FormField
										control={form.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-1.5 text-sm">
													<Phone className="h-3.5 w-3.5" />
													Phone Number
												</FormLabel>
												<FormControl>
													<Input placeholder="+84 xxx xxx xxx" {...field} />
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
												<FormLabel className="flex items-center gap-1.5 text-sm">
													<User className="h-3.5 w-3.5" />
													Gender
												</FormLabel>
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

									<FormField
										control={form.control}
										name="dateOfBirth"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex items-center gap-1.5 text-sm">
													<Calendar className="h-3.5 w-3.5" />
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
							</CardContent>
						</Card>

						{/* Action Buttons */}
						<div className="flex items-center justify-end gap-3 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={handleBack}
								disabled={isSubmitting}
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								<Save className="mr-2 h-4 w-4" />
								{isSubmitting ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>
				</Form>
			</div>

			{/* Change Password Modal */}
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
		</>
	);
}
