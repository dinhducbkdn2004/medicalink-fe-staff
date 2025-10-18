import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Edit3,
	Save,
	X,
	Trash2,
	Building2,
	MapPin,
	Phone,
	Calendar,
	Clock,
	AlertTriangle,
	CheckCircle,
	ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
	useWorkLocation,
	useUpdateWorkLocation,
	useDeleteWorkLocation,
} from "@/hooks/api/useLocations";
import { toast } from "sonner";

const workLocationSchema = z.object({
	name: z.string().min(1, "Location name is required"),
	address: z.string().optional(),
	phone: z.string().optional(),
});

type WorkLocationFormData = z.infer<typeof workLocationSchema>;

export function WorkLocationViewEditPage() {
	const { id } = useParams({ from: "/super-admin/work-locations/$id" });
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// State management
	const [isEditMode, setIsEditMode] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// API hooks
	const { data: workLocation, isLoading, error } = useWorkLocation(id);
	const updateWorkLocationMutation = useUpdateWorkLocation();
	const deleteWorkLocationMutation = useDeleteWorkLocation();

	// Form setup
	const form = useForm<WorkLocationFormData>({
		resolver: zodResolver(workLocationSchema),
		defaultValues: {
			name: "",
			address: "",
			phone: "",
		},
	});

	// Update form when work location data loads
	useEffect(() => {
		if (workLocation) {
			form.reset({
				name: workLocation.name || "",
				address: workLocation.address || "",
				phone: workLocation.phone || "",
			});
		}
	}, [workLocation, form]);

	// Handlers
	const handleSave = async (data: WorkLocationFormData) => {
		try {
			// Filter out undefined values
			const cleanData = Object.fromEntries(
				Object.entries(data).filter(
					([_, value]) => value !== undefined && value !== ""
				)
			);

			await updateWorkLocationMutation.mutateAsync({
				id,
				data: cleanData,
			});

			// Update cache immediately
			queryClient.setQueryData(["workLocation", id], (oldData: any) => ({
				...oldData,
				...data,
			}));

			setIsEditMode(false);
			toast.success("Work location updated successfully");
		} catch {
			toast.error("Failed to update work location");
		}
	};

	const handleCancel = () => {
		if (workLocation) {
			form.reset({
				name: workLocation.name || "",
				address: workLocation.address || "",
				phone: workLocation.phone || "",
			});
		}
		setIsEditMode(false);
	};

	const handleDelete = async () => {
		try {
			await deleteWorkLocationMutation.mutateAsync(id);
			toast.success("Work location deleted successfully");
			navigate({ to: "/super-admin/work-locations" });
		} catch {
			toast.error("Failed to delete work location");
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50/30">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="space-y-6">
						<div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
						<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
							<div className="lg:col-span-4">
								<Card>
									<CardContent className="p-6">
										<div className="space-y-4">
											<div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-gray-200" />
											<div className="h-6 animate-pulse rounded bg-gray-200" />
											<div className="h-4 animate-pulse rounded bg-gray-200" />
										</div>
									</CardContent>
								</Card>
							</div>
							<div className="lg:col-span-8">
								<Card>
									<CardContent className="p-6">
										<div className="space-y-4">
											<div className="h-6 animate-pulse rounded bg-gray-200" />
											<div className="h-4 animate-pulse rounded bg-gray-200" />
											<div className="h-4 animate-pulse rounded bg-gray-200" />
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !workLocation) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50/30">
				<Card className="w-full max-w-md">
					<CardContent className="p-6 text-center">
						<AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
						<h3 className="mb-2 text-lg font-semibold text-gray-900">
							Work Location Not Found
						</h3>
						<p className="mb-4 text-gray-600">
							The work location you're looking for doesn't exist or has been
							deleted.
						</p>
						<Button
							onClick={() => navigate({ to: "/super-admin/work-locations" })}
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Work Locations
						</Button>
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
											disabled={updateWorkLocationMutation.isPending}
											className="bg-primary gap-2"
										>
											{updateWorkLocationMutation.isPending ? (
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
											onClick={() => setIsDeleteDialogOpen(true)}
											className="gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
										>
											<Trash2 className="h-4 w-4" />
											<span className="hidden sm:inline">Delete</span>
										</Button>
										<Button
											onClick={() => setIsEditMode(true)}
											className="gap-2"
										>
											<Edit3 className="h-4 w-4" />
											<span className="hidden sm:inline">Edit Location</span>
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
						{/* Sidebar */}
						<div className="lg:col-span-4">
							<div className="space-y-6">
								{/* Profile Card */}
								<Card className="overflow-hidden">
									<div className="bg-primary px-6 py-8">
										<div className="flex flex-col items-center space-y-4">
											<div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/20 backdrop-blur-sm">
												<Building2 className="h-10 w-10 text-white" />
											</div>
											<div className="text-center">
												<h3 className="text-xl font-bold text-white">
													{workLocation.name}
												</h3>
												<Badge
													variant="secondary"
													className="mt-3 border-white/30 bg-white/20 text-white backdrop-blur-sm"
												>
													<CheckCircle className="mr-1 h-3 w-3" />
													{workLocation.isActive ? "Active" : "Inactive"}
												</Badge>
											</div>
										</div>
									</div>
									<CardContent className="p-6">
										{/* Quick Info */}
										<div className="space-y-4">
											<div className="flex items-center space-x-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
													<Building2 className="h-4 w-4 text-green-600" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900">
														Location Name
													</p>
													<p className="truncate text-sm text-gray-500">
														{workLocation.name}
													</p>
												</div>
											</div>
											<div className="flex items-center space-x-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
													<MapPin className="h-4 w-4 text-blue-600" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900">
														Address
													</p>
													<p className="text-sm text-gray-500">
														{workLocation.address}
													</p>
												</div>
											</div>
											{workLocation.phone && (
												<div className="flex items-center space-x-3">
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
														<Phone className="h-4 w-4 text-purple-600" />
													</div>
													<div className="min-w-0 flex-1">
														<p className="text-sm font-medium text-gray-900">
															Phone
														</p>
														<p className="text-sm text-gray-500">
															{workLocation.phone}
														</p>
													</div>
												</div>
											)}
											<div className="flex items-center space-x-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
													<CheckCircle className="h-4 w-4 text-gray-600" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900">
														Status
													</p>
													<Badge
														variant={
															workLocation.isActive ? "default" : "secondary"
														}
													>
														{workLocation.isActive ? "Active" : "Inactive"}
													</Badge>
												</div>
											</div>
											<div className="flex items-center space-x-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
													<Calendar className="h-4 w-4 text-indigo-600" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900">
														Created
													</p>
													<p className="text-sm text-gray-500">
														{new Date(
															workLocation.createdAt!
														).toLocaleDateString()}
													</p>
												</div>
											</div>
											{workLocation.updatedAt && (
												<div className="flex items-center space-x-3">
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
														<Clock className="h-4 w-4 text-yellow-600" />
													</div>
													<div className="min-w-0 flex-1">
														<p className="text-sm font-medium text-gray-900">
															Last Updated
														</p>
														<p className="text-sm text-gray-500">
															{new Date(
																workLocation.updatedAt!
															).toLocaleDateString()}
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
										<CardHeader className="border-b bg-gray-50/50">
											<CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
												<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
													<Building2 className="h-4 w-4 text-green-600" />
												</div>
												Location Information
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label className="field-label">Location Name</Label>
													{isEditMode ? (
														<FormField
															control={form.control}
															name="name"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Input
																			{...field}
																			placeholder="Enter location name"
																			className="input-text"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													) : (
														<div
															className={`rounded-lg border p-3 ${workLocation.name ? "bg-muted/50" : "border-orange-200 bg-orange-50"}`}
														>
															<p
																className={`text-base font-medium ${workLocation.name ? "text-muted-foreground" : "text-orange-600 italic"}`}
															>
																{workLocation.name ||
																	"⚠️ Location name is required"}
															</p>
														</div>
													)}
												</div>
												<div className="space-y-2">
													<Label className="field-label">Phone</Label>
													{isEditMode ? (
														<FormField
															control={form.control}
															name="phone"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Input
																			{...field}
																			placeholder="Enter phone number"
																			className="input-text"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													) : (
														<div
															className={`rounded-lg border p-3 ${workLocation.phone ? "bg-muted/50" : "border-yellow-200 bg-yellow-50"}`}
														>
															<p
																className={`text-base ${workLocation.phone ? "text-muted-foreground" : "text-yellow-600 italic"}`}
															>
																{workLocation.phone ||
																	"💡 Consider adding a phone number"}
															</p>
														</div>
													)}
												</div>
											</div>
											<div className="space-y-2">
												<Label className="field-label">Address</Label>
												{isEditMode ? (
													<FormField
														control={form.control}
														name="address"
														render={({ field }) => (
															<FormItem>
																<FormControl>
																	<Textarea
																		{...field}
																		placeholder="Enter full address"
																		className="input-text min-h-[80px]"
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												) : (
													<div
														className={`rounded-lg border p-3 ${workLocation.address ? "bg-muted/50" : "border-yellow-200 bg-yellow-50"}`}
													>
														<p
															className={`text-base ${workLocation.address ? "text-muted-foreground" : "text-yellow-600 italic"}`}
														>
															{workLocation.address ||
																"💡 Consider adding an address"}
														</p>
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Work Location</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{workLocation?.name}"? This
							action cannot be undone and may affect doctors associated with
							this work location.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={deleteWorkLocationMutation.isPending}
							className="bg-red-600 hover:bg-red-700"
						>
							{deleteWorkLocationMutation.isPending ? (
								<Spinner size={16} />
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
