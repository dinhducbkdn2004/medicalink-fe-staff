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
	Clock,
	Stethoscope,
	FileText,
	User,
	Building,
	MapPin,
	Edit,
} from "lucide-react";
import { format } from "date-fns";
import type { Specialty, InfoSection } from "@/api/specialties";

interface SpecialtyViewModalProps {
	open: boolean;
	onClose: () => void;
	specialty: Specialty | null;
	onEdit?: () => void;
}

export function SpecialtyViewModal({
	open,
	onClose,
	specialty,
	onEdit,
}: Readonly<SpecialtyViewModalProps>) {
	if (!specialty) return null;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
								<Stethoscope className="text-primary h-5 w-5" />
							</div>
							<div>
								<DialogTitle className="text-xl">{specialty.name}</DialogTitle>
								<DialogDescription className="mt-1">
									Specialty Information & Details
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
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<FileText className="h-4 w-4" />
								Basic Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-muted-foreground text-sm font-medium">
										Status
									</p>
									<Badge
										variant={specialty.isActive ? "default" : "secondary"}
										className="mt-1"
									>
										{specialty.isActive ? "Active" : "Inactive"}
									</Badge>
								</div>
								<div>
									<p className="text-muted-foreground text-sm font-medium">
										Specialty ID
									</p>
									<p className="bg-muted mt-1 rounded px-2 py-1 font-mono text-sm">
										{specialty.id}
									</p>
								</div>
							</div>
							<div>
								<p className="text-muted-foreground text-sm font-medium">
									Description
								</p>
								<p className="mt-1 text-sm leading-relaxed">
									{specialty.description}
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Info Sections */}
					{specialty.infoSections && specialty.infoSections.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<FileText className="h-4 w-4" />
									Information Sections
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{specialty.infoSections.map(
									(section: InfoSection, index: number) => (
										<div key={section.id}>
											{index > 0 && <Separator className="my-4" />}
											<div className="space-y-2">
												<div className="flex items-center justify-between">
													<h4 className="font-medium">{section.name}</h4>
													<Badge variant="outline" className="text-xs">
														Order: {section.order || index + 1}
													</Badge>
												</div>
												<div
													className="text-muted-foreground prose prose-sm max-w-none text-sm"
													dangerouslySetInnerHTML={{ __html: section.content }}
												/>
												<p className="text-muted-foreground text-xs">
													Created: {format(new Date(section.createdAt), "PPP")}
												</p>
											</div>
										</div>
									)
								)}
							</CardContent>
						</Card>
					)}

					{/* Statistics */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<User className="h-4 w-4" />
								Statistics & Usage
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-3 gap-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">12</div>
									<p className="text-muted-foreground text-sm">
										Active Doctors
									</p>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">348</div>
									<p className="text-muted-foreground text-sm">
										Total Appointments
									</p>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-purple-600">95%</div>
									<p className="text-muted-foreground text-sm">
										Satisfaction Rate
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Timeline */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Clock className="h-4 w-4" />
								Timeline
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-2 w-2 rounded-full bg-green-500" />
										<span className="text-sm">Created</span>
									</div>
									<span className="text-muted-foreground text-sm">
										{format(new Date(specialty.createdAt), "PPP 'at' p")}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-2 w-2 rounded-full bg-blue-500" />
										<span className="text-sm">Last Updated</span>
									</div>
									<span className="text-muted-foreground text-sm">
										{format(new Date(specialty.updatedAt), "PPP 'at' p")}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Associated Locations */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<MapPin className="h-4 w-4" />
								Available Locations
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="bg-muted flex items-center justify-between rounded-lg p-2">
									<div className="flex items-center gap-2">
										<Building className="h-4 w-4" />
										<span className="text-sm">Main Hospital</span>
									</div>
									<Badge variant="outline">Primary</Badge>
								</div>
								<div className="bg-muted flex items-center justify-between rounded-lg p-2">
									<div className="flex items-center gap-2">
										<Building className="h-4 w-4" />
										<span className="text-sm">Branch A</span>
									</div>
									<Badge variant="outline">Secondary</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
