import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useUpdateStaff } from "@/hooks/api/useStaffs";
import { toast } from "sonner";
import type { StaffAccount, UpdateStaffRequest } from "@/types";

const editUserSchema = z.object({
	fullName: z
		.string()
		.min(2, "Full name must be at least 2 characters")
		.max(100, "Full name must not exceed 100 characters"),
	email: z.string().email("Please enter a valid email address"),
	role: z.enum(["SUPER_ADMIN", "ADMIN", "DOCTOR"]),
	phone: z.string().optional(),
	isMale: z.enum(["true", "false", ""]).optional(),
	dateOfBirth: z.date().optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: StaffAccount | null;
}

export const EditUserDialog = ({
	open,
	onOpenChange,
	user,
}: EditUserDialogProps) => {
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
	const updateStaffMutation = useUpdateStaff();

	const form = useForm<EditUserFormData>({
		resolver: zodResolver(editUserSchema),
		defaultValues: {
			fullName: "",
			email: "",
			role: "ADMIN",
			phone: "",
			isMale: "",
		},
	});

	// Update form when user changes
	useEffect(() => {
		if (user) {
			form.reset({
				fullName: user.fullName,
				email: user.email,
				role: user.role,
				phone: user.phone || "",
				isMale:
					user.isMale === null || user.isMale === undefined
						? ""
						: user.isMale
							? "true"
							: "false",
				dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
			});
		}
	}, [user, form]);

	const onSubmit = async (data: EditUserFormData) => {
		if (!user) return;

		try {
			const payload: UpdateStaffRequest = {
				fullName: data.fullName,
				email: data.email,
				role: data.role,
				phone: data.phone || undefined,
				isMale: data.isMale
					? data.isMale === "true"
						? true
						: false
					: undefined,
				dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
			};

			await updateStaffMutation.mutateAsync({
				id: user.id,
				data: payload,
			});

			toast.success("User updated successfully");
			onOpenChange(false);
		} catch (error) {
			toast.error("Failed to update user");
			console.error("Update user error:", error);
		}
	};

	const handleCancel = () => {
		if (user) {
			form.reset({
				fullName: user.fullName,
				email: user.email,
				role: user.role,
				phone: user.phone || "",
				isMale:
					user.isMale === null || user.isMale === undefined
						? ""
						: user.isMale
							? "true"
							: "false",
				dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
			});
		}
		onOpenChange(false);
	};

	if (!user) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							void form.handleSubmit(onSubmit)(e);
						}}
						className="space-y-4"
					>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{/* Full Name */}
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name *</FormLabel>
										<FormControl>
											<Input placeholder="Enter full name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email *</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="Enter email address"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Role */}
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role *</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
											<SelectItem value="ADMIN">Admin</SelectItem>
											<SelectItem value="DOCTOR">Doctor</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							{/* Phone */}
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input placeholder="Enter phone number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Gender */}
							<FormField
								control={form.control}
								name="isMale"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value ?? ""}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select gender" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="">Not specified</SelectItem>
												<SelectItem value="true">Male</SelectItem>
												<SelectItem value="false">Female</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Date of Birth */}
						<FormField
							control={form.control}
							name="dateOfBirth"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date of Birth</FormLabel>
									<Popover
										open={isDatePickerOpen}
										onOpenChange={setIsDatePickerOpen}
									>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className="w-full pl-3 text-left font-normal"
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={(date) => {
													field.onChange(date);
													setIsDatePickerOpen(false);
												}}
												disabled={(date) =>
													date > new Date() || date < new Date("1900-01-01")
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={updateStaffMutation.isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={updateStaffMutation.isPending}>
								{updateStaffMutation.isPending && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Update User
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
