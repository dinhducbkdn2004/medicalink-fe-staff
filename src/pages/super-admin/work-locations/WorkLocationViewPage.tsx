import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
	Building2,
	Edit,
	Trash2,
	ArrowLeft,
	Loader2,
	Calendar,
	Clock,
	MapPin,
	Phone,
	Globe,
	CheckCircle,
	AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { toast } from "sonner";
import {
	useWorkLocationById,
	useDeleteWorkLocation,
} from "@/hooks/api/useLocations";

export function WorkLocationViewPage() {
	const { id } = useParams({ from: "/super-admin/work-locations/$id/view" });
	const navigate = useNavigate();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const { data: locationData, isLoading } = useWorkLocationById(id);
	const deleteLocationMutation = useDeleteWorkLocation();

	const location = locationData?.data?.data;

	const handleEdit = () => {
		void navigate({
			to: "/super-admin/work-locations/$id/edit",
			params: { id },
		});
	};

	const handleDelete = async () => {
		try {
			await deleteLocationMutation.mutateAsync(id);
			toast.success("Work location deleted successfully", {
				description: "The location has been removed from the system.",
			});
			void navigate({ to: "/super-admin/work-locations" });
		} catch (error) {
			console.error("Failed to delete work location:", error);
			toast.error("Failed to delete work location", {
				description: "Please try again.",
			});
		}
	};

	const handleBack = () => {
		void navigate({ to: "/super-admin/work-locations" });
	};

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center p-6">
				<div className="flex items-center gap-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span>Loading...</span>
				</div>
			</div>
		);
	}

	if (!location) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-6">
				<Card>
					<CardContent className="p-6">
						<p className="text-muted-foreground">Work location not found.</p>
						<Button onClick={handleBack} className="mt-4">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to List
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold">{location.name}</h1>
						<p className="text-muted-foreground text-sm">
							Work Location Details
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => setIsDeleteDialogOpen(true)}
						className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Delete
					</Button>
					<Button onClick={handleEdit}>
						<Edit className="mr-2 h-4 w-4" />
						Edit
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Sidebar */}
				<div className="lg:col-span-1">
					<Card>
						<CardContent className="p-6">
							<div className="flex flex-col items-center space-y-4">
								<div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-full">
									<Building2 className="text-primary h-10 w-10" />
								</div>
								<div className="text-center">
									<h3 className="text-lg font-bold">{location.name}</h3>
									{location.city && (
										<p className="text-muted-foreground text-sm">
											{location.city}
										</p>
									)}
									<Badge
										variant={location.isActive ? "default" : "secondary"}
										className="mt-2"
									>
										{location.isActive ? (
											<>
												<CheckCircle className="mr-1 h-3 w-3" />
												Active
											</>
										) : (
											<>
												<AlertTriangle className="mr-1 h-3 w-3" />
												Inactive
											</>
										)}
									</Badge>
								</div>
							</div>

							<Separator className="my-6" />

							<div className="space-y-3">
								{location.phone && (
									<div className="flex items-center gap-3 text-sm">
										<Phone className="text-muted-foreground h-4 w-4" />
										<span>{location.phone}</span>
									</div>
								)}
								<div className="flex items-center gap-3 text-sm">
									<Globe className="text-muted-foreground h-4 w-4" />
									<span>{location.timezone}</span>
								</div>
								{location.createdAt && (
									<div className="flex items-center gap-3 text-sm">
										<Calendar className="text-muted-foreground h-4 w-4" />
										<span>
											Created{" "}
											{new Date(location.createdAt).toLocaleDateString("en-US")}
										</span>
									</div>
								)}
								{location.updatedAt && (
									<div className="flex items-center gap-3 text-sm">
										<Clock className="text-muted-foreground h-4 w-4" />
										<span>
											Updated{" "}
											{new Date(location.updatedAt).toLocaleDateString("en-US")}
										</span>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<div className="space-y-6 lg:col-span-2">
					{/* Location Information */}
					<Card>
						<CardHeader>
							<CardTitle>Location Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label className="text-muted-foreground mb-1 block text-sm">
									Location Name
								</label>
								<p className="text-base font-medium">{location.name}</p>
							</div>

							{location.address && (
								<div>
									<label className="text-muted-foreground mb-1 block text-sm">
										Address
									</label>
									<div className="flex items-start gap-2">
										<MapPin className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
										<p className="text-base">{location.address}</p>
									</div>
								</div>
							)}

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{location.city && (
									<div>
										<label className="text-muted-foreground mb-1 block text-sm">
											City
										</label>
										<p className="text-base">{location.city}</p>
									</div>
								)}

								{location.state && (
									<div>
										<label className="text-muted-foreground mb-1 block text-sm">
											State/Province
										</label>
										<p className="text-base">{location.state}</p>
									</div>
								)}

								{location.zipCode && (
									<div>
										<label className="text-muted-foreground mb-1 block text-sm">
											Zip Code
										</label>
										<p className="text-base">{location.zipCode}</p>
									</div>
								)}

								{location.phone && (
									<div>
										<label className="text-muted-foreground mb-1 block text-sm">
											Phone Number
										</label>
										<p className="text-base">{location.phone}</p>
									</div>
								)}
							</div>

							<div>
								<label className="text-muted-foreground mb-1 block text-sm">
									Timezone
								</label>
								<div className="flex items-center gap-2">
									<Globe className="text-muted-foreground h-4 w-4" />
									<p className="text-base">{location.timezone}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Work Location</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{location.name}"? This action
							cannot be undone and will permanently remove the location and all
							related data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700"
							disabled={deleteLocationMutation.isPending}
						>
							{deleteLocationMutation.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
