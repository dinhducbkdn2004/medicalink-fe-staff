import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	User,
	Calendar as CalendarIcon,
	Phone,
	Mail,
	Save,
	CalendarDays,
	MarsStroke,
	LockKeyhole,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { useCreateDoctor } from "@/hooks/api/useDoctors";
import type { CreateDoctorRequest } from "@/types";

const createFormSchema = z.object({
	fullName: z
		.string()
		.min(2, "Full name must be at least 2 characters")
		.max(100, "Full name must not exceed 100 characters"),
	email: z
		.string()
		.email("Please enter a valid email address")
		.min(1, "Email is required"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
	phone: z
		.string()
		.optional()
		.or(z.literal(""))
		.refine((val) => !val || /^[+]?[\d\s\-()]{10,15}$/.test(val), {
			message: "Please enter a valid phone number",
		}),
	isMale: z.boolean().optional(),
	dateOfBirth: z.date().optional(),
});

type CreateFormValues = z.infer<typeof createFormSchema>;

export function DoctorCreatePage() {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CreateFormValues>({
		resolver: zodResolver(createFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			phone: "",
			isMale: true,
			dateOfBirth: undefined,
		},
	});

	const createDoctorMutation = useCreateDoctor();

	const onSubmit = async (values: CreateFormValues) => {
		try {
			setIsSubmitting(true);

			const createData: CreateDoctorRequest = {
				email: values.email,
				password: values.password,
				fullName: values.fullName,
				dateOfBirth: values.dateOfBirth || null,
				isMale: values.isMale ?? null,
				phone: values.phone && values.phone.trim() !== "" ? values.phone : null,
			};

			await createDoctorMutation.mutateAsync(createData);
			toast.success("Doctor created successfully");

			// Navigate back to doctor list
			void navigate({ to: "/super-admin/doctor-accounts" });
		} catch (error: any) {
			toast.error(error.message || "Failed to create doctor");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		void navigate({ to: "/super-admin/doctor-accounts" });
	};

	return (
		<div className="flex h-[calc(100vh-80px)] items-center justify-center px-4">
			<Card className="border-border w-full max-w-2xl border shadow-sm">
				<CardHeader className="space-y-1 pb-3">
					<CardTitle className="text-center text-lg font-semibold">
						Create New Doctor Account
					</CardTitle>
					<p className="text-muted-foreground text-center text-sm">
						Enter doctor details below
					</p>
				</CardHeader>

				<CardContent className="px-4 pb-4">
					<Form {...form}>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								void form.handleSubmit(onSubmit)(e);
							}}
							className="grid grid-cols-1 gap-5 md:grid-cols-2"
						>
							{/* Left column */}
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="fullName"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<User className="h-4 w-4" />
												Full Name *
											</FormLabel>
											<FormControl>
												<Input placeholder="Doctor's full name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<Mail className="h-4 w-4" />
												Email *
											</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="Email address"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<LockKeyhole className="h-4 w-4" />
												Password *
											</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Min 8 characters"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Right column */}
							<div className="space-y-4">
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
												<Input placeholder="Phone number" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="isMale"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<MarsStroke className="h-4 w-4" />
												Gender
											</FormLabel>
											<Select
												onValueChange={(v) => field.onChange(v === "true")}
												value={
													field.value === undefined ? "" : String(field.value)
												}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select gender" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="true">Male</SelectItem>
													<SelectItem value="false">Female</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="dateOfBirth"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="flex items-center gap-2">
												<CalendarDays className="h-4 w-4" />
												Date of Birth
											</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															className={cn(
																"w-full pl-3 text-left font-normal",
																!field.value && "text-muted-foreground"
															)}
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
														onSelect={field.onChange}
														disabled={(date) =>
															date > new Date() || date < new Date("1900-01-01")
														}
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Actions */}
							<div className="flex justify-end gap-3 border-t pt-3 md:col-span-2">
								<Button
									type="button"
									variant="outline"
									onClick={handleCancel}
									disabled={isSubmitting}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? (
										<>
											<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
											Creating...
										</>
									) : (
										<>
											<Save className="mr-2 h-4 w-4" />
											Create Doctor
										</>
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
