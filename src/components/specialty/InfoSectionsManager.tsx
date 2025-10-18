import { useState } from "react";
import { Plus, Trash2, FileText, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { RichTextEditor } from "@/components/forms/RichTextEditor";
import {
	useInfoSections,
	useCreateInfoSection,
	useDeleteInfoSection,
} from "@/hooks/api/useSpecialties";
import type {
	InfoSection,
	CreateInfoSectionRequest,
} from "@/types/api/specialties.types";

interface InfoSectionsManagerProps {
	specialtyId: string;
	specialtyName: string;
}

export function InfoSectionsManager({
	specialtyId,
	specialtyName,
}: InfoSectionsManagerProps) {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [sectionToDelete, setSectionToDelete] = useState<InfoSection | null>(
		null
	);

	// Form states
	const [formData, setFormData] = useState<CreateInfoSectionRequest>({
		specialtyId,
		name: "",
		content: "",
	});

	// API hooks
	const { data: infoSections = [], isLoading } = useInfoSections(specialtyId);
	const createMutation = useCreateInfoSection();
	const deleteMutation = useDeleteInfoSection();

	const handleCreateSection = async () => {
		if (!formData.name.trim()) {
			toast.error("Section name is required");
			return;
		}

		if (!formData.content.trim()) {
			toast.error("Section content is required");
			return;
		}

		try {
			await createMutation.mutateAsync(formData);
			toast.success("Info section created successfully");
			setIsCreateModalOpen(false);
			setFormData({
				specialtyId,
				name: "",
				content: "",
			});
		} catch (error: any) {
			toast.error(error.message || "Failed to create info section");
		}
	};

	const handleDeleteSection = async () => {
		if (!sectionToDelete) return;

		try {
			await deleteMutation.mutateAsync(sectionToDelete.id);
			toast.success("Info section deleted successfully");
			setDeleteDialogOpen(false);
			setSectionToDelete(null);
		} catch (error: any) {
			toast.error(error.message || "Failed to delete info section");
		}
	};

	const openDeleteDialog = (section: InfoSection) => {
		setSectionToDelete(section);
		setDeleteDialogOpen(true);
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Information Sections
					</CardTitle>
				</CardHeader>
				<CardContent className="flex items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin" />
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Information Sections
							</CardTitle>
							<p className="text-muted-foreground mt-1 text-sm">
								Manage detailed information sections for {specialtyName}
							</p>
						</div>
						<Button onClick={() => setIsCreateModalOpen(true)} size="sm">
							<Plus className="mr-2 h-4 w-4" />
							Add Section
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{infoSections.length === 0 ? (
						<div className="py-8 text-center">
							<FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
							<h3 className="mb-2 text-lg font-medium">
								No information sections
							</h3>
							<p className="text-muted-foreground mb-4">
								Add detailed information sections to help users learn more about
								this specialty.
							</p>
							<Button onClick={() => setIsCreateModalOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Add First Section
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{infoSections.map((section) => (
								<Card
									key={section.id}
									className="border-l-primary/20 border-l-4"
								>
									<CardContent className="p-4">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="mb-2 flex items-center gap-2">
													<h4 className="font-medium">{section.name}</h4>
													<Badge variant="outline" className="text-xs">
														Created{" "}
														{new Date(section.createdAt).toLocaleDateString()}
													</Badge>
												</div>
												<div
													className="text-muted-foreground line-clamp-3 text-sm"
													dangerouslySetInnerHTML={{ __html: section.content }}
												/>
											</div>
											<div className="ml-4 flex items-center gap-1">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => openDeleteDialog(section)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Create Section Modal */}
			<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
				<DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Add Information Section</DialogTitle>
						<DialogDescription>
							Create a new information section for {specialtyName}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4">
						<div>
							<Label htmlFor="section-name">Section Name</Label>
							<Input
								id="section-name"
								placeholder="e.g., Thông tin giới thiệu, Services, Equipment..."
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
							/>
						</div>

						<div>
							<Label htmlFor="section-content">Content</Label>
							<div className="mt-2">
								<RichTextEditor
									value={formData.content}
									onChange={(content) =>
										setFormData((prev) => ({ ...prev, content }))
									}
									placeholder="Enter detailed information about this aspect of the specialty..."
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsCreateModalOpen(false)}
							disabled={createMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							onClick={handleCreateSection}
							disabled={createMutation.isPending}
						>
							{createMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Plus className="mr-2 h-4 w-4" />
									Create Section
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<AlertTriangle className="text-destructive h-5 w-5" />
							Delete Information Section
						</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{sectionToDelete?.name}"? This
							action cannot be undone and will permanently remove this
							information section.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleteMutation.isPending}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteSection}
							className="bg-destructive hover:bg-destructive/90"
							disabled={deleteMutation.isPending}
						>
							{deleteMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								<>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</>
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
