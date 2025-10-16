import { useState, useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Save, ArrowLeft, Loader2 } from "lucide-react";

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
import {
	useWorkLocationById,
	useUpdateWorkLocation,
} from "@/hooks/api/useLocations";
import type { UpdateWorkLocationRequest } from "@/types/api/locations.types";

const editFormSchema = z.object({
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

type EditFormValues = z.infer<typeof editFormSchema>;

export function WorkLocationEditPage() {
	const { id } = useParams({ from: "/super-admin/work-locations/$id/edit" });
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { data: locationData, isLoading } = useWorkLocationById(id);
	const updateLocationMutation = useUpdateWorkLocation();

	const location = locationData?.data?.data;

	const form = useForm<EditFormValues>({
		resolver: zodResolver(editFormSchema),
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

	useEffect(() => {
		if (location) {
			form.reset({
				name: location.name || "",
				address: location.address || "",
				city: location.city || "",
				state: location.state || "",
				zipCode: location.zipCode || "",
				phone: location.phone || "",
				timezone: location.timezone || "Asia/Ho_Chi_Minh",
			});
		}
	}, [location, form]);

	const onSubmit = async (values: EditFormValues) => {
		try {
			setIsSubmitting(true);
			const payload: UpdateWorkLocationRequest = {
				name: values.name,
				address: values.address || undefined,
				city: values.city || undefined,
				state: values.state || undefined,
				zipCode: values.zipCode || undefined,
				phone: values.phone || undefined,
				timezone: values.timezone,
			};

			await updateLocationMutation.mutateAsync({ id, data: payload });

			toast.success("Work location updated successfully", {
				description: "The location information has been updated.",
			});

			void navigate({
				to: "/super-admin/work-locations/$id/view",
				params: { id },
			});
		} catch (error) {
			console.error("Failed to update work location:", error);
			toast.error("Failed to update work location", {
				description: "Please check the information and try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		void navigate({
			to: "/super-admin/work-locations/$id/view",
			params: { id },
		});
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

	if (!location) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-6">
				<Card>
					<CardContent className="p-6">
						<p className="text-muted-foreground">Work location not found.</p>
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
						<h1 className="text-2xl font-bold">Edit Work Location</h1>
						<p className="text-muted-foreground text-sm">
							Update information for {location.name}
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
