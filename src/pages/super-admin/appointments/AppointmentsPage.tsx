import { useState, useEffect, useMemo } from "react";
import debounce from "debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Search,
	MoreHorizontal,
	Eye,
	Edit,
	X,
	CheckCircle,
	Calendar,
	User,
	Clock,
	MapPin,
	Phone,
	Plus,
} from "lucide-react";
import { toast } from "sonner";
import { AppointmentModal } from "@/components/modals/AppointmentModal";

// Mock appointment statuses
const APPOINTMENT_STATUSES = {
	BOOKED: {
		color: "bg-blue-100 text-blue-800 border-blue-200",
		label: "Booked",
	},
	CONFIRMED: {
		color: "bg-green-100 text-green-800 border-green-200",
		label: "Confirmed",
	},
	RESCHEDULED: {
		color: "bg-yellow-100 text-yellow-800 border-yellow-200",
		label: "Rescheduled",
	},
	CANCELLED_BY_PATIENT: {
		color: "bg-red-100 text-red-800 border-red-200",
		label: "Cancelled by Patient",
	},
	CANCELLED_BY_STAFF: {
		color: "bg-red-100 text-red-800 border-red-200",
		label: "Cancelled by Staff",
	},
	NO_SHOW: {
		color: "bg-orange-100 text-orange-800 border-orange-200",
		label: "No Show",
	},
	COMPLETED: {
		color: "bg-emerald-100 text-emerald-800 border-emerald-200",
		label: "Completed",
	},
};

// Mock data for demonstration - replace with actual API calls
const mockAppointments = [
	{
		id: "1",
		patient: { fullName: "Trần Văn An", phone: "0901234567" },
		doctor: { fullName: "Dr. Nguyễn Văn Minh" },
		location: { name: "Main Hospital" },
		serviceDate: "2024-09-28",
		timeStart: "08:30",
		timeEnd: "09:00",
		status: "CONFIRMED",
		reason: "Regular checkup",
		priceAmount: 300000,
		currency: "VND",
		createdAt: "2024-09-26T10:00:00Z",
	},
	{
		id: "2",
		patient: { fullName: "Nguyễn Thị Bích", phone: "0987654321" },
		doctor: { fullName: "Dr. Trần Thị Lan" },
		location: { name: "Branch A" },
		serviceDate: "2024-09-28",
		timeStart: "14:30",
		timeEnd: "15:00",
		status: "BOOKED",
		reason: "Follow-up appointment",
		priceAmount: 250000,
		currency: "VND",
		createdAt: "2024-09-26T09:30:00Z",
	},
	{
		id: "3",
		patient: { fullName: "Lê Văn Cường", phone: "0912345678" },
		doctor: { fullName: "Dr. Lê Văn Hoàng" },
		location: { name: "Main Hospital" },
		serviceDate: "2024-09-29",
		timeStart: "10:00",
		timeEnd: "10:30",
		status: "COMPLETED",
		reason: "Consultation",
		priceAmount: 400000,
		currency: "VND",
		createdAt: "2024-09-25T14:20:00Z",
	},
	{
		id: "4",
		patient: { fullName: "Phạm Thị Dung", phone: "0934567890" },
		doctor: { fullName: "Dr. Nguyễn Văn Minh" },
		location: { name: "Main Hospital" },
		serviceDate: "2024-09-27",
		timeStart: "09:00",
		timeEnd: "09:30",
		status: "NO_SHOW",
		reason: "Emergency consultation",
		priceAmount: 350000,
		currency: "VND",
		createdAt: "2024-09-24T11:15:00Z",
	},
];

