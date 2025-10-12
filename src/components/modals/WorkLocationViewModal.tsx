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
import { Separator } from "@/components/ui/separator";
import {
	Calendar,
	Clock,
	MapPin,
	Building,
	Phone,
	Mail,
	Globe,
	Users,
	Stethoscope,
	Edit,
	ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

interface WorkLocation {
	id: string;
	name: string;
	address: string;
	phone?: string;
	email?: string;
	timezone: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	// Additional mock data
	capacity?: number;
	currentOccupancy?: number;
	specialties?: string[];
}

interface WorkLocationViewModalProps {
	open: boolean;
	onClose: () => void;
	location: WorkLocation | null;
	onEdit?: () => void;
}

export function WorkLocationViewModal({
	open,
	onClose,
	location,
	onEdit,
}: WorkLocationViewModalProps) {
	if (!location) return null;

	// Mock data for demo
	const mockStats = {
		totalDoctors: 15,
		activeAppointments: 42,
		monthlyPatients: 1250,
		satisfactionRate: 96,
		specialties: ["Cardiology", "Neurology", "Pediatrics", "Internal Medicine"],
		operatingHours: {
			weekdays: "8:00 AM - 6:00 PM",
			saturday: "9:00 AM - 2:00 PM",
			sunday: "Closed",
		},
	};

	const occupancyPercentage = location.capacity
		? Math.round(((location.currentOccupancy || 0) / location.capacity) * 100)
		: 0;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
								<Building className="text-primary h-6 w-6" />
							</div>
							<div>
								<DialogTitle className="text-xl">{location.name}</DialogTitle>
								<DialogDescription className="mt-1 flex items-center gap-2">
									<MapPin className="h-4 w-4" />
									{location.address}
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
						<Card>
							<CardContent className="p-4 text-center">
								<div className="text-2xl font-bold text-blue-600">
									{mockStats.totalDoctors}
								</div>
								<p className="text-muted-foreground text-sm">Doctors</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 text-center">
								<div className="text-2xl font-bold text-green-600">
									{mockStats.activeAppointments}
								</div>
								<p className="text-muted-foreground text-sm">Active Apps</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 text-center">
								<div className="text-2xl font-bold text-purple-600">
									{mockStats.monthlyPatients}
								</div>
								<p className="text-muted-foreground text-sm">
									Monthly Patients
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 text-center">
								<div className="text-2xl font-bold text-orange-600">
									{occupancyPercentage}%
								</div>
								<p className="text-muted-foreground text-sm">Capacity</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Building className="h-4 w-4" />
								Location Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<p className="text-muted-foreground text-sm font-medium">
											Status
										</p>
										<Badge
											variant={location.isActive ? "default" : "secondary"}
											className="mt-1"
										>
											{location.isActive ? "Active" : "Inactive"}
										</Badge>
									</div>
									<div>
										<p className="text-muted-foreground mb-2 text-sm font-medium">
											<MapPin className="mr-1 inline h-4 w-4" />
											Address
										</p>
										<p className="bg-muted rounded-lg p-3 text-sm leading-relaxed">
											{location.address}
										</p>
										<Button variant="outline" size="sm" className="mt-2">
											<ExternalLink className="mr-2 h-4 w-4" />
											View on Map
										</Button>
									</div>
								</div>
								<div className="space-y-4">
									<div>
										<p className="text-muted-foreground mb-2 text-sm font-medium">
											<Globe className="mr-1 inline h-4 w-4" />
											Timezone
										</p>
										<p className="bg-muted rounded px-3 py-2 font-mono text-sm">
											{location.timezone}
										</p>
									</div>
									{location.capacity && (
										<div>
											<p className="text-muted-foreground mb-2 text-sm font-medium">
												<Users className="mr-1 inline h-4 w-4" />
												Capacity
											</p>
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span>Current: {location.currentOccupancy || 0}</span>
													<span>Max: {location.capacity}</span>
												</div>
												<div className="bg-muted h-2 w-full rounded-full">
													<div
														className="bg-primary h-2 rounded-full transition-all"
														style={{ width: `${occupancyPercentage}%` }}
													/>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Contact Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Phone className="h-4 w-4" />
								Contact Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								{location.phone && (
									<div className="bg-muted flex items-center gap-3 rounded-lg p-3">
										<Phone className="text-muted-foreground h-4 w-4" />
										<div>
											<p className="text-sm font-medium">Phone</p>
											<p className="text-muted-foreground text-sm">
												{location.phone}
											</p>
										</div>
									</div>
								)}
								{location.email && (
									<div className="bg-muted flex items-center gap-3 rounded-lg p-3">
										<Mail className="text-muted-foreground h-4 w-4" />
										<div>
											<p className="text-sm font-medium">Email</p>
											<p className="text-muted-foreground text-sm">
												{location.email}
											</p>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Operating Hours */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Clock className="h-4 w-4" />
								Operating Hours
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Monday - Friday</span>
									<span className="text-muted-foreground text-sm">
										{mockStats.operatingHours.weekdays}
									</span>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Saturday</span>
									<span className="text-muted-foreground text-sm">
										{mockStats.operatingHours.saturday}
									</span>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Sunday</span>
									<span className="text-muted-foreground text-sm">
										{mockStats.operatingHours.sunday}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Available Specialties */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Stethoscope className="h-4 w-4" />
								Available Specialties
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{mockStats.specialties.map((specialty) => (
									<Badge
										key={specialty}
										variant="outline"
										className="flex items-center gap-1"
									>
										<Stethoscope className="h-3 w-3" />
										{specialty}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Timeline */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Calendar className="h-4 w-4" />
								Timeline
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-2 w-2 rounded-full bg-green-500" />
										<span className="text-sm">Location Established</span>
									</div>
									<span className="text-muted-foreground text-sm">
										{format(new Date(location.createdAt), "PPP 'at' p")}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-2 w-2 rounded-full bg-blue-500" />
										<span className="text-sm">Last Updated</span>
									</div>
									<span className="text-muted-foreground text-sm">
										{format(new Date(location.updatedAt), "PPP 'at' p")}
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
