import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Calendar,
	Clock,
	Loader2,
	Stethoscope,
	MapPin,
	User,
	CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib";
import { toast } from "sonner";
import { useState } from "react";

const scheduleSchema = z.object({
	doctorId: z.string().min(1, "Please select a doctor"),
	locationId: z.string().min(1, "Please select a location"),
	startDate: z.date({ message: "Please select start date" }),
	endDate: z.date({ message: "Please select end date" }),
	timeStart: z.string().min(1, "Please select start time"),
	timeEnd: z.string().min(1, "Please select end time"),
	maxCapacity: z
		.number()
		.min(1, "Capacity must be at least 1")
		.max(50, "Capacity cannot exceed 50"),
	slotDuration: z
		.number()
		.min(15, "Minimum slot duration is 15 minutes")
		.max(120, "Maximum slot duration is 120 minutes"),
	daysOfWeek: z.array(z.number()).min(1, "Please select at least one day"),
	isRecurring: z.boolean(),
	notes: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface ScheduleModalProps {
	open: boolean;
	onClose: () => void;
	schedule?: any;
	onSuccess?: () => void;
}

// Mock data - replace with actual API calls
const mockDoctors = [
	{ id: "1", fullName: "Dr. Nguyễn Văn Minh", specialty: "Cardiology" },
	{ id: "2", fullName: "Dr. Trần Thị Lan", specialty: "Dermatology" },
	{ id: "3", fullName: "Dr. Lê Văn Hoàng", specialty: "Neurology" },
	{ id: "4", fullName: "Dr. Phạm Thị Mai", specialty: "Pediatrics" },
];

const mockLocations = [
	{ id: "1", name: "Main Hospital", address: "123 Main St" },
	{ id: "2", name: "Branch A", address: "456 Branch Ave" },
	{ id: "3", name: "Branch B", address: "789 Health Blvd" },
];

// Time slots
const timeSlots = [
	"06:00",
	"06:30",
	"07:00",
	"07:30",
	"08:00",
	"08:30",
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"12:00",
	"12:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
	"17:30",
	"18:00",
	"18:30",
	"19:00",
	"19:30",
	"20:00",
	"20:30",
];

const daysOfWeek = [
	{ id: 1, name: "Monday", short: "Mon" },
	{ id: 2, name: "Tuesday", short: "Tue" },
	{ id: 3, name: "Wednesday", short: "Wed" },
	{ id: 4, name: "Thursday", short: "Thu" },
	{ id: 5, name: "Friday", short: "Fri" },
	{ id: 6, name: "Saturday", short: "Sat" },
	{ id: 0, name: "Sunday", short: "Sun" },
];

const slotDurations = [
	{ value: 15, label: "15 minutes" },
	{ value: 30, label: "30 minutes" },
	{ value: 45, label: "45 minutes" },
	{ value: 60, label: "1 hour" },
	{ value: 90, label: "1.5 hours" },
	{ value: 120, label: "2 hours" },
];

export function ScheduleModal({
	open,
	onClose,
	schedule,
	onSuccess,
}: Readonly<ScheduleModalProps>) {
	const [isLoading, setIsLoading] = useState(false);
	const [startDate, setStartDate] = useState<Date | undefined>(
		schedule?.startDate ? new Date(schedule.startDate) : undefined
	);
	const [endDate, setEndDate] = useState<Date | undefined>(
		schedule?.endDate ? new Date(schedule.endDate) : undefined
	);

	const isEditing = !!schedule;

	const form = useForm<ScheduleFormData>({
		resolver: zodResolver(scheduleSchema),
		defaultValues: {
			doctorId: schedule?.doctorId || "",
			locationId: schedule?.locationId || "",
			startDate: schedule?.startDate
				? new Date(schedule.startDate)
				: new Date(),
			endDate: schedule?.endDate ? new Date(schedule.endDate) : new Date(),
			timeStart: schedule?.timeStart || "",
			timeEnd: schedule?.timeEnd || "",
			maxCapacity: schedule?.maxCapacity || 10,
			slotDuration: schedule?.slotDuration || 30,
			daysOfWeek: schedule?.daysOfWeek || [],
			isRecurring: schedule?.isRecurring || false,
			notes: schedule?.notes || "",
		},
	});

	const onSubmit = async (data: ScheduleFormData) => {
		setIsLoading(true);

		try {
			// Validation: end date should be after start date
			if (data.endDate <= data.startDate) {
				toast.error("End date must be after start date");
				setIsLoading(false);
				return;
			}

			// Validation: end time should be after start time
			const startTime = new Date(`2000-01-01T${data.timeStart}:00`);
			const endTime = new Date(`2000-01-01T${data.timeEnd}:00`);
			if (endTime <= startTime) {
				toast.error("End time must be after start time");
				setIsLoading(false);
				return;
			}

			// Mock API call - replace with actual implementation
			const submitData = {
				...data,
				startDate: format(data.startDate, "yyyy-MM-dd"),
				endDate: format(data.endDate, "yyyy-MM-dd"),
			};

			// Simulate API call with submitData
			console.warn("Submitting schedule data:", submitData);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast.success(
				isEditing
					? "Schedule updated successfully"
					: "Schedule created successfully"
			);

			onSuccess?.();
			onClose();
			form.reset();
		} catch (error: any) {
			toast.error(error.message || "Failed to save schedule");
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		form.reset();
		setStartDate(undefined);
		setEndDate(undefined);
		onClose();
	};

	const selectedDays = form.watch("daysOfWeek");

	const toggleDay = (dayId: number) => {
		const currentDays = selectedDays || [];
		const newDays = currentDays.includes(dayId)
			? currentDays.filter((d) => d !== dayId)
			: [...currentDays, dayId];
		form.setValue("daysOfWeek", newDays);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						{isEditing ? "Edit Schedule" : "Create New Schedule"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the doctor's schedule details below."
							: "Fill in the details to create a new doctor schedule."}
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						void form.handleSubmit(onSubmit)(e);
					}}
					className="space-y-6"
				>
					<div className="grid grid-cols-2 gap-4">
						{/* Doctor Selection */}
						<div className="space-y-2">
							<Label htmlFor="doctorId" className="flex items-center gap-2">
								<Stethoscope className="h-4 w-4" />
								Doctor *
							</Label>
							<Select
								value={form.watch("doctorId")}
								onValueChange={(value) => form.setValue("doctorId", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select doctor" />
								</SelectTrigger>
								<SelectContent>
									{mockDoctors.map((doctor) => (
										<SelectItem key={doctor.id} value={doctor.id}>
											<div>
												<div className="font-medium">{doctor.fullName}</div>
												<div className="text-muted-foreground text-sm">
													{doctor.specialty}
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.doctorId && (
								<p className="text-sm text-red-500">
									{form.formState.errors.doctorId.message}
								</p>
							)}
						</div>

						{/* Location Selection */}
						<div className="space-y-2">
							<Label htmlFor="locationId" className="flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								Location *
							</Label>
							<Select
								value={form.watch("locationId")}
								onValueChange={(value) => form.setValue("locationId", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select location" />
								</SelectTrigger>
								<SelectContent>
									{mockLocations.map((location) => (
										<SelectItem key={location.id} value={location.id}>
											<div>
												<div className="font-medium">{location.name}</div>
												<div className="text-muted-foreground text-sm">
													{location.address}
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.locationId && (
								<p className="text-sm text-red-500">
									{form.formState.errors.locationId.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Start Date */}
						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<CalendarIcon className="h-4 w-4" />
								Start Date *
							</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full justify-start text-left font-normal",
											!startDate && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{startDate ? format(startDate, "PPP") : "Pick start date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<CalendarComponent
										mode="single"
										selected={startDate}
										onSelect={(date) => {
											setStartDate(date);
											if (date) form.setValue("startDate", date);
										}}
										disabled={(date) => date < new Date()}
										autoFocus
									/>
								</PopoverContent>
							</Popover>
							{form.formState.errors.startDate && (
								<p className="text-sm text-red-500">
									{form.formState.errors.startDate.message}
								</p>
							)}
						</div>

						{/* End Date */}
						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<CalendarIcon className="h-4 w-4" />
								End Date *
							</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full justify-start text-left font-normal",
											!endDate && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{endDate ? format(endDate, "PPP") : "Pick end date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<CalendarComponent
										mode="single"
										selected={endDate}
										onSelect={(date) => {
											setEndDate(date);
											if (date) form.setValue("endDate", date);
										}}
										disabled={(date) => date < (startDate || new Date())}
										autoFocus
									/>
								</PopoverContent>
							</Popover>
							{form.formState.errors.endDate && (
								<p className="text-sm text-red-500">
									{form.formState.errors.endDate.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Start Time */}
						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								Start Time *
							</Label>
							<Select
								value={form.watch("timeStart")}
								onValueChange={(value) => form.setValue("timeStart", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select start time" />
								</SelectTrigger>
								<SelectContent>
									{timeSlots.map((time) => (
										<SelectItem key={time} value={time}>
											{time}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.timeStart && (
								<p className="text-sm text-red-500">
									{form.formState.errors.timeStart.message}
								</p>
							)}
						</div>

						{/* End Time */}
						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								End Time *
							</Label>
							<Select
								value={form.watch("timeEnd")}
								onValueChange={(value) => form.setValue("timeEnd", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select end time" />
								</SelectTrigger>
								<SelectContent>
									{timeSlots.map((time) => (
										<SelectItem key={time} value={time}>
											{time}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.timeEnd && (
								<p className="text-sm text-red-500">
									{form.formState.errors.timeEnd.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Max Capacity */}
						<div className="space-y-2">
							<Label htmlFor="maxCapacity" className="flex items-center gap-2">
								<User className="h-4 w-4" />
								Max Capacity *
							</Label>
							<Input
								type="number"
								{...form.register("maxCapacity", { valueAsNumber: true })}
								placeholder="Enter max capacity"
								min="1"
								max="50"
							/>
							{form.formState.errors.maxCapacity && (
								<p className="text-sm text-red-500">
									{form.formState.errors.maxCapacity.message}
								</p>
							)}
						</div>

						{/* Slot Duration */}
						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								Slot Duration *
							</Label>
							<Select
								value={form.watch("slotDuration")?.toString()}
								onValueChange={(value) =>
									form.setValue("slotDuration", parseInt(value))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select duration" />
								</SelectTrigger>
								<SelectContent>
									{slotDurations.map((duration) => (
										<SelectItem
											key={duration.value}
											value={duration.value.toString()}
										>
											{duration.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.slotDuration && (
								<p className="text-sm text-red-500">
									{form.formState.errors.slotDuration.message}
								</p>
							)}
						</div>
					</div>

					{/* Days of Week */}
					<div className="space-y-2">
						<Label className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							Days of Week *
						</Label>
						<div className="grid grid-cols-7 gap-2">
							{daysOfWeek.map((day) => (
								<button
									key={day.id}
									type="button"
									className={cn(
										"flex cursor-pointer flex-col items-center rounded-md border p-2 transition-colors",
										selectedDays?.includes(day.id)
											? "bg-primary text-primary-foreground border-primary"
											: "hover:bg-muted"
									)}
									onClick={() => toggleDay(day.id)}
								>
									<div className="text-xs font-medium">{day.short}</div>
									<div className="text-[10px]">{day.name}</div>
								</button>
							))}
						</div>
						{form.formState.errors.daysOfWeek && (
							<p className="text-sm text-red-500">
								{form.formState.errors.daysOfWeek.message}
							</p>
						)}
					</div>

					{/* Recurring Schedule */}
					<div className="flex items-center space-x-2">
						<Checkbox
							id="isRecurring"
							checked={form.watch("isRecurring")}
							onCheckedChange={(checked) =>
								form.setValue("isRecurring", !!checked)
							}
						/>
						<Label htmlFor="isRecurring" className="text-sm font-medium">
							Recurring Schedule
						</Label>
						<p className="text-muted-foreground text-xs">
							(Apply this schedule weekly for the selected date range)
						</p>
					</div>

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="notes">Additional Notes</Label>
						<textarea
							{...form.register("notes")}
							className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="Any additional notes about this schedule"
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{isEditing ? "Update Schedule" : "Create Schedule"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
