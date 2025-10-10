import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	Clock,
	Stethoscope,
	Edit,
	Plus,
	Trash2,
	FileText,
	Users,
	CheckCircle,
	AlertTriangle,
	MoreHorizontal,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as specialtiesApi from "@/api/specialties";
import type { Specialty, InfoSection } from "@/types/api/specialties.types";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Input } from "@/components/ui/input";

interface EnhancedSpecialtyViewModalProps {
	open: boolean;
	onClose: () => void;
	specialty: Specialty | null;
	onEdit: () => void;
}

interface InfoSectionFormData {
	title: string;
	content: string;
}

export function EnhancedSpecialtyViewModal({
	open,
	onClose,
	specialty,
	onEdit,
}: EnhancedSpecialtyViewModalProps) {
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState("overview");
	const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
	const [editingSection, setEditingSection] = useState<InfoSection | null>(
		null
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [sectionToDelete, setSectionToDelete] = useState<InfoSection | null>(
		null
	);
	const [sectionFormData, setSectionFormData] = useState<InfoSectionFormData>({
		title: "",
		content: "",
	});

	// Fetch info sections
	const {
		data: infoSections,
		isLoading: sectionsLoading,
		error: sectionsError,
	} = useQuery({
		queryKey: ["info-sections", specialty?.id],
		queryFn: () =>
			specialty ? specialtiesApi.getInfoSections(specialty.id) : null,
		enabled: !!specialty?.id && open,
	});

	// Mutations
	const createSectionMutation = useMutation({
		mutationFn: specialtiesApi.createInfoSection,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["info-sections", specialty?.id],
			});
			toast.success("Info section created successfully");
			resetSectionForm();
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to create info section");
		},
	});

	const updateSectionMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) =>
			specialtiesApi.updateInfoSection(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["info-sections", specialty?.id],
			});
			toast.success("Info section updated successfully");
			resetSectionForm();
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to update info section");
		},
	});

	const deleteSectionMutation = useMutation({
		mutationFn: specialtiesApi.deleteInfoSection,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["info-sections", specialty?.id],
			});
			toast.success("Info section deleted successfully");
			setDeleteDialogOpen(false);
			setSectionToDelete(null);
		},
		onError: (error: any) => {
			toast.error(error.message || "Failed to delete info section");
		},
	});

	const resetSectionForm = () => {
		setSectionFormData({ title: "", content: "" });
		setIsAddingSectionOpen(false);
		setEditingSection(null);
	};

	const handleAddSection = () => {
		setEditingSection(null);
		setSectionFormData({ title: "", content: "" });
		setIsAddingSectionOpen(true);
	};

	const handleEditSection = (section: InfoSection) => {
		setEditingSection(section);
		setSectionFormData({
			title: section.title,
			content: section.content,
		});
		setIsAddingSectionOpen(true);
	};

	const handleDeleteSection = (section: InfoSection) => {
		setSectionToDelete(section);
		setDeleteDialogOpen(true);
	};

	const handleSaveSection = async () => {
		if (!specialty || !sectionFormData.title.trim()) {
			toast.error("Please provide a title for the section");
			return;
		}

		try {
			if (editingSection) {
				await updateSectionMutation.mutateAsync({
					id: editingSection.id,
					data: sectionFormData,
				});
			} else {
				await createSectionMutation.mutateAsync({
					specialtyId: specialty.id,
					title: sectionFormData.title,
					content: sectionFormData.content,
				});
			}
		} catch (error) {
			// Error handled in mutation
		}
	};

	const confirmDeleteSection = async () => {
		if (!sectionToDelete) return;

		try {
			await deleteSectionMutation.mutateAsync(sectionToDelete.id);
		} catch (error) {
			// Error handled in mutation
		}
	};

	if (!specialty) return null;

	const sections = infoSections?.data?.data || [];

	return (
		<>
			<Dialog open={open} onOpenChange={onClose}>
				<DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
					<DialogHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
									<Stethoscope className="text-primary h-6 w-6" />
								</div>
								<div>
									<DialogTitle className="text-xl">
										{specialty.name}
									</DialogTitle>
									<DialogDescription className="flex items-center gap-2">
										<Badge
											variant={specialty.isActive ? "default" : "secondary"}
											className="text-xs"
										>
											{specialty.isActive ? (
												<>
													<CheckCircle className="mr-1 h-3 w-3" />
													Active
												</>
											) : (
												<>
													<AlertTriangle className="mr-1 h-3 w-3" />
													Inactive
												</>
											)}
										</Badge>
										<span>•</span>
										<span>{sections.length} info sections</span>
									</DialogDescription>
								</div>
							</div>
							<Button
								onClick={onEdit}
								variant="outline"
								size="sm"
								className="gap-2"
							>
								<Edit className="h-4 w-4" />
								Edit Specialty
							</Button>
						</div>
					</DialogHeader>

					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex-1"
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="sections">
								Info Sections ({sections.length})
							</TabsTrigger>
						</TabsList>

						<div className="mt-4 max-h-[60vh] overflow-y-auto">
							<TabsContent value="overview" className="space-y-4">
								{/* Basic Information */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-base">
											<FileText className="h-4 w-4" />
											Basic Information
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div>
												<label className="text-muted-foreground text-sm font-medium">
													Name
												</label>
												<p className="text-sm">{specialty.name}</p>
											</div>
											<div>
												<label className="text-muted-foreground text-sm font-medium">
													Slug
												</label>
												<p className="bg-muted rounded px-2 py-1 font-mono text-sm">
													{specialty.slug}
												</p>
											</div>
										</div>
										<div>
											<label className="text-muted-foreground text-sm font-medium">
												Description
											</label>
											<p className="mt-1 text-sm">
												{specialty.description || "No description provided"}
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Statistics */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-base">
											<Users className="h-4 w-4" />
											Statistics
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-3 gap-4">
											<div className="text-center">
												<div className="text-primary text-2xl font-bold">
													{sections.length}
												</div>
												<div className="text-muted-foreground text-sm">
													Info Sections
												</div>
											</div>
											<div className="text-center">
												<div className="text-primary text-2xl font-bold">
													{specialty.isActive ? "Active" : "Inactive"}
												</div>
												<div className="text-muted-foreground text-sm">
													Status
												</div>
											</div>
											<div className="text-center">
												<div className="text-primary text-2xl font-bold">
													{format(new Date(specialty.createdAt), "MMM yyyy")}
												</div>
												<div className="text-muted-foreground text-sm">
													Created
												</div>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Timeline */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-base">
											<Clock className="h-4 w-4" />
											Timeline
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">Created</span>
												<span className="text-muted-foreground text-sm">
													{format(new Date(specialty.createdAt), "PPP")}
												</span>
											</div>
											<Separator />
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">
													Last Updated
												</span>
												<span className="text-muted-foreground text-sm">
													{format(new Date(specialty.updatedAt), "PPP")}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="sections" className="space-y-4">
								{/* Section Header */}
								<div className="flex items-center justify-between">
									<div>
										<h3 className="text-lg font-medium">
											Information Sections
										</h3>
										<p className="text-muted-foreground text-sm">
											Manage detailed information sections for this specialty
										</p>
									</div>
									<Button
										onClick={handleAddSection}
										size="sm"
										className="gap-2"
									>
										<Plus className="h-4 w-4" />
										Add Section
									</Button>
								</div>

								{/* Sections List */}
								{sectionsLoading ? (
									<div className="space-y-4">
										{Array.from({ length: 3 }).map((_, i) => (
											<Card key={i}>
												<CardHeader>
													<Skeleton className="h-4 w-1/3" />
													<Skeleton className="h-3 w-1/4" />
												</CardHeader>
												<CardContent>
													<Skeleton className="h-20 w-full" />
												</CardContent>
											</Card>
										))}
									</div>
								) : sectionsError ? (
									<Card>
										<CardContent className="flex flex-col items-center justify-center py-8">
											<AlertTriangle className="text-muted-foreground mb-2 h-8 w-8" />
											<p className="text-muted-foreground text-sm">
												Failed to load info sections
											</p>
										</CardContent>
									</Card>
								) : sections.length === 0 ? (
									<Card>
										<CardContent className="flex flex-col items-center justify-center py-8">
											<FileText className="text-muted-foreground mb-2 h-8 w-8" />
											<p className="text-muted-foreground mb-4 text-sm">
												No information sections yet
											</p>
											<Button
												onClick={handleAddSection}
												size="sm"
												className="gap-2"
											>
												<Plus className="h-4 w-4" />
												Add First Section
											</Button>
										</CardContent>
									</Card>
								) : (
									<div className="space-y-4">
										{sections.map((section) => (
											<Card key={section.id}>
												<CardHeader className="pb-3">
													<div className="flex items-start justify-between">
														<div>
															<CardTitle className="text-base">
																{section.title}
															</CardTitle>
															<CardDescription>
																Created{" "}
																{format(new Date(section.createdAt), "PPP")}
															</CardDescription>
														</div>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0"
																>
																	<MoreHorizontal className="h-4 w-4" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuItem
																	onClick={() => handleEditSection(section)}
																>
																	<Edit className="mr-2 h-4 w-4" />
																	Edit
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem
																	onClick={() => handleDeleteSection(section)}
																	className="text-destructive"
																>
																	<Trash2 className="mr-2 h-4 w-4" />
																	Delete
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</CardHeader>
												<CardContent>
													<div
														className="prose prose-sm max-w-none"
														dangerouslySetInnerHTML={{
															__html: section.content,
														}}
													/>
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</TabsContent>
						</div>
					</Tabs>
				</DialogContent>
			</Dialog>

			{/* Add/Edit Section Dialog */}
			<Dialog open={isAddingSectionOpen} onOpenChange={setIsAddingSectionOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{editingSection ? "Edit Info Section" : "Add Info Section"}
						</DialogTitle>
						<DialogDescription>
							{editingSection
								? "Update the information section details"
								: "Create a new information section for this specialty"}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium">Title</label>
							<Input
								value={sectionFormData.title}
								onChange={(e) =>
									setSectionFormData((prev) => ({
										...prev,
										title: e.target.value,
									}))
								}
								placeholder="Enter section title..."
								className="mt-1"
							/>
						</div>

						<div>
							<label className="text-sm font-medium">Content</label>
							<div className="mt-1">
								<RichTextEditor
									value={sectionFormData.content}
									onChange={(content) =>
										setSectionFormData((prev) => ({ ...prev, content }))
									}
									placeholder="Enter section content..."
									minHeight="200px"
								/>
							</div>
						</div>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button variant="outline" onClick={resetSectionForm}>
							Cancel
						</Button>
						<Button
							onClick={handleSaveSection}
							disabled={
								createSectionMutation.isPending ||
								updateSectionMutation.isPending
							}
						>
							{createSectionMutation.isPending ||
							updateSectionMutation.isPending
								? "Saving..."
								: editingSection
									? "Update Section"
									: "Create Section"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Info Section</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{sectionToDelete?.title}"? This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDeleteSection}
							className="bg-destructive hover:bg-destructive/90"
							disabled={deleteSectionMutation.isPending}
						>
							{deleteSectionMutation.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
