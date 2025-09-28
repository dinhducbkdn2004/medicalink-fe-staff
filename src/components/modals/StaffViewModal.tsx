import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Calendar,
	User,
	MapPin,
	Stethoscope,
	GraduationCap,
	Award,
	Activity,
	Star,
	Edit,
	Mail,
	Calendar as CalendarDays,
} from "lucide-react";
import { format } from "date-fns";

interface Staff {
	id: string;
	fullName: string;
	email: string;
	phone?: string;
	gender: "MALE" | "FEMALE" | "OTHER";
	dateOfBirth?: string;
	avatar?: string;
	role: "DOCTOR" | "ADMIN" | "SUPER_ADMIN";
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	// Doctor specific fields
	specialtyId?: string;
	specialty?: {
		name: string;
		description: string;
	};
	licenseNumber?: string;
	experience?: number;
	education?: string;
	// Admin specific fields
	department?: string;
	position?: string;
}

interface StaffViewModalProps {
	open: boolean;
	onClose: () => void;
	staff: Staff | null;
	onEdit?: () => void;
}

export function StaffViewModal({
	open,
	onClose,
	staff,
	onEdit,
}: Readonly<StaffViewModalProps>) {
	if (!staff) return null;

	const isDoctor = staff.role === "DOCTOR";
	const isAdmin = staff.role === "ADMIN" || staff.role === "SUPER_ADMIN";

	// Mock statistics
	const mockStats = isDoctor
		? {
				totalAppointments: 1247,
				completedAppointments: 1198,
				cancelledAppointments: 49,
				averageRating: 4.8,
				totalPatients: 890,
				monthlyAppointments: 87,
				nextAppointment: "2024-09-28T10:30:00Z",
				workLocations: ["Main Hospital", "Branch A"],
			}
		: {
				tasksCompleted: 342,
				pendingTasks: 12,
				staffManaged: 25,
				systemUptime: 99.8,
				reportsGenerated: 156,
				lastLogin: "2024-09-27T08:30:00Z",
			};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const getRoleIcon = () => {
		if (isDoctor) return <Stethoscope className="h-4 w-4" />;
		return <User className="h-4 w-4" />;
	};

	const getRoleColor = () => {
		switch (staff.role) {
			case "DOCTOR":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "ADMIN":
				return "bg-green-100 text-green-800 border-green-200";
			case "SUPER_ADMIN":
				return "bg-purple-100 text-purple-800 border-purple-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
				<DialogHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="h-16 w-16">
								<AvatarImage src={staff.avatar} alt={staff.fullName} />
								<AvatarFallback className="text-lg">
									{getInitials(staff.fullName)}
								</AvatarFallback>
							</Avatar>
							<div>
								<DialogTitle className="flex items-center gap-2 text-xl">
									{staff.fullName}
									<Badge variant="outline" className={getRoleColor()}>
										{getRoleIcon()}
										{staff.role.replace("_", " ")}
									</Badge>
								</DialogTitle>
								<DialogDescription className="mt-1 space-y-1">
									<div className="flex items-center gap-2">
										<Mail className="h-4 w-4" />
										{staff.email}
									</div>
									{staff.specialty && (
										<div className="flex items-center gap-2">
											<Stethoscope className="h-4 w-4" />
											{staff.specialty.name}
										</div>
									)}
								</DialogDescription>
							</div>
						</div>
						{onEdit && (
							<Button variant="outline" size="sm" onClick={onEdit}>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</Button>
						)}
					</div>
				</DialogHeader>

				<div className="space-y-6">
					{/* Quick Stats */}
					<div className="grid grid-cols-4 gap-4">
						{isDoctor ? (
							<>
								<Card>
									<CardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-blue-600">
											{mockStats.totalAppointments}
										</div>
										<p className="text-muted-foreground text-sm">Total Apps</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-green-600">
											{mockStats.totalPatients}
										</div>
										<p className="text-muted-foreground text-sm">Patients</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-4 text-center">
										<div className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-600">
											{mockStats.averageRating}
											<Star className="h-5 w-5 fill-current" />
										</div>
										<p className="text-muted-foreground text-sm">Rating</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-purple-600">
											{staff.experience || "N/A"}
										</div>
										<p className="text-muted-foreground text-sm">Years Exp</p>
									</CardContent>
								</Card>
							</>
						) : (
							<>
								<Card>
									<CardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-blue-600">
											{mockStats.tasksCompleted}
										</div>
										<p className="text-muted-foreground text-sm">Tasks Done</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-orange-600">
											{mockStats.pendingTasks}
										</div>
										<p className="text-muted-foreground text-sm">Pending</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-green-600">
											{mockStats.staffManaged}
										</div>
										<p className="text-muted-foreground text-sm">
											Staff Managed
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="p-4 text-center">
										<div className="text-2xl font-bold text-purple-600">
											{mockStats.systemUptime}%
										</div>
										<p className="text-muted-foreground text-sm">Uptime</p>
									</CardContent>
								</Card>
							</>
						)}
					</div>

					{/* Personal Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<User className="h-4 w-4" />
								Personal Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<p className="text-muted-foreground text-sm font-medium">
											Full Name
										</p>
										<p className="mt-1 text-sm">{staff.fullName}</p>
									</div>
									<div>
										<p className="text-muted-foreground text-sm font-medium">
											Email
										</p>
										<p className="mt-1 text-sm">{staff.email}</p>
									</div>
									<div>
										<p className="text-muted-foreground text-sm font-medium">
											Gender
										</p>
										<p className="mt-1 text-sm capitalize">
											{staff.gender?.toLowerCase() || "Not specified"}
										</p>
									</div>
								</div>
								<div className="space-y-4">
									{staff.phone && (
										<div>
											<p className="text-muted-foreground text-sm font-medium">
												Phone
											</p>
											<p className="mt-1 text-sm">{staff.phone}</p>
										</div>
									)}
									{staff.dateOfBirth && (
										<div>
											<p className="text-muted-foreground text-sm font-medium">
												Date of Birth
											</p>
											<p className="mt-1 text-sm">
												{format(new Date(staff.dateOfBirth), "PPP")}
											</p>
										</div>
									)}
									<div>
										<p className="text-muted-foreground text-sm font-medium">
											Status
										</p>
										<Badge
											variant={staff.isActive ? "default" : "secondary"}
											className="mt-1"
										>
											{staff.isActive ? "Active" : "Inactive"}
										</Badge>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Professional Information */}
					{isDoctor && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<Stethoscope className="h-4 w-4" />
									Professional Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-6">
									<div className="space-y-4">
										{staff.specialty && (
											<div>
												<p className="text-muted-foreground text-sm font-medium">
													Specialty
												</p>
												<div className="mt-1">
													<Badge
														variant="outline"
														className="flex w-fit items-center gap-1"
													>
														<Stethoscope className="h-3 w-3" />
														{staff.specialty.name}
													</Badge>
													<p className="text-muted-foreground mt-1 text-xs">
														{staff.specialty.description}
													</p>
												</div>
											</div>
										)}
										{staff.licenseNumber && (
											<div>
												<p className="text-muted-foreground text-sm font-medium">
													License Number
												</p>
												<p className="bg-muted mt-1 rounded px-2 py-1 font-mono text-sm">
													{staff.licenseNumber}
												</p>
											</div>
										)}
									</div>
									<div className="space-y-4">
										{staff.experience && (
											<div>
												<p className="text-muted-foreground text-sm font-medium">
													Experience
												</p>
												<div className="mt-1 flex items-center gap-2">
													<Award className="h-4 w-4" />
													<span className="text-sm">
														{staff.experience} years
													</span>
												</div>
											</div>
										)}
										{staff.education && (
											<div>
												<p className="text-muted-foreground text-sm font-medium">
													Education
												</p>
												<div className="mt-1 flex items-center gap-2">
													<GraduationCap className="h-4 w-4" />
													<span className="text-sm">{staff.education}</span>
												</div>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Admin Information */}
					{isAdmin && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<User className="h-4 w-4" />
									Administrative Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-6">
									<div className="space-y-4">
										{staff.department && (
											<div>
												<p className="text-muted-foreground text-sm font-medium">
													Department
												</p>
												<p className="mt-1 text-sm">{staff.department}</p>
											</div>
										)}
										{staff.position && (
											<div>
												<p className="text-muted-foreground text-sm font-medium">
													Position
												</p>
												<p className="mt-1 text-sm">{staff.position}</p>
											</div>
										)}
									</div>
									<div className="space-y-4">
										<div>
											<p className="text-muted-foreground text-sm font-medium">
												Last Login
											</p>
											<p className="mt-1 text-sm">
												{mockStats.lastLogin
													? format(new Date(mockStats.lastLogin), "PPP 'at' p")
													: "Never"}
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Work Locations */}
					{isDoctor && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<MapPin className="h-4 w-4" />
									Work Locations
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{mockStats.workLocations?.map((location) => (
										<Badge
											key={location}
											variant="outline"
											className="flex items-center gap-1"
										>
											<MapPin className="h-3 w-3" />
											{location}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Recent Activity */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Activity className="h-4 w-4" />
								Recent Activity
							</CardTitle>
						</CardHeader>
						<CardContent>
							{isDoctor && mockStats.nextAppointment && (
								<div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
									<div className="mb-1 flex items-center gap-2 text-blue-800">
										<CalendarDays className="h-4 w-4" />
										<span className="text-sm font-medium">
											Next Appointment
										</span>
									</div>
									<p className="text-sm text-blue-600">
										{format(new Date(mockStats.nextAppointment), "PPP 'at' p")}
									</p>
								</div>
							)}
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-2 w-2 rounded-full bg-green-500" />
										<span className="text-sm">
											{isDoctor
												? "Last patient consultation"
												: "System configuration updated"}
										</span>
									</div>
									<span className="text-muted-foreground text-sm">
										2 hours ago
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-2 w-2 rounded-full bg-blue-500" />
										<span className="text-sm">
											{isDoctor
												? "Appointment scheduled"
												: "Staff training completed"}
										</span>
									</div>
									<span className="text-muted-foreground text-sm">
										5 hours ago
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-2 w-2 rounded-full bg-purple-500" />
										<span className="text-sm">
											{isDoctor
												? "Medical records updated"
												: "Report generated"}
										</span>
									</div>
									<span className="text-muted-foreground text-sm">
										1 day ago
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Timeline */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Calendar className="h-4 w-4" />
								Account Timeline
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-2 w-2 rounded-full bg-green-500" />
										<span className="text-sm">Account Created</span>
									</div>
									<span className="text-muted-foreground text-sm">
										{format(new Date(staff.createdAt), "PPP 'at' p")}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-2 w-2 rounded-full bg-blue-500" />
										<span className="text-sm">Last Profile Update</span>
									</div>
									<span className="text-muted-foreground text-sm">
										{format(new Date(staff.updatedAt), "PPP 'at' p")}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
