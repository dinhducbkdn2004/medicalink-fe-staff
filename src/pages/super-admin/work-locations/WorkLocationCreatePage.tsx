import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Save, ArrowLeft, MapPin } from "lucide-react";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateWorkLocation } from "@/hooks/api/useLocations";
import type { CreateWorkLocationRequest } from "@/types/api/locations.types";

const createFormSchema = z.object({
	name: z
		.string()
		.min(2, "Location name must be at least 2 characters")
		.max(100, "Location name must not exceed 100 characters"),
	address: z
		.string()
		.max(200, "Address must not exceed 200 characters")
		.optional()
		.or(z.literal("")),
	city: z
		.string()
		.max(50, "City must not exceed 50 characters")
		.optional()
		.or(z.literal("")),
	state: z
		.string()
		.max(50, "State must not exceed 50 characters")
		.optional()
		.or(z.literal("")),
	zipCode: z
		.string()
		.max(10, "Zip code must not exceed 10 characters")
		.optional()
		.or(z.literal("")),
	phone: z
		.string()
		.optional()
		.or(z.literal(""))
		.refine((val) => !val || /^[+]?[\d\s\-()]{10,15}$/.test(val), {
			message: "Please enter a valid phone number",
		}),
	timezone: z.string().min(1, "Please select a timezone"),
});

type CreateFormValues = z.infer<typeof createFormSchema>;

export function WorkLocationCreatePage() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm<CreateFormValues>({
		resolver: zodResolver(createFormSchema),
		defaultValues: {
			name: "",
			address: "",
			city: "",
			state: "",
			zipCode: "",
			phone: "",
			timezone: "Asia/Ho_Chi_Minh",
		},
	});

	const createLocationMutation = useCreateWorkLocation();

	const onSubmit = async (values: CreateFormValues) => {
		try {
			setIsSubmitting(true);
			const payload: CreateWorkLocationRequest = {
				name: values.name,
				address: values.address || undefined,
				city: values.city || undefined,
				state: values.state || undefined,
				zipCode: values.zipCode || undefined,
				phone: values.phone || undefined,
				timezone: values.timezone,
			};

			await createLocationMutation.mutateAsync(payload);

			toast.success("Work location created successfully", {
				description: "The new work location has been added to the system.",
			});

			void navigate({ to: "/super-admin/work-locations" });
		} catch (error) {
			console.error("Failed to create work location:", error);
			toast.error("Failed to create work location", {
				description: "Please check the information and try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		void navigate({ to: "/super-admin/work-locations" });
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleCancel}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold">Create New Work Location</h1>
						<p className="text-muted-foreground text-sm">
							Add a new work location to the system
						</p>
					</div>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Building2 className="h-5 w-5" />
						Location Information
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
											Location Name <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g. District 1 Clinic, General Hospital..."
												{...field}
											/>
										</FormControl>
										<FormDescription>
											The location name will be displayed to doctors and
											patients
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem className="md:col-span-2">
											<FormLabel>Address</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Enter detailed address..."
													className="min-h-[80px] resize-none"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="city"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City</FormLabel>
											<FormControl>
												<Input placeholder="e.g. Ho Chi Minh City" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="state"
									render={({ field }) => (
										<FormItem>
											<FormLabel>State/Province</FormLabel>
											<FormControl>
												<Input placeholder="e.g. Ho Chi Minh" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="zipCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Zip Code</FormLabel>
											<FormControl>
												<Input placeholder="e.g. 700000" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<Input placeholder="e.g. +84 28 1234 5678" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="timezone"
									render={({ field }) => (
										<FormItem className="md:col-span-2">
											<FormLabel>
												Timezone <span className="text-red-500">*</span>
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select timezone" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="Asia/Ho_Chi_Minh">
														Asia/Ho Chi Minh (GMT+7)
													</SelectItem>
													<SelectItem value="Asia/Bangkok">
														Asia/Bangkok (GMT+7)
													</SelectItem>
													<SelectItem value="Asia/Singapore">
														Asia/Singapore (GMT+8)
													</SelectItem>
													<SelectItem value="Asia/Tokyo">
														Asia/Tokyo (GMT+9)
													</SelectItem>
												</SelectContent>
											</Select>
											<FormDescription>
												The timezone to be used for appointments at this
												location
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="bg-muted/50 border-primary border-l-4 p-4">
								<div className="flex gap-2">
									<MapPin className="text-primary mt-0.5 h-5 w-5 shrink-0" />
									<div className="space-y-1">
										<p className="text-sm font-medium">Note</p>
										<p className="text-muted-foreground text-sm">
											Work locations are used to manage doctor schedules and
											appointments. Please ensure the information is accurate.
										</p>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Button type="submit" disabled={isSubmitting} className="gap-2">
									<Save className="h-4 w-4" />
									{isSubmitting ? "Creating..." : "Create Location"}
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
