/**
 * Permission Group Modal
 * Modal for creating and editing permission groups
 */

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
	useCreatePermissionGroup,
	useUpdatePermissionGroup,
} from "@/hooks/api/usePermissions";
import type { PermissionGroup } from "@/types/api/permissions.types";

const formSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be less than 50 characters")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Name can only contain letters, numbers, underscores, and hyphens"
		),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(200, "Description must be less than 200 characters"),
	isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface PermissionGroupModalProps {
	isOpen: boolean;
	onClose: () => void;
	group?: PermissionGroup | null;
	mode: "create" | "edit";
}

export function PermissionGroupModal({
	isOpen,
	onClose,
	group,
	mode,
}: PermissionGroupModalProps) {
	const createMutation = useCreatePermissionGroup();
	const updateMutation = useUpdatePermissionGroup();

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: group?.name || "",
			description: group?.description || "",
			isActive: group?.isActive ?? true,
		},
	});

	// Reset form when group changes or modal opens
	React.useEffect(() => {
		if (isOpen) {
			form.reset({
				name: group?.name || "",
				description: group?.description || "",
				isActive: group?.isActive ?? true,
			});
		}
	}, [isOpen, group, form]);

	const onSubmit = async (data: FormData) => {
		try {
			if (mode === "create") {
				await createMutation.mutateAsync({
					name: data.name,
					description: data.description,
				});
			} else if (mode === "edit" && group) {
				await updateMutation.mutateAsync({
					groupId: group.id,
					data: {
						name: data.name,
						description: data.description,
						isActive: data.isActive,
					},
				});
			}
			onClose();
		} catch (error) {
			console.error("Failed to save group:", error);
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{mode === "create"
							? "Create Permission Group"
							: "Edit Permission Group"}
					</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Create a new permission group to organize user access levels."
							: "Update the permission group details."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Group Name</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g., admin, doctor, nurse"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormDescription>
										A unique identifier for the group. Use lowercase letters,
										numbers, underscores, and hyphens only.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe the purpose and scope of this permission group..."
											className="resize-none"
											rows={3}
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormDescription>
										A clear description of what this group represents and its
										intended use.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{mode === "edit" && (
							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">Active Status</FormLabel>
											<FormDescription>
												Inactive groups cannot be assigned to users.
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isLoading || group?.name === "super_admin"}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						)}

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{mode === "create" ? "Create Group" : "Update Group"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
