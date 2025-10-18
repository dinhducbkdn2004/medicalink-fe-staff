import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stethoscope, Save, ArrowLeft, FileText } from "lucide-react";

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
import { useCreateSpecialty } from "@/hooks/api/useSpecialties";
import type { CreateSpecialtyRequest } from "@/types/api/specialties.types";

const createFormSchema = z.object({
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

type CreateFormValues = z.infer<typeof createFormSchema>;

export function SpecialtyCreatePage() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm<CreateFormValues>({
		resolver: zodResolver(createFormSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const createSpecialtyMutation = useCreateSpecialty();

	const onSubmit = async (values: CreateFormValues) => {
		try {
			setIsSubmitting(true);
			const payload: CreateSpecialtyRequest = {
				name: values.name,
				description: values.description || undefined,
			};

			await createSpecialtyMutation.mutateAsync(payload);

			toast.success("Specialty created successfully", {
				description: "The new specialty has been added to the system.",
			});

			void navigate({ to: "/super-admin/specialties" });
		} catch (error) {
			console.error("Failed to create specialty:", error);
			toast.error("Failed to create specialty", {
				description: "Please check the information and try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		void navigate({ to: "/super-admin/specialties" });
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleCancel}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold">Create New Specialty</h1>
						<p className="text-muted-foreground text-sm">
							Add a new medical specialty to the system
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

							<div className="bg-muted/50 border-primary border-l-4 p-4">
								<div className="flex gap-2">
									<FileText className="text-primary mt-0.5 h-5 w-5 shrink-0" />
									<div className="space-y-1">
										<p className="text-sm font-medium">Note</p>
										<p className="text-muted-foreground text-sm">
											After creating the specialty, you can add detailed
											information sections such as symptoms, treatments, common
											diseases, etc. in the specialty details page.
										</p>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Button type="submit" disabled={isSubmitting} className="gap-2">
									<Save className="h-4 w-4" />
									{isSubmitting ? "Creating..." : "Create Specialty"}
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
