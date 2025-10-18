import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { DeleteConfirmationModal } from "@/components/modals";
import {
	useWorkLocations,
	useDeleteWorkLocation,
} from "@/hooks/api/useLocations";
import { usePaginationParams } from "@/hooks/usePaginationParams";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
	createLocationColumns,
	type WorkLocationData,
} from "@/components/data-table/location-columns";
import type { ContextMenuAction } from "@/components/data-table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { type SortDirection } from "@/components/ui/date-range-picker";

export function EnhancedWorkLocationsPage() {
	const navigate = useNavigate();

	const { params, setSearch, updateParams } = usePaginationParams({
		defaultPage: 1,
		defaultLimit: 10,
		defaultSortBy: "createdAt",
		defaultSortOrder: "DESC",
	});

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [locationToDelete, setLocationToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Date range filter
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [dateSortDirection, setDateSortDirection] =
		useState<SortDirection>(null);

	const apiParams = {
		...params,
		sortBy: (params.sortBy as "createdAt" | "name") || "createdAt",
		// Apply date sort direction if set
		...(dateSortDirection && {
			sortOrder:
				dateSortDirection === "asc" ? ("ASC" as const) : ("DESC" as const),
		}),
	};

	const { data: locationsData, isLoading } = useWorkLocations(apiParams);
	const deleteLocationMutation = useDeleteWorkLocation();

	const locations = locationsData?.data || [];
	const totalCount = locationsData?.meta?.total || 0;
	const totalPages = Math.max(1, Math.ceil(totalCount / params.limit));

	const locationData: WorkLocationData[] = locations.map((location: any) => ({
		id: location.id,
		name: location.name,
		address: location.address,
		city: location.city,
		phone: location.phone,
		timezone: location.timezone || "Asia/Ho_Chi_Minh",
		isActive: location.isActive ?? true,
		createdAt: String(location.createdAt),
		updatedAt: String(location.updatedAt),
	}));

	// Filter locations by date range on client side
	const filteredLocations = locationData.filter((location) => {
		if (!dateRange?.from) return true;

		const locationDate = new Date(location.createdAt);
		const fromDate = new Date(dateRange.from);
		const toDate = dateRange.to ? new Date(dateRange.to) : fromDate;

		// Set time to start/end of day for proper comparison
		fromDate.setHours(0, 0, 0, 0);
		toDate.setHours(23, 59, 59, 999);

		return locationDate >= fromDate && locationDate <= toDate;
	});

	const handleView = (locationId: string) => {
		void navigate({
			to: "/super-admin/work-locations/$id/view",
			params: { id: locationId },
		});
	};

	const handleEdit = (locationId: string) => {
		void navigate({
			to: "/super-admin/work-locations/$id/edit",
			params: { id: locationId },
		});
	};

	const handleDelete = (locationId: string) => {
		setLocationToDelete(locationId);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		if (!locationToDelete) return;

		try {
			setIsDeleting(true);
			await deleteLocationMutation.mutateAsync(locationToDelete);

			toast.success("Work location deleted successfully", {
				description: "The work location has been removed from the system.",
			});

			setShowDeleteModal(false);
			setLocationToDelete(null);
		} catch (error) {
			console.error("Failed to delete location:", error);
			toast.error("Failed to delete work location", {
				description: "Please try again.",
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const handleConfirmDelete = () => {
		void confirmDelete();
	};

	const handlePageChange = (page: number) => {
		updateParams({ page });
	};

	const handlePageSizeChange = (limit: number) => {
		updateParams({ limit, page: 1 });
	};

	const handleCreateLocation = () => {
		void navigate({ to: "/super-admin/work-locations/create" });
	};

	const columns = createLocationColumns({
		onView: handleView,
		onEdit: handleEdit,
		onDelete: handleDelete,
	});

	// Context menu actions
	const getRowContextMenuActions = (
		location: WorkLocationData
	): ContextMenuAction[] => [
		{
			label: "View Details",
			icon: <Eye className="h-4 w-4" />,
			onClick: () => handleView(location.id),
		},
		{
			label: "Edit",
			icon: <Edit className="h-4 w-4" />,
			onClick: () => handleEdit(location.id),
		},
		{
			label: "Delete",
			icon: <Trash2 className="h-4 w-4" />,
			onClick: () => handleDelete(location.id),
			className: "text-red-600 focus:text-red-600",
			separator: true,
		},
	];

	return (
		<div className="flex flex-1 flex-col gap-4 p-6">
			<Card>
				<CardContent className="p-6">
					<DataTable
						columns={columns}
						data={filteredLocations}
						searchKey="name"
						searchValue={params.search || ""}
						onSearchChange={setSearch}
						isLoading={isLoading}
						loadingRows={params.limit}
						getRowContextMenuActions={getRowContextMenuActions}
						toolbar={
							<DataTableToolbar
								searchKey="name"
								searchPlaceholder="Search location..."
								searchValue={params.search || ""}
								onSearchChange={setSearch}
								{...(dateRange ? { dateRange } : {})}
								onDateRangeChange={setDateRange}
								dateSortDirection={dateSortDirection}
								onDateSortChange={setDateSortDirection}
								onCreateNew={handleCreateLocation}
								createButtonText="Add Location"
							/>
						}
						pageCount={totalPages}
						pageIndex={params.page}
						pageSize={params.limit}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
						totalCount={filteredLocations.length}
					/>
				</CardContent>
			</Card>

			<DeleteConfirmationModal
				open={showDeleteModal}
				onOpenChange={setShowDeleteModal}
				onConfirm={handleConfirmDelete}
				title="Delete Work Location"
				description="Are you sure you want to delete this work location? This action cannot be undone and will permanently remove the location and all related data."
				itemName={
					locationToDelete
						? locations.find((l: any) => l.id === locationToDelete)?.name ||
							"Unknown Location"
						: ""
				}
				isLoading={isDeleting}
			/>
		</div>
	);
}
