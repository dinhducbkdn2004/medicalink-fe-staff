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
	Stethoscope,
	Calendar,
	Clock,
	AlertTriangle,
	CheckCircle,
	ArrowLeft,
	FileText,
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
	useSpecialty,
	useUpdateSpecialty,
	useDeleteSpecialty,
} from "@/hooks/api/useSpecialties";
import { InfoSectionsManager } from "@/components/specialty/InfoSectionsManager";
import { toast } from "sonner";

const specialtySchema = z.object({
	name: z.string().min(1, "Specialty name is required"),
	description: z.string().optional(),
});

type SpecialtyFormData = z.infer<typeof specialtySchema>;

export function SpecialtyViewEditPage() {
	const { id } = useParams({ from: "/super-admin/specialties/$id" });
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// State management
	const [isEditMode, setIsEditMode] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// API hooks
	const { data: specialty, isLoading, error } = useSpecialty(id);
	const updateSpecialtyMutation = useUpdateSpecialty();
	const deleteSpecialtyMutation = useDeleteSpecialty();

	// Form setup
	const form = useForm<SpecialtyFormData>({
		resolver: zodResolver(specialtySchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	// Update form when specialty data loads
	useEffect(() => {
		if (specialty) {
			form.reset({
				name: specialty.name || "",
				description: specialty.description || "",
			});
		}
	}, [specialty, form]);

	// Handlers
	const handleSave = async (data: SpecialtyFormData) => {
		try {
			await updateSpecialtyMutation.mutateAsync({
				id,
				data: {
					name: data.name,
					description: data.description || "",
				},
			});

			queryClient.setQueryData(["specialty", id], (oldData: any) => ({
				...oldData,
				...data,
			}));

			setIsEditMode(false);
			toast.success("Specialty updated successfully");
		} catch (error) {
			console.error("Error updating specialty:", error);
			toast.error(
				`Failed to update specialty: ${error instanceof Error ? error.message : "Unknown error occurred"}`
			);
		}
	};

	const handleCancel = () => {
		if (specialty) {
			form.reset({
				name: specialty.name || "",
				description: specialty.description || "",
			});
		}
		setIsEditMode(false);
	};

	const handleDelete = async () => {
		try {
			await deleteSpecialtyMutation.mutateAsync(id);
			toast.success("Specialty deleted successfully");
			navigate({ to: "/super-admin/specialties" });
		} catch (error) {
			console.error("Error deleting specialty:", error);
			toast.error(
				`Failed to delete specialty: ${error instanceof Error ? error.message : "Unknown error occurred"}`
			);
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

	if (error || !specialty) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50/30">
				<Card className="w-full max-w-md">
					<CardContent className="p-6 text-center">
						<AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
						<h3 className="mb-2 text-lg font-semibold text-gray-900">
							Specialty Not Found
						</h3>
						<p className="mb-4 text-gray-600">
							The specialty you're looking for doesn't exist or has been
							deleted.
						</p>
						<Button
							onClick={() => navigate({ to: "/super-admin/specialties" })}
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Specialties
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<>
			<div className="min-h-screen bg-gray-50/30">
				{/* Enhanced Header */}
				<div className="border-b border-gray-200 bg-white shadow-sm">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 items-center justify-between">
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
											disabled={updateSpecialtyMutation.isPending}
											className="gap-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
										>
											{updateSpecialtyMutation.isPending ? (
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
											className="gap-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
										>
											<Edit3 className="h-4 w-4" />
											<span className="hidden sm:inline">Edit Specialty</span>
										</Button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>

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

				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					{/* Profile Content */}
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
						{/* Sidebar */}
						<div className="lg:col-span-4">
							<div className="space-y-6">
								{/* Profile Card */}
								<Card className="overflow-hidden">
									<div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-8">
										<div className="flex flex-col items-center space-y-4">
											<div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/20 backdrop-blur-sm">
												<Stethoscope className="h-10 w-10 text-white" />
											</div>
											<div className="text-center">
												<h3 className="text-xl font-bold text-white">
													{specialty.name}
												</h3>
												<Badge
													variant="secondary"
													className="mt-3 border-white/30 bg-white/20 text-white backdrop-blur-sm"
												>
													<CheckCircle className="mr-1 h-3 w-3" />
													{specialty.isActive ? "Active" : "Inactive"}
												</Badge>
											</div>
										</div>
									</div>
									<CardContent className="p-6">
										{/* Quick Info */}
										<div className="space-y-4">
											<div className="flex items-center space-x-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
													<Stethoscope className="h-4 w-4 text-blue-600" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900">
														Specialty Name
													</p>
													<p className="truncate text-sm text-gray-500">
														{specialty.name}
													</p>
												</div>
											</div>
											<div className="flex items-center space-x-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
													<FileText className="h-4 w-4 text-green-600" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900">
														Info Sections
													</p>
													<p className="text-sm text-gray-500">
														{specialty.infoSectionsCount || 0} sections
													</p>
												</div>
											</div>
											<div className="flex items-center space-x-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
													<Calendar className="h-4 w-4 text-purple-600" />
												</div>
												<div className="min-w-0 flex-1">
													<p className="text-sm font-medium text-gray-900">
														Created
													</p>
													<p className="text-sm text-gray-500">
														{new Date(specialty.createdAt).toLocaleDateString()}
													</p>
												</div>
											</div>
											{specialty.updatedAt && (
												<div className="flex items-center space-x-3">
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
														<Clock className="h-4 w-4 text-orange-600" />
													</div>
													<div className="min-w-0 flex-1">
														<p className="text-sm font-medium text-gray-900">
															Last Updated
														</p>
														<p className="text-sm text-gray-500">
															{new Date(
																specialty.updatedAt
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
												<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
													<Stethoscope className="h-4 w-4 text-blue-600" />
												</div>
												Specialty Information
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-1 gap-4">
												<div className="space-y-2">
													<Label className="field-label">Specialty Name</Label>
													{isEditMode ? (
														<FormField
															control={form.control}
															name="name"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Input
																			{...field}
																			placeholder="Enter specialty name"
																			className="input-text"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													) : (
														<div
															className={`rounded-lg border p-3 ${specialty.name ? "bg-muted/50" : "border-orange-200 bg-orange-50"}`}
														>
															<p
																className={`text-base font-medium ${specialty.name ? "text-muted-foreground" : "text-orange-600 italic"}`}
															>
																{specialty.name ||
																	"⚠️ Specialty name is required"}
															</p>
														</div>
													)}
												</div>
												<div className="space-y-2">
													<Label className="field-label">Description</Label>
													{isEditMode ? (
														<FormField
															control={form.control}
															name="description"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Textarea
																			{...field}
																			placeholder="Enter specialty description (optional)"
																			className="input-text min-h-[100px]"
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													) : (
														<div
															className={`rounded-lg border p-3 ${specialty.description ? "bg-muted/50" : "border-yellow-200 bg-yellow-50"}`}
														>
															<p
																className={`text-base ${specialty.description ? "text-muted-foreground" : "text-yellow-600 italic"}`}
															>
																{specialty.description ||
																	"💡 Consider adding a description to help users understand this specialty"}
															</p>
														</div>
													)}
												</div>
											</div>
										</CardContent>
									</Card>

									{/* Info Sections Management */}
									{!isEditMode && (
										<InfoSectionsManager
											specialtyId={id}
											specialtyName={specialty.name}
										/>
									)}
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
						<AlertDialogTitle>Delete Specialty</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{specialty?.name}"? This action
							cannot be undone and may affect doctors associated with this
							specialty.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={deleteSpecialtyMutation.isPending}
							className="bg-red-600 hover:bg-red-700"
						>
							{deleteSpecialtyMutation.isPending ? (
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
