import { useParams, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Mail,
	Phone,
	Calendar,
	User,
	Shield,
	Edit3,
	Clock,
	Save,
	X,
	Key,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useStaffs, useUpdateStaff } from "@/hooks/api/useStaffs";
import { Spinner } from "@/components/ui/spinner";
import { AdminProfileSkeleton } from "@/components/ui/admin-profile-skeleton";
import { AdminChangePasswordModal } from "@/components/modals/AdminChangePasswordModal";
import type { UpdateStaffRequest } from "@/types";

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
	role: z.enum(["ADMIN", "SUPER_ADMIN"]),
	isMale: z.boolean().optional(),
	dateOfBirth: z.string().optional().or(z.literal("")),
});

type EditFormValues = z.infer<typeof editFormSchema>;

export function AdminAccountViewPage() {
	const params = useParams({ from: "/super-admin/admin-accounts/$id/view" });
	const search = useSearch({
		from: "/super-admin/admin-accounts/$id/view",
	}) as any;
	const id = params.id;

	const isInitialEditMode = search?.mode === "edit";
	const [isEditMode, setIsEditMode] = useState(isInitialEditMode);
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

	const { data: staffsData, isLoading } = useStaffs({
		page: 1,
		limit: 100,
	});

	const admin = staffsData?.data?.find((staff) => staff.id === id);
	const updateStaffMutation = useUpdateStaff();

	const form = useForm<EditFormValues>({
		resolver: zodResolver(editFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			role: "ADMIN",
			isMale: true,
			dateOfBirth: "",
		},
	});

	useEffect(() => {
		if (admin) {
			form.reset({
				fullName: admin.fullName,
				email: admin.email,
				phone: admin.phone || "",
				role: admin.role as "ADMIN" | "SUPER_ADMIN",
				isMale: admin.isMale ?? true,
				dateOfBirth: admin.dateOfBirth
					? new Date(admin.dateOfBirth).toISOString().split("T")[0]
					: "",
			});
		}
	}, [admin, form]);

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const handleSave = async (values: EditFormValues) => {
		if (!admin) return;

		try {
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
			const adminDob = admin.dateOfBirth
				? new Date(admin.dateOfBirth).toISOString().split("T")[0]
				: "";
			if (values.dateOfBirth !== adminDob) {
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
				setIsEditMode(false);
			} else {
				toast.info("No changes detected");
				setIsEditMode(false);
			}
		} catch (error: any) {
			toast.error(error.message || "Failed to update admin profile");
		}
	};

	const handleCancel = () => {
		if (admin) {
			form.reset({
				fullName: admin.fullName,
				email: admin.email,
				phone: admin.phone || "",
				role: admin.role as "ADMIN" | "SUPER_ADMIN",
				isMale: admin.isMale ?? true,
				dateOfBirth: admin.dateOfBirth
					? new Date(admin.dateOfBirth).toISOString().split("T")[0]
					: "",
			});
		}
		setIsEditMode(false);
	};

	if (isLoading) {
		return <AdminProfileSkeleton />;
	}

	if (!admin) {
		return (
			<div className="flex flex-1 flex-col gap-4">
				<div className="flex items-center gap-2">
					<h1 className="page-title">Admin Not Found</h1>
				</div>
				<Card>
					<CardContent className="p-6">
						<p className="body-text text-muted-foreground">
							The admin account you're looking for doesn't exist or has been
							deleted.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<>
			<div className="min-h-screen bg-gray-50/30">
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
											onClick={form.handleSubmit(handleSave)}
											disabled={updateStaffMutation.isPending}
											className="gap-2"
										>
											{updateStaffMutation.isPending ? (
												<Spinner size={16} />
											) : (
												<Save className="h-4 w-4" />
											)}
											<span className="hidden sm:inline">Save Changes</span>
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
											onClick={() => setIsEditMode(true)}
											className="gap-2"
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

				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					{/* Profile Content */}
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
						{/* Enhanced Sidebar */}
						<div className="lg:col-span-4">
							<div className="space-y-6">
								{/* Profile Card */}
								<Card className="overflow-hidden">
									<div className="bg-primary px-6 py-8">
										<div className="flex flex-col items-center space-y-4">
											<Avatar className="h-20 w-20 ring-4 ring-white/20">
												<AvatarFallback className="bg-white/20 text-xl font-bold text-white backdrop-blur-sm">
													{getInitials(admin.fullName)}
												</AvatarFallback>
											</Avatar>
											<div className="text-center">
												<h3 className="text-xl font-bold text-white">
													{admin.fullName}
												</h3>
												<p className="text-sm text-blue-100">{admin.email}</p>
												<Badge
													variant={
														admin.role === "SUPER_ADMIN"
															? "secondary"
															: "outline"
													}
													className="mt-3 border-white/30 bg-white/20 text-white backdrop-blur-sm"
												>
													<Shield className="mr-1 h-3 w-3" />
													{admin.role === "SUPER_ADMIN"
														? "Super Admin"
														: "Administrator"}
												</Badge>
											</div>
										</div>
									</div>
									<CardContent className="p-6">
										{/* Quick Info */}
										<div className="space-y-4">
											<div className="flex items-center space-x-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
													<Mail className="h-4 w-4 text-blue-600" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900">
														Email
													</p>
													<p className="truncate text-sm text-gray-500">
														{admin.email}
													</p>
												</div>
											</div>
											{admin.phone && (
												<div className="flex items-center space-x-3">
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
														<Phone className="h-4 w-4 text-green-600" />
													</div>
													<div className="min-w-0 flex-1">
														<p className="text-sm font-medium text-gray-900">
															Phone
														</p>
														<p className="text-sm text-gray-500">
															{admin.phone}
														</p>
													</div>
												</div>
											)}
											{admin.dateOfBirth && (
												<div className="flex items-center space-x-3">
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
														<Calendar className="h-4 w-4 text-purple-600" />
													</div>
													<div className="min-w-0 flex-1">
														<p className="text-sm font-medium text-gray-900">
															Date of Birth
														</p>
														<p className="text-sm text-gray-500">
															{new Date(admin.dateOfBirth).toLocaleDateString()}
														</p>
													</div>
												</div>
											)}
											{admin.isMale !== null && admin.isMale !== undefined && (
												<div className="flex items-center space-x-3">
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
														<User className="h-4 w-4 text-orange-600" />
													</div>
													<div className="min-w-0 flex-1">
														<p className="text-sm font-medium text-gray-900">
															Gender
														</p>
														<p className="text-sm text-gray-500">
															{admin.isMale ? "Male" : "Female"}
														</p>
													</div>
												</div>
											)}
										</div>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Main Content */}
						<div className="lg:col-span-8">
							<Form {...form}>
								<form className="space-y-6">
									{/* Basic Information */}
									<Card className="shadow-sm">
										<CardHeader className="border-b bg-gray-50/50 px-6 py-4">
											<CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
												<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
													<User className="h-4 w-4 text-blue-600" />
												</div>
												Basic Information
											</CardTitle>
											<CardDescription className="text-sm text-gray-600">
												Personal and contact information
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4 px-6 py-6">
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<label className="field-label">Full Name</label>
													{isEditMode ? (
														<FormField
															control={form.control}
															name="fullName"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Input {...field} className="input-text" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													) : (
														<p className="data-value">{admin.fullName}</p>
													)}
												</div>
												<div className="space-y-2">
													<label className="field-label">Email</label>
													{isEditMode ? (
														<FormField
															control={form.control}
															name="email"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Input
																			type="email"
																			{...field}
																			className="input-text"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													) : (
														<p className="data-value">{admin.email}</p>
													)}
												</div>
												<div className="space-y-2">
													<label className="field-label">Phone</label>
													{isEditMode ? (
														<FormField
															control={form.control}
															name="phone"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Input {...field} className="input-text" />
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													) : (
														<p className="data-value">
															{admin.phone || (
																<span className="text-muted-foreground italic">
																	Not provided
																</span>
															)}
														</p>
													)}
												</div>
												<div className="space-y-2">
													<label className="field-label">Role</label>
													{isEditMode ? (
														<FormField
															control={form.control}
															name="role"
															render={({ field }) => (
																<FormItem>
																	<Select
																		onValueChange={field.onChange}
																		value={field.value}
																	>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="ADMIN">
																				Administrator
																			</SelectItem>
																			<SelectItem value="SUPER_ADMIN">
																				Super Administrator
																			</SelectItem>
																		</SelectContent>
																	</Select>
																	<FormMessage />
																</FormItem>
															)}
														/>
													) : (
														<p className="data-value">
															{admin.role === "SUPER_ADMIN"
																? "Super Administrator"
																: "Administrator"}
														</p>
													)}
												</div>
											</div>
										</CardContent>
									</Card>

									{/* Personal Information */}
									<Card>
										<CardHeader>
											<CardTitle className="card-title flex items-center gap-2">
												<Calendar className="h-4 w-4" />
												Personal Information
											</CardTitle>
											<CardDescription className="description-text">
												Personal details and demographics
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<label className="field-label">Date of Birth</label>
													{isEditMode ? (
														<FormField
															control={form.control}
															name="dateOfBirth"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Input
																			type="date"
																			{...field}
																			className="input-text"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													) : (
														<p className="data-value">
															{admin.dateOfBirth ? (
																new Date(admin.dateOfBirth).toLocaleDateString()
															) : (
																<span className="text-muted-foreground italic">
																	Not provided
																</span>
															)}
														</p>
													)}
												</div>
												<div className="space-y-2">
													<label className="field-label">Gender</label>
													{isEditMode ? (
														<FormField
															control={form.control}
															name="isMale"
															render={({ field }) => (
																<FormItem>
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
																				<SelectValue />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="true">Male</SelectItem>
																			<SelectItem value="false">
																				Female
																			</SelectItem>
																		</SelectContent>
																	</Select>
																	<FormMessage />
																</FormItem>
															)}
														/>
													) : (
														<p className="data-value">
															{admin.isMale ? "Male" : "Female"}
														</p>
													)}
												</div>
											</div>
										</CardContent>
									</Card>

									{/* Account Activity */}
									<Card className="shadow-sm">
										<CardHeader className="border-b bg-gray-50/50 px-6 py-4">
											<CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
												<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
													<Clock className="h-4 w-4 text-green-600" />
												</div>
												Account Activity
											</CardTitle>
											<CardDescription className="text-sm text-gray-600">
												Account creation and modification history
											</CardDescription>
										</CardHeader>
										<CardContent className="px-6 py-6">
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<label className="data-label">Created At</label>
													<p className="data-value">
														{new Date(admin.createdAt).toLocaleDateString()}
													</p>
													<p className="small-text">
														{new Date(admin.createdAt).toLocaleTimeString()}
													</p>
												</div>
												<div className="space-y-2">
													<label className="data-label">Last Updated</label>
													<p className="data-value">
														{new Date(admin.updatedAt).toLocaleDateString()}
													</p>
													<p className="small-text">
														{new Date(admin.updatedAt).toLocaleTimeString()}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</div>

			{/* Change Password Modal */}
			<AdminChangePasswordModal
				open={isChangePasswordOpen}
				onOpenChange={setIsChangePasswordOpen}
				user={
					admin
						? {
								id: admin.id,
								fullName: admin.fullName,
								email: admin.email,
							}
						: null
				}
				userType="admin"
			/>
		</>
	);
}
