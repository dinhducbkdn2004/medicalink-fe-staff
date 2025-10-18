import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { DeleteConfirmationModal } from "@/components/modals";
import { useSpecialties, useDeleteSpecialty } from "@/hooks/api/useSpecialties";
import { usePaginationParams } from "@/hooks/usePaginationParams";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
	createSpecialtyColumns,
	type SpecialtyData,
} from "@/components/data-table/specialty-columns";
import type { ContextMenuAction } from "@/components/data-table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { type SortDirection } from "@/components/ui/date-range-picker";

export function EnhancedSpecialtiesPage() {
	const navigate = useNavigate();

	const { params, setSearch, updateParams } = usePaginationParams({
		defaultPage: 1,
		defaultLimit: 10,
		defaultSortBy: "createdAt",
		defaultSortOrder: "DESC",
	});

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [specialtyToDelete, setSpecialtyToDelete] = useState<string | null>(
		null
	);
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

	const { data: specialtiesData, isLoading } = useSpecialties(apiParams);
	const deleteSpecialtyMutation = useDeleteSpecialty();

	const specialties = specialtiesData?.data || [];
	const totalCount = specialtiesData?.meta?.total || 0;
	const totalPages = Math.max(1, Math.ceil(totalCount / params.limit));

	const specialtyData: SpecialtyData[] = specialties.map((specialty: any) => ({
		id: specialty.id,
		name: specialty.name,
		description: specialty.description,
		isActive: specialty.isActive ?? true,
		infoSectionsCount:
			specialty.infoSectionsCount || specialty._count?.infoSections || 0,
		createdAt: String(specialty.createdAt),
		updatedAt: String(specialty.updatedAt),
	}));

	// Filter specialties by date range on client side
	const filteredSpecialties = specialtyData.filter((specialty) => {
		if (!dateRange?.from) return true;

		const specialtyDate = new Date(specialty.createdAt);
		const fromDate = new Date(dateRange.from);
		const toDate = dateRange.to ? new Date(dateRange.to) : fromDate;

		// Set time to start/end of day for proper comparison
		fromDate.setHours(0, 0, 0, 0);
		toDate.setHours(23, 59, 59, 999);

		return specialtyDate >= fromDate && specialtyDate <= toDate;
	});

	const handleView = (specialtyId: string) => {
		void navigate({
			to: "/super-admin/specialties/$id/view",
			params: { id: specialtyId },
		});
	};

	const handleEdit = (specialtyId: string) => {
		void navigate({
			to: "/super-admin/specialties/$id/edit",
			params: { id: specialtyId },
		});
	};

	const handleDelete = (specialtyId: string) => {
		setSpecialtyToDelete(specialtyId);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		if (!specialtyToDelete) return;

		try {
			setIsDeleting(true);
			await deleteSpecialtyMutation.mutateAsync(specialtyToDelete);

			toast.success("Specialty deleted successfully", {
				description: "The specialty has been removed from the system.",
			});

			setShowDeleteModal(false);
			setSpecialtyToDelete(null);
		} catch (error) {
			console.error("Failed to delete specialty:", error);
			toast.error("Failed to delete specialty", {
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

	const handleCreateSpecialty = () => {
		void navigate({ to: "/super-admin/specialties/create" });
	};

	const columns = createSpecialtyColumns({
		onView: handleView,
		onEdit: handleEdit,
		onDelete: handleDelete,
	});

	// Context menu actions
	const getRowContextMenuActions = (
		specialty: SpecialtyData
	): ContextMenuAction[] => [
		{
			label: "View Details",
			icon: <Eye className="h-4 w-4" />,
			onClick: () => handleView(specialty.id),
		},
		{
			label: "Edit",
			icon: <Edit className="h-4 w-4" />,
			onClick: () => handleEdit(specialty.id),
		},
		{
			label: "Delete",
			icon: <Trash2 className="h-4 w-4" />,
			onClick: () => handleDelete(specialty.id),
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
						data={filteredSpecialties}
						searchKey="name"
						searchValue={params.search || ""}
						onSearchChange={setSearch}
						isLoading={isLoading}
						loadingRows={params.limit}
						getRowContextMenuActions={getRowContextMenuActions}
						toolbar={
							<DataTableToolbar
								searchKey="name"
								searchPlaceholder="Search specialty..."
								searchValue={params.search || ""}
								onSearchChange={setSearch}
								{...(dateRange ? { dateRange } : {})}
								onDateRangeChange={setDateRange}
								dateSortDirection={dateSortDirection}
								onDateSortChange={setDateSortDirection}
								onCreateNew={handleCreateSpecialty}
								createButtonText="Add Specialty"
							/>
						}
						pageCount={totalPages}
						pageIndex={params.page}
						pageSize={params.limit}
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
						totalCount={filteredSpecialties.length}
					/>
				</CardContent>
			</Card>

			<DeleteConfirmationModal
				open={showDeleteModal}
				onOpenChange={setShowDeleteModal}
				onConfirm={handleConfirmDelete}
				title="Delete Specialty"
				description="Are you sure you want to delete this specialty? This action cannot be undone and will permanently remove the specialty and all related information."
				itemName={
					specialtyToDelete
						? specialties.find((s: any) => s.id === specialtyToDelete)?.name ||
							"Unknown Specialty"
						: ""
				}
				isLoading={isDeleting}
			/>
		</div>
	);
}