export function AppointmentsPage() {
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	// Create debounced function for search
	const debouncedSetSearch = useMemo(
		() =>
			debounce((value: string) => {
				setDebouncedSearch(value);
			}, 300),
		[]
	);

	// Update debounced search when search changes
	useEffect(() => {
		debouncedSetSearch(search);
		return () => {
			debouncedSetSearch.clear();
		};
	}, [search, debouncedSetSearch]);
	const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
		null
	);
	const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [appointmentToCancel, setAppointmentToCancel] = useState<any | null>(
		null
	);

	const isLoading = false;
	const error = null;

	const filteredAppointments = mockAppointments.filter((appointment) => {
		const matchesSearch =
			appointment.patient.fullName
				.toLowerCase()
				.includes(debouncedSearch.toLowerCase()) ||
			appointment.doctor.fullName
				.toLowerCase()
				.includes(debouncedSearch.toLowerCase()) ||
			appointment.patient.phone.includes(debouncedSearch);

		const matchesStatus = true;
		return matchesSearch && matchesStatus;
	});

	const handleCreateAppointment = () => {
		setSelectedAppointment(null);
		setAppointmentModalOpen(true);
	};

	const handleEditAppointment = (appointment: any) => {
		setSelectedAppointment(appointment);
		setAppointmentModalOpen(true);
	};

	const handleAppointmentSuccess = () => {
		// Refresh data here if needed
		toast.success("Appointment saved successfully");
	};

	const handleViewAppointment = (appointment: any) => {
		setSelectedAppointment(appointment);
		setViewDialogOpen(true);
	};

	const handleCancelAppointment = (appointment: any) => {
		setAppointmentToCancel(appointment);
		setCancelDialogOpen(true);
	};

	const confirmCancel = () => {
		if (!appointmentToCancel) return;

		try {
			// Mock cancel - replace with actual API call
			toast.success("Appointment cancelled successfully");
			setCancelDialogOpen(false);
			setAppointmentToCancel(null);
		} catch (error: any) {
			toast.error(error.message || "Failed to cancel appointment");
		}
	};

	const handleStatusChange = (_appointment: any, newStatus: string) => {
		try {
			// Mock status update - replace with actual API call
			toast.success(
				`Appointment status updated to ${APPOINTMENT_STATUSES[newStatus as keyof typeof APPOINTMENT_STATUSES]?.label}`
			);
		} catch (error: any) {
			toast.error(error.message || "Failed to update appointment status");
		}
	};

	const totalAppointments = filteredAppointments.length;
	const completedCount = filteredAppointments.filter(
		(a) => a.status === "COMPLETED"
	).length;
	const pendingCount = filteredAppointments.filter((a) =>
		["BOOKED", "CONFIRMED"].includes(a.status)
	).length;

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-2 pt-2">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
					<p className="text-muted-foreground">
						Monitor and manage patient appointments
					</p>
				</div>
				<Button onClick={handleCreateAppointment} className="gap-2">
					<Plus className="h-4 w-4" />
					Book Appointment
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Appointments
						</CardTitle>
						<Calendar className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold">{totalAppointments}</div>
						)}
						<p className="text-muted-foreground text-xs">All appointments</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Completed</CardTitle>
						<CheckCircle className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold text-green-600">
								{completedCount}
							</div>
						)}
						<p className="text-muted-foreground text-xs">
							Successfully completed
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending</CardTitle>
						<Clock className="h-4 w-4 text-blue-600" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold text-blue-600">
								{pendingCount}
							</div>
						)}
						<p className="text-muted-foreground text-xs">Awaiting service</p>
					</CardContent>
				</Card>
			</div>

			{/* Appointments Table */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-4">
						<div className="relative max-w-sm flex-1">
							<Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
							<Input
								placeholder="Search appointments..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-16 w-full" />
							))}
						</div>
					) : error ? (
						<div className="py-8 text-center">
							<p className="text-muted-foreground">
								Failed to load appointments
							</p>
						</div>
					) : filteredAppointments.length === 0 ? (
						<div className="py-8 text-center">
							<Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
							<p className="text-muted-foreground">No appointments found</p>
						</div>
					) : (
						<div className="overflow-hidden rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Patient</TableHead>
										<TableHead>Doctor</TableHead>
										<TableHead>Date & Time</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Booked</TableHead>
										<TableHead className="w-[70px]">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredAppointments.map((appointment: any) => (
										<TableRow key={appointment.id}>
											<TableCell className="font-medium">
												<div className="flex items-center gap-3">
													<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
														<User className="text-primary h-4 w-4" />
													</div>
													<div>
														<div className="font-medium">
															{appointment.patient.fullName}
														</div>
														<div className="text-muted-foreground flex items-center gap-1 text-sm">
															<Phone className="h-3 w-3" />
															{appointment.patient.phone}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="text-sm font-medium">
													{appointment.doctor.fullName}
												</div>
											</TableCell>
											<TableCell>
												<div className="text-sm">
													<div className="font-medium">
														{new Date(
															appointment.serviceDate
														).toLocaleDateString()}
													</div>
													<div className="text-muted-foreground flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{appointment.timeStart} - {appointment.timeEnd}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2 text-sm">
													<MapPin className="h-3 w-3" />
													{appointment.location.name}
												</div>
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={
														APPOINTMENT_STATUSES[
															appointment.status as keyof typeof APPOINTMENT_STATUSES
														]?.color
													}
												>
													{
														APPOINTMENT_STATUSES[
															appointment.status as keyof typeof APPOINTMENT_STATUSES
														]?.label
													}
												</Badge>
											</TableCell>
											<TableCell className="font-medium">
												{formatCurrency(appointment.priceAmount)}
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{new Date(appointment.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-8 w-8 p-0"
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => handleViewAppointment(appointment)}
														>
															<Eye className="mr-2 h-4 w-4" />
															View Details
														</DropdownMenuItem>
														{["BOOKED", "CONFIRMED"].includes(
															appointment.status
														) && (
															<DropdownMenuItem
																onClick={() =>
																	handleEditAppointment(appointment)
																}
															>
																<Edit className="mr-2 h-4 w-4" />
																Edit Appointment
															</DropdownMenuItem>
														)}
														{appointment.status === "BOOKED" && (
															<DropdownMenuItem
																onClick={() =>
																	handleStatusChange(appointment, "CONFIRMED")
																}
															>
																<CheckCircle className="mr-2 h-4 w-4" />
																Confirm
															</DropdownMenuItem>
														)}
														{["BOOKED", "CONFIRMED"].includes(
															appointment.status
														) && (
															<>
																<DropdownMenuItem
																	onClick={() =>
																		handleStatusChange(appointment, "COMPLETED")
																	}
																>
																	<CheckCircle className="mr-2 h-4 w-4" />
																	Mark as Completed
																</DropdownMenuItem>
																<DropdownMenuSeparator />
																<DropdownMenuItem
																	className="text-red-600"
																	onClick={() =>
																		handleCancelAppointment(appointment)
																	}
																>
																	<X className="mr-2 h-4 w-4" />
																	Cancel Appointment
																</DropdownMenuItem>
															</>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* View Appointment Dialog */}
			<AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Appointment Details</AlertDialogTitle>
					</AlertDialogHeader>
					{selectedAppointment && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="font-medium">Patient</p>
									<p className="text-muted-foreground text-sm">
										{selectedAppointment.patient.fullName}
									</p>
									<p className="text-muted-foreground text-sm">
										{selectedAppointment.patient.phone}
									</p>
								</div>
								<div>
									<p className="font-medium">Doctor</p>
									<p className="text-muted-foreground text-sm">
										{selectedAppointment.doctor.fullName}
									</p>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="font-medium">Date & Time</p>
									<p className="text-muted-foreground text-sm">
										{new Date(
											selectedAppointment.serviceDate
										).toLocaleDateString()}
									</p>
									<p className="text-muted-foreground text-sm">
										{selectedAppointment.timeStart} -{" "}
										{selectedAppointment.timeEnd}
									</p>
								</div>
								<div>
									<p className="font-medium">Location</p>
									<p className="text-muted-foreground text-sm">
										{selectedAppointment.location.name}
									</p>
								</div>
							</div>
							<div>
								<p className="font-medium">Reason</p>
								<p className="text-muted-foreground text-sm">
									{selectedAppointment.reason}
								</p>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="font-medium">Status</p>
									<Badge
										variant="outline"
										className={
											APPOINTMENT_STATUSES[
												selectedAppointment.status as keyof typeof APPOINTMENT_STATUSES
											]?.color
										}
									>
										{
											APPOINTMENT_STATUSES[
												selectedAppointment.status as keyof typeof APPOINTMENT_STATUSES
											]?.label
										}
									</Badge>
								</div>
								<div>
									<p className="font-medium">Amount</p>
									<p className="text-muted-foreground text-sm">
										{formatCurrency(selectedAppointment.priceAmount)}
									</p>
								</div>
							</div>
						</div>
					)}
					<AlertDialogFooter>
						<AlertDialogCancel>Close</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Cancel Appointment Dialog */}
			<AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to cancel the appointment for "
							{appointmentToCancel?.patient.fullName}"? This action cannot be
							undone and the patient will be notified.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Keep Appointment</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmCancel}
							className="bg-red-600 hover:bg-red-700"
						>
							Cancel Appointment
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Appointment Modal */}
			<AppointmentModal
				open={appointmentModalOpen}
				onClose={() => setAppointmentModalOpen(false)}
				appointment={selectedAppointment}
				onSuccess={handleAppointmentSuccess}
			/>
		</div>
	);
}
