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
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
				<DialogHeader>
					<div className="flex items-center justify-between">
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
							<Button className="ml-auto" variant="outline" size="sm" onClick={onEdit}>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</Button>
						)}
					</div>
				</DialogHeader>

				<div className="space-y-6">


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




				</div>
			</DialogContent>
		</Dialog>
	);
}
