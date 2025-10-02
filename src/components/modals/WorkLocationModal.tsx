import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Plus, Edit, MapPin, Phone, Clock } from "lucide-react";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
	useCreateWorkLocation,
	useUpdateWorkLocation,
} from "@/hooks/api/useLocations";

const workLocationSchema = z.object({
	name: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(160, "Name must not exceed 160 characters"),
	address: z.string().optional().or(z.literal("")),
	phone: z.string().optional().or(z.literal("")),
	timezone: z.string().min(1, "Please select a timezone"),
	isActive: z.boolean().optional(),
});

type WorkLocationFormValues = z.infer<typeof workLocationSchema>;

interface WorkLocationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	location?: {
		id: string;
		name: string;
		address?: string;
		phone?: string;
		timezone: string;
		isActive: boolean;
	} | null;
}

const TIMEZONES = [
	{ value: "Asia/Ho_Chi_Minh", label: "Asia/Ho Chi Minh (UTC+7)" },
	{ value: "Asia/Bangkok", label: "Asia/Bangkok (UTC+7)" },
	{ value: "Asia/Jakarta", label: "Asia/Jakarta (UTC+7)" },
	{ value: "Asia/Singapore", label: "Asia/Singapore (UTC+8)" },
	{ value: "Asia/Manila", label: "Asia/Manila (UTC+8)" },
	{ value: "Asia/Tokyo", label: "Asia/Tokyo (UTC+9)" },
];

export function WorkLocationModal({
	open,
	onOpenChange,
	location,
}: Readonly<WorkLocationModalProps>) {
	const isEditing = Boolean(location);

	const form = useForm<WorkLocationFormValues>({
		resolver: zodResolver(workLocationSchema),
		defaultValues: {
			name: "",
			address: "",
			phone: "",
			timezone: "Asia/Ho_Chi_Minh",
			isActive: true,
		},
	});

	const createLocationMutation = useCreateWorkLocation();
	const updateLocationMutation = useUpdateWorkLocation();

	useEffect(() => {
		if (open) {
			if (location) {
				form.reset({
					name: location.name,
					address: location.address || "",
					phone: location.phone || "",
					timezone: location.timezone || "Asia/Ho_Chi_Minh",
					isActive: location.isActive,
				});
			} else {
				form.reset({
					name: "",
					address: "",
					phone: "",
					timezone: "Asia/Ho_Chi_Minh",
					isActive: true,
				});
			}
		}
	}, [location, open, form]);

	const onSubmit = async (values: WorkLocationFormValues) => {
		try {
			if (isEditing && location) {
				await updateLocationMutation.mutateAsync({
					id: location.id,
					data: {
						name: values.name,
						address: values.address || "",
						phone: values.phone || "",
						timezone: values.timezone,
						isActive: values.isActive ?? true,
					},
				});
				toast.success("Work location updated successfully");
			} else {
				await createLocationMutation.mutateAsync({
					name: values.name,
					address: values.address || "",
					phone: values.phone || "",
					timezone: values.timezone,
				});
				toast.success("Work location created successfully");
			}
			handleClose();
		} catch (error: any) {
			toast.error(
				error.message ||
					`Failed to ${isEditing ? "update" : "create"} work location`
			);
		}
	};

	const handleClose = () => {
		form.reset();
		onOpenChange(false);
	};

	const isLoading =
		createLocationMutation.isPending || updateLocationMutation.isPending;

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
						{isEditing ? "Edit Work Location" : "Create New Work Location"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update work location information and settings"
							: "Add a new work location to the system"}
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
									<FormLabel className="flex items-center gap-2">
										<Building2 className="h-4 w-4" />
										Location Name *
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter location name (e.g., Main Hospital)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Address */}
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<MapPin className="h-4 w-4" />
										Address
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Full address of the location..."
											className="min-h-[80px] resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Phone */}
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<Phone className="h-4 w-4" />
										Phone
									</FormLabel>
									<FormControl>
										<Input placeholder="Contact phone number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Timezone */}
						<FormField
							control={form.control}
							name="timezone"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2">
										<Clock className="h-4 w-4" />
										Timezone *
									</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select timezone" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{TIMEZONES.map((timezone) => (
												<SelectItem key={timezone.value} value={timezone.value}>
													{timezone.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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
												Enable this location for scheduling and assignments
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
								<Building2 className="h-4 w-4" />
								{isLoading
									? isEditing
										? "Updating..."
										: "Creating..."
									: isEditing
										? "Update Location"
										: "Create Location"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
