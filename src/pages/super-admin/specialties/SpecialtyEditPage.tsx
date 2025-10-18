import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stethoscope, Save, ArrowLeft, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
	useSpecialtyById,
	useUpdateSpecialty,
} from "@/hooks/api/useSpecialties";
import type { UpdateSpecialtyRequest } from "@/types/api/specialties.types";

const editFormSchema = z.object({
	name: z
		.string()
		.min(2, "Specialty name must be at least 2 characters")
		.max(100, "Specialty name must not exceed 100 characters"),
	description: z
		.string()
		.max(500, "Description must not exceed 500 characters")
		.optional()
		.or(z.literal("")),
});

type EditFormValues = z.infer<typeof editFormSchema>;

export function SpecialtyEditPage() {
	const { id } = useParams({ from: "/super-admin/specialties/$id/edit" });
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data: specialtyData, isLoading } = useSpecialtyById(id);
	const updateSpecialtyMutation = useUpdateSpecialty();

	const specialty = specialtyData?.data?.data;

	const form = useForm<EditFormValues>({
		resolver: zodResolver(editFormSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	useEffect(() => {
		if (specialty) {
			form.reset({
				name: specialty.name || "",
				description: specialty.description || "",
			});
		}
	}, [specialty, form]);

	const onSubmit = async (values: EditFormValues) => {
		try {
			setIsSubmitting(true);
			const payload: UpdateSpecialtyRequest = {
				name: values.name,
				description: values.description || undefined,
			};

			await updateSpecialtyMutation.mutateAsync({ id, data: payload });

			toast.success("Specialty updated successfully", {
				description: "The specialty information has been updated.",
			});

			void navigate({
				to: "/super-admin/specialties/$id/view",
				params: { id },
			});
		} catch (error) {
			console.error("Failed to update specialty:", error);
			toast.error("Failed to update specialty", {
				description: "Please check the information and try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		void navigate({ to: "/super-admin/specialties/$id/view", params: { id } });
	};

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center p-6">
				<div className="flex items-center gap-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span>Loading...</span>
				</div>
			</div>
		);
	}

	if (!specialty) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-6">
				<Card>
					<CardContent className="p-6">
						<p className="text-muted-foreground">Specialty not found.</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleCancel}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold">Edit Specialty</h1>
						<p className="text-muted-foreground text-sm">
							Update information for {specialty.name}
						</p>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Stethoscope className="h-5 w-5" />
						Specialty Information
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Specialty Name <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g. Internal Medicine, Surgery, Cardiology..."
												{...field}
											/>
										</FormControl>
										<FormDescription>
											The specialty name will be displayed to patients and
											doctors
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
												placeholder="Enter a brief description of the specialty..."
												className="min-h-[120px] resize-none"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											A brief description of the specialty (optional)
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex items-center gap-3">
								<Button type="submit" disabled={isSubmitting} className="gap-2">
									<Save className="h-4 w-4" />
									{isSubmitting ? "Saving..." : "Save Changes"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={handleCancel}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
