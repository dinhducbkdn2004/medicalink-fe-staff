import { useState } from "react";
import {
	Plus,
	Search,
	MoreHorizontal,
	Pencil,
	Trash2,
	MapPin,
	Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkLocations } from "@/hooks/api/useLocations";
import { toast } from "sonner";

export function WorkLocationsPage() {
	const { data: locationsData, isLoading } = useWorkLocations();
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// Use real API data
	const locations = locationsData?.data || [];

	const filteredLocations = locations.filter(
		(location: any) =>
			location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			location.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			location.city?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedLocations = filteredLocations.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	const handleCreateLocation = () => {
		toast.info("Create location functionality coming soon!");
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleEditLocation = (_locationId: string) => {
		toast.info("Edit location functionality coming soon!");
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleDeleteLocation = (_locationId: string) => {
		toast.info("Delete location functionality coming soon!");
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Total Locations
							</p>
							<p className="text-2xl font-bold">{locations.length}</p>
						</div>
						<Building2 className="text-muted-foreground h-8 w-8" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Active
							</p>
							<p className="text-2xl font-bold text-green-600">
								{locations.filter((l: any) => l.isActive !== false).length}
							</p>
						</div>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
							<div className="h-3 w-3 rounded-full bg-green-600"></div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Cities
							</p>
							<p className="text-2xl font-bold text-blue-600">
								{
									new Set(locations.map((l: any) => l.city).filter(Boolean))
										.size
								}
							</p>
						</div>
						<MapPin className="h-8 w-8 text-blue-600" />
					</CardContent>
				</Card>
			</div>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Work Locations</h1>
					<p className="text-muted-foreground">
						Manage hospital work locations and branches
					</p>
				</div>
				<Button onClick={handleCreateLocation} className="gap-2">
					<Plus className="h-4 w-4" />
					Add Location
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Building2 className="h-5 w-5" />
						Location Management
					</CardTitle>
					<CardDescription>
						A list of all work locations in the system.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Search Bar */}
					<div className="mb-6 flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
							<Input
								placeholder="Search by name, address, or city..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					{/* Table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Address</TableHead>
									<TableHead>City</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Phone</TableHead>
									<TableHead className="w-[70px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									// Loading skeletons
									Array.from({ length: 3 }, (_, index) => (
										<TableRow key={`location-skeleton-${index}`}>
											<TableCell>
												<Skeleton className="h-4 w-[150px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[200px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[100px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-6 w-[60px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[120px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-8 w-8" />
											</TableCell>
										</TableRow>
									))
								) : filteredLocations.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="h-24 text-center">
											No locations found matching your search.
										</TableCell>
									</TableRow>
								) : (
									paginatedLocations.map((location: any) => (
										<TableRow key={location.id}>
											<TableCell>
												<div className="font-medium">
													{location.name || "N/A"}
												</div>
											</TableCell>
											<TableCell>{location.address || "N/A"}</TableCell>
											<TableCell>{location.city || "N/A"}</TableCell>
											<TableCell>
												<Badge
													variant={
														location.isActive !== false
															? "default"
															: "secondary"
													}
													className={
														location.isActive !== false
															? "bg-green-100 text-green-800"
															: ""
													}
												>
													{location.isActive !== false ? "Active" : "Inactive"}
												</Badge>
											</TableCell>
											<TableCell className="text-sm">
												{location.phone || "N/A"}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => handleEditLocation(location.id)}
														>
															<Pencil className="mr-2 h-4 w-4" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleDeleteLocation(location.id)}
															className="text-red-600"
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between space-x-2 py-4">
						<div className="text-muted-foreground text-sm">
							Showing {startIndex + 1} to{" "}
							{Math.min(startIndex + itemsPerPage, filteredLocations.length)} of{" "}
							{filteredLocations.length} location(s)
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								disabled={currentPage <= 1}
								onClick={() => setCurrentPage(currentPage - 1)}
							>
								Previous
							</Button>
							<span className="text-sm">
								Page {currentPage} of {Math.max(1, totalPages)}
							</span>
							<Button
								variant="outline"
								size="sm"
								disabled={currentPage >= totalPages}
								onClick={() => setCurrentPage(currentPage + 1)}
							>
								Next
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
