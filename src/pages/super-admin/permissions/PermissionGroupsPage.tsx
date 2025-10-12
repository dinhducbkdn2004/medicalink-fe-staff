/**
 * Permission Groups Management Page
 * Allows super admins to manage permission groups
 */

import { useState } from "react";
import { Plus, Settings, Users, Shield, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { PermissionGroupModal } from "@/components/modals/PermissionGroupModal";
import { PermissionGroupViewModal } from "@/components/modals/PermissionGroupViewModal";
import {
	usePermissionGroups,
	useDeletePermissionGroup,
} from "@/hooks/api/usePermissions";
import { format } from "date-fns";
import type { PermissionGroup } from "@/types/api/permissions.types";
import type { ColumnDef } from "@tanstack/react-table";

export default function PermissionGroupsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(
		null
	);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);

	// Hooks
	const { data: groups = [], isLoading } = usePermissionGroups();
	const deleteGroupMutation = useDeletePermissionGroup();

	// Filter groups based on search term
	const filteredGroups = groups.filter(
		(group) =>
			group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			group.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Handle delete group
	const handleDeleteGroup = async () => {
		if (!selectedGroup) return;

		try {
			await deleteGroupMutation.mutateAsync(selectedGroup.id);
			setShowDeleteModal(false);
			setSelectedGroup(null);
		} catch (error) {
			console.error("Failed to delete group:", error);
		}
	};

	// Table columns
	const columns: ColumnDef<PermissionGroup>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Group Name" />
			),
			cell: ({ row }) => {
				const group = row.original;
				return (
					<div className="flex items-center space-x-2">
						<Shield className="h-4 w-4 text-blue-500" />
						<div>
							<div className="font-medium">{group.name}</div>
							<div className="text-muted-foreground text-sm">
								ID: {group.id.slice(0, 8)}...
							</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "description",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Description" />
			),
			cell: ({ row }) => (
				<div className="max-w-[300px] truncate">
					{row.getValue("description")}
				</div>
			),
		},
		{
			accessorKey: "isActive",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Status" />
			),
			cell: ({ row }) => {
				const isActive = row.getValue("isActive") as boolean;
				return (
					<Badge variant={isActive ? "default" : "secondary"}>
						{isActive ? "Active" : "Inactive"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "tenantId",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Tenant" />
			),
			cell: ({ row }) => (
				<Badge variant="outline">{row.getValue("tenantId")}</Badge>
			),
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Created" />
			),
			cell: ({ row }) => format(row.getValue("createdAt"), "PPP"),
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const group = row.original;
				return (
					<div className="flex items-center space-x-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSelectedGroup(group);
								setShowViewModal(true);
							}}
						>
							<Eye className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSelectedGroup(group);
								setShowEditModal(true);
							}}
						>
							<Edit className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSelectedGroup(group);
								setShowDeleteModal(true);
							}}
							disabled={group.name === "super_admin"} // Prevent deleting super_admin group
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Permission Groups
					</h1>
					<p className="text-muted-foreground">
						Manage permission groups and their access levels
					</p>
				</div>
				<Button onClick={() => setShowCreateModal(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Create Group
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Groups</CardTitle>
						<Users className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{groups.length}</div>
						<p className="text-muted-foreground text-xs">
							Permission groups in system
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Groups</CardTitle>
						<Shield className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{groups.filter((g) => g.isActive).length}
						</div>
						<p className="text-muted-foreground text-xs">
							Currently active groups
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">System Groups</CardTitle>
						<Settings className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{groups.filter((g) => g.tenantId === "global").length}
						</div>
						<p className="text-muted-foreground text-xs">
							Global system groups
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Search and Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Groups Management</CardTitle>
					<CardDescription>
						View and manage all permission groups in the system
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-4 flex items-center space-x-2">
						<Input
							placeholder="Search groups..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="max-w-sm"
						/>
					</div>

					{/* Data Table */}
					<DataTable
						columns={columns}
						data={filteredGroups}
						isLoading={isLoading}
						searchKey="name"
					/>
				</CardContent>
			</Card>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmationModal
				open={showDeleteModal}
				onOpenChange={(open) => {
					setShowDeleteModal(open);
					if (!open) setSelectedGroup(null);
				}}
				onConfirm={handleDeleteGroup}
				title="Delete Permission Group"
				description={`Are you sure you want to delete the group "${selectedGroup?.name}"? This action cannot be undone.`}
				itemName={selectedGroup?.name || ""}
				isLoading={deleteGroupMutation.isPending}
			/>

			{/* Create/Edit Group Modal */}
			<PermissionGroupModal
				isOpen={showCreateModal || showEditModal}
				onClose={() => {
					setShowCreateModal(false);
					setShowEditModal(false);
					setSelectedGroup(null);
				}}
				group={showEditModal ? selectedGroup : null}
				mode={showCreateModal ? "create" : "edit"}
			/>

			{/* View Group Modal */}
			<PermissionGroupViewModal
				isOpen={showViewModal}
				onClose={() => {
					setShowViewModal(false);
					setSelectedGroup(null);
				}}
				group={selectedGroup}
			/>
		</div>
	);
}
