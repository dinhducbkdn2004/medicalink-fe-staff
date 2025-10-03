import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stethoscope, Plus, Edit } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
	useCreateSpecialty,
	useUpdateSpecialty,
} from "@/hooks/api/useSpecialties";

const specialtySchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(120, "Name must not exceed 120 characters"),
	description: z.string().optional().or(z.literal("")),
	icon: z.string().optional().or(z.literal("")),
	isActive: z.boolean().optional(),
});

type SpecialtyFormValues = z.infer<typeof specialtySchema>;

interface SpecialtyModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	specialty?: {
		id: string;
		name: string;
		description?: string;
		icon?: string;
		isActive: boolean;
	} | null;
}

export function SpecialtyModal({
	open,
	onOpenChange,
	specialty,
}: Readonly<SpecialtyModalProps>) {
	const isEditing = Boolean(specialty);

	const form = useForm<SpecialtyFormValues>({
		resolver: zodResolver(specialtySchema),
		defaultValues: {
			name: "",
			description: "",
			icon: "",
			isActive: true,
		},
	});

	const createSpecialtyMutation = useCreateSpecialty();
	const updateSpecialtyMutation = useUpdateSpecialty();

	useEffect(() => {
		if (open) {
			if (specialty) {
				form.reset({
					name: specialty.name,
					description: specialty.description || "",
					icon: specialty.icon || "",
					isActive: specialty.isActive,
				});
			} else {
				form.reset({
					name: "",
					description: "",
					icon: "",
					isActive: true,
				});
			}
		}
	}, [specialty, open, form]);

	const onSubmit = async (values: SpecialtyFormValues) => {
		try {
			if (isEditing && specialty) {
				await updateSpecialtyMutation.mutateAsync({
					id: specialty.id,
					data: {
						name: values.name,
						description: values.description || "",
					},
				});
				toast.success("Specialty updated successfully");
			} else {
				// Generate slug from name (lowercase, replace spaces with hyphens)
				const slug = values.name
					.toLowerCase()
					.trim()
					.replace(/\s+/g, "-")
					.replace(/[^a-z0-9-]/g, "");

				await createSpecialtyMutation.mutateAsync({
					name: values.name,
					slug,
					description: values.description || "",
				});
				toast.success("Specialty created successfully");
			}
			handleClose();
		} catch (error: any) {
			toast.error(
				error.message ||
					`Failed to ${isEditing ? "update" : "create"} specialty`
			);
		}
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	const isLoading =
		createSpecialtyMutation.isPending || updateSpecialtyMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{isEditing ? (
							<Edit className="h-5 w-5" />
						) : (
							<Plus className="h-5 w-5" />
						)}
						{isEditing ? "Edit Specialty" : "Create New Specialty"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update specialty information and settings"
							: "Add a new medical specialty to the system"}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							void form.handleSubmit(onSubmit)(e);
						}}
						className="space-y-6"
					>
						{/* Name */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Specialty Name *</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter specialty name (e.g., Cardiology)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Brief description of the specialty..."
											className="min-h-[80px] resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Icon */}
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Icon (Optional)</FormLabel>
									<FormControl>
										<Input placeholder="Icon identifier or emoji" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Status - Only show for editing */}
						{isEditing && (
							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">Active Status</FormLabel>
											<div className="text-muted-foreground text-sm">
												Enable this specialty for use in the system
											</div>
										</div>
										<FormControl>
											<Switch
												checked={field.value ?? true}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						)}

						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={handleClose}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading} className="gap-2">
								<Stethoscope className="h-4 w-4" />
								{isLoading
									? isEditing
										? "Updating..."
										: "Creating..."
									: isEditing
										? "Update Specialty"
										: "Create Specialty"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
