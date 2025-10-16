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
import { toast } from "sonner";
import { ScheduleModal } from "@/components/modals/ScheduleModal";
import {
	Calendar,
	Search,
	MoreHorizontal,
	Edit,
	Trash2,
	ToggleLeft,
	ToggleRight,
	Clock,
	Users,
	CalendarDays,
	MapPin,
	User,
} from "lucide-react";

const mockSchedules = [
	{
		id: "1",
		doctor: { fullName: "Dr. Nguyễn Văn Minh" },
		location: { name: "Main Hospital - Cardiology" },
		serviceDate: "2024-09-28",
		timeStart: "08:00",
		timeEnd: "12:00",
		capacity: 10,
		bookedSlots: 7,
		isActive: true,
		createdAt: "2024-09-26T10:00:00Z",
	},
	{
		id: "2",
		doctor: { fullName: "Dr. Trần Thị Lan" },
		location: { name: "Branch A - Pediatrics" },
		serviceDate: "2024-09-28",
		timeStart: "14:00",
		timeEnd: "18:00",
		capacity: 8,
		bookedSlots: 3,
		isActive: true,
		createdAt: "2024-09-26T09:30:00Z",
	},
	{
		id: "3",
		doctor: { fullName: "Dr. Lê Văn Hoàng" },
		location: { name: "Main Hospital - Neurology" },
		serviceDate: "2024-09-29",
		timeStart: "08:30",
		timeEnd: "11:30",
		capacity: 6,
		bookedSlots: 6,
		isActive: true,
		createdAt: "2024-09-25T14:20:00Z",
	},
];

export function SchedulesPage() {
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");

	const debouncedSetSearch = useMemo(
		() =>
			debounce((value: string) => {
				setDebouncedSearch(value);
			}, 300),
		[]
	);

	useEffect(() => {
		debouncedSetSearch(search);
		return () => {
			debouncedSetSearch.clear();
		};
	}, [search, debouncedSetSearch]);
	const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);
	const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [scheduleToDelete, setScheduleToDelete] = useState<any | null>(null);

	const isLoading = false;
	const error = null;

	const filteredSchedules = mockSchedules.filter(
		(schedule) =>
			schedule.doctor.fullName
				.toLowerCase()
				.includes(debouncedSearch.toLowerCase()) ||
			schedule.location.name
				.toLowerCase()
				.includes(debouncedSearch.toLowerCase())
	);

	const handleEditSchedule = (schedule: any) => {
		setSelectedSchedule(schedule);
		setScheduleModalOpen(true);
	};

	const handleScheduleSuccess = () => {
		toast.success("Schedule saved successfully");
	};

	const handleDeleteSchedule = (schedule: any) => {
		setScheduleToDelete(schedule);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (!scheduleToDelete) return;

		try {
			toast.success("Schedule deleted successfully");
			setDeleteDialogOpen(false);
			setScheduleToDelete(null);
		} catch (error: any) {
			toast.error(error.message || "Failed to delete schedule");
		}
	};

	const handleToggleStatus = (schedule: any) => {
		try {
			toast.success(
				`Schedule ${!schedule.isActive ? "activated" : "deactivated"} successfully`
			);
		} catch (error: any) {
			toast.error(error.message || "Failed to update schedule status");
		}
	};

	const totalSchedules = filteredSchedules.length;
	const activeSchedules = filteredSchedules.filter((s) => s.isActive).length;
	const totalCapacity = filteredSchedules.reduce(
		(sum, s) => sum + s.capacity,
		0
	);

	return (
		<div className="flex flex-1 flex-col gap-4">
			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Schedules
						</CardTitle>
						<CalendarDays className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold">{totalSchedules}</div>
						)}
						<p className="text-muted-foreground text-xs">
							All doctor schedules
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Schedules
						</CardTitle>
						<div className="h-4 w-4 rounded-full bg-green-500" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold text-green-600">
								{activeSchedules}
							</div>
						)}
						<p className="text-muted-foreground text-xs">Currently available</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Capacity
						</CardTitle>
						<Users className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className="h-8 w-16" />
						) : (
							<div className="text-2xl font-bold text-blue-600">
								{totalCapacity}
							</div>
						)}
						<p className="text-muted-foreground text-xs">Available slots</p>
					</CardContent>
				</Card>
			</div>

			{/* Schedules Table */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-4">
						<div className="relative max-w-sm flex-1">
							<Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
							<Input
								placeholder="Search schedules..."
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
							<p className="text-muted-foreground">Failed to load schedules</p>
						</div>
					) : filteredSchedules.length === 0 ? (
						<div className="py-8 text-center">
							<Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
							<p className="text-muted-foreground">No schedules found</p>
						</div>
					) : (
						<div className="overflow-hidden rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Doctor</TableHead>
										<TableHead>Location</TableHead>
										<TableHead>Date & Time</TableHead>
										<TableHead>Capacity</TableHead>
										<TableHead>Bookings</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Created</TableHead>
										<TableHead className="w-[70px]">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredSchedules.map((schedule: any) => (
										<TableRow key={schedule.id}>
											<TableCell className="font-medium">
												<div className="flex items-center gap-3">
													<div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
														<User className="text-primary h-4 w-4" />
													</div>
													{schedule.doctor.fullName}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2 text-sm">
													<MapPin className="h-3 w-3" />
													{schedule.location.name}
												</div>
											</TableCell>
											<TableCell>
												<div className="text-sm">
													<div className="font-medium">
														{new Date(
															schedule.serviceDate
														).toLocaleDateString()}
													</div>
													<div className="text-muted-foreground flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{schedule.timeStart} - {schedule.timeEnd}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="text-center">
													<div className="text-lg font-semibold">
														{schedule.capacity}
													</div>
													<div className="text-muted-foreground text-xs">
														slots
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<div className="text-sm">
														{schedule.bookedSlots} / {schedule.capacity}
													</div>
													<div className="h-2 flex-1 rounded-full bg-gray-200">
														<div
															className="h-2 rounded-full bg-blue-600 transition-all"
															style={{
																width: `${(schedule.bookedSlots / schedule.capacity) * 100}%`,
															}}
														/>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge
													variant={schedule.isActive ? "default" : "secondary"}
													className={
														schedule.isActive
															? "border-green-200 bg-green-100 text-green-800"
															: "border-gray-200 bg-gray-100 text-gray-600"
													}
												>
													{schedule.isActive ? "Active" : "Inactive"}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{new Date(schedule.createdAt).toLocaleDateString()}
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
															onClick={() => handleEditSchedule(schedule)}
														>
															<Edit className="mr-2 h-4 w-4" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleToggleStatus(schedule)}
														>
															{schedule.isActive ? (
																<ToggleLeft className="mr-2 h-4 w-4" />
															) : (
																<ToggleRight className="mr-2 h-4 w-4" />
															)}
															{schedule.isActive ? "Deactivate" : "Activate"}
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															className="text-red-600"
															onClick={() => handleDeleteSchedule(schedule)}
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Delete
														</DropdownMenuItem>
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

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							schedule for "{scheduleToDelete?.doctor.fullName}" and cancel all
							associated appointments.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Schedule Modal */}
			<ScheduleModal
				open={scheduleModalOpen}
				onClose={() => setScheduleModalOpen(false)}
				schedule={selectedSchedule}
				onSuccess={handleScheduleSuccess}
			/>
		</div>
	);
}
