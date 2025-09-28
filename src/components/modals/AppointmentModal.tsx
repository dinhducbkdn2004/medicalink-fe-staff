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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	CalendarIcon,
	Clock,
	Loader2,
	User,
	MapPin,
	Stethoscope,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

const appointmentSchema = z.object({
	patientId: z.string().min(1, "Please select a patient"),
	doctorId: z.string().min(1, "Please select a doctor"),
	locationId: z.string().min(1, "Please select a location"),
	serviceDate: z.date({ message: "Please select a service date" }),
	timeStart: z.string().min(1, "Please select start time"),
	timeEnd: z.string().min(1, "Please select end time"),
	reason: z.string().min(3, "Reason must be at least 3 characters"),
	priceAmount: z.number().min(0, "Price must be a positive number"),
	notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentModalProps {
	open: boolean;
	onClose: () => void;
	appointment?: any;
	onSuccess?: () => void;
}

const mockPatients = [
	{ id: "1", fullName: "Trần Văn An", phone: "0901234567" },
	{ id: "2", fullName: "Nguyễn Thị Bích", phone: "0987654321" },
	{ id: "3", fullName: "Lê Văn Cường", phone: "0912345678" },
	{ id: "4", fullName: "Phạm Thị Dung", phone: "0934567890" },
];

const mockDoctors = [
	{ id: "1", fullName: "Dr. Nguyễn Văn Minh", specialty: "Cardiology" },
	{ id: "2", fullName: "Dr. Trần Thị Lan", specialty: "Dermatology" },
	{ id: "3", fullName: "Dr. Lê Văn Hoàng", specialty: "Neurology" },
];

const mockLocations = [
	{ id: "1", name: "Main Hospital", address: "123 Main St" },
	{ id: "2", name: "Branch A", address: "456 Branch Ave" },
	{ id: "3", name: "Branch B", address: "789 Health Blvd" },
];

const timeSlots = [
	"08:00",
	"08:30",
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
];

export function AppointmentModal({
	open,
	onClose,
	appointment,
	onSuccess,
}: Readonly<AppointmentModalProps>) {
	const [isLoading, setIsLoading] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		appointment?.serviceDate ? new Date(appointment.serviceDate) : undefined
	);

	const isEditing = !!appointment;

	const form = useForm<AppointmentFormData>({
		resolver: zodResolver(appointmentSchema),
		defaultValues: {
			patientId: appointment?.patientId || "",
			doctorId: appointment?.doctorId || "",
			locationId: appointment?.locationId || "",
			serviceDate: appointment?.serviceDate
				? new Date(appointment.serviceDate)
				: new Date(),
			timeStart: appointment?.timeStart || "",
			timeEnd: appointment?.timeEnd || "",
			reason: appointment?.reason || "",
			priceAmount: appointment?.priceAmount || 0,
			notes: appointment?.notes || "",
		},
	});

	const onSubmit = async (data: AppointmentFormData) => {
		setIsLoading(true);

		try {
			// Mock API call - replace with actual implementation
			const submitData = {
				...data,
				serviceDate: format(data.serviceDate, "yyyy-MM-dd"),
			};

			// Simulate API call with submitData
			console.warn("Submitting appointment data:", submitData);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			toast.success(
				isEditing
					? "Appointment updated successfully"
					: "Appointment created successfully"
			);

			onSuccess?.();
			onClose();
			form.reset();
		} catch (error: any) {
			toast.error(error.message || "Failed to save appointment");
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		form.reset();
		setSelectedDate(undefined);
		onClose();
	};

	const handleStartTimeChange = (startTime: string) => {
		form.setValue("timeStart", startTime);

		const [hours, minutes] = startTime.split(":").map(Number);
		const endMinutes = (minutes ?? 0) + 30;
		const endHours = endMinutes >= 60 ? (hours ?? 0) + 1 : (hours ?? 0);
		const finalMinutes = endMinutes >= 60 ? endMinutes - 60 : endMinutes;

		const endTime = `${endHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`;
		form.setValue("timeEnd", endTime);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<CalendarIcon className="h-5 w-5" />
						{isEditing ? "Edit Appointment" : "Create New Appointment"}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the appointment details below."
							: "Fill in the details to create a new appointment."}
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
						<div className="space-y-2">
							<Label htmlFor="patientId" className="flex items-center gap-2">
								<User className="h-4 w-4" />
								Patient *
							</Label>
							<Select
								value={form.watch("patientId")}
								onValueChange={(value) => form.setValue("patientId", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select patient" />
								</SelectTrigger>
								<SelectContent>
									{mockPatients.map((patient) => (
										<SelectItem key={patient.id} value={patient.id}>
											<div>
												<div className="font-medium">{patient.fullName}</div>
												<div className="text-muted-foreground text-sm">
													{patient.phone}
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{form.formState.errors.patientId && (
								<p className="text-sm text-red-500">
									{form.formState.errors.patientId.message}
								</p>
							)}
						</div>

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
					</div>

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

					<div className="grid grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<CalendarIcon className="h-4 w-4" />
								Date *
							</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											"w-full justify-start text-left font-normal",
											!selectedDate && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={selectedDate}
										onSelect={(date) => {
											setSelectedDate(date);
											if (date) form.setValue("serviceDate", date);
										}}
										disabled={(date) => date < new Date()}
										autoFocus
									/>
								</PopoverContent>
							</Popover>
							{form.formState.errors.serviceDate && (
								<p className="text-sm text-red-500">
									{form.formState.errors.serviceDate.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								Start Time *
							</Label>
							<Select
								value={form.watch("timeStart")}
								onValueChange={handleStartTimeChange}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select time" />
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

						<div className="space-y-2">
							<Label className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								End Time *
							</Label>
							<Input
								value={form.watch("timeEnd")}
								readOnly
								className="bg-muted"
								placeholder="Auto-calculated"
							/>
							{form.formState.errors.timeEnd && (
								<p className="text-sm text-red-500">
									{form.formState.errors.timeEnd.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="reason">Reason for Visit *</Label>
							<Textarea
								{...form.register("reason")}
								placeholder="Enter reason for the appointment"
								rows={3}
							/>
							{form.formState.errors.reason && (
								<p className="text-sm text-red-500">
									{form.formState.errors.reason.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="priceAmount">Price (VND) *</Label>
							<Input
								type="number"
								{...form.register("priceAmount", { valueAsNumber: true })}
								placeholder="Enter price amount"
								min="0"
								step="1000"
							/>
							{form.formState.errors.priceAmount && (
								<p className="text-sm text-red-500">
									{form.formState.errors.priceAmount.message}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="notes">Additional Notes</Label>
						<Textarea
							{...form.register("notes")}
							placeholder="Any additional notes or special instructions"
							rows={2}
						/>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={handleClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{isEditing ? "Update Appointment" : "Create Appointment"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
