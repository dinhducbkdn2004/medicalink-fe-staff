/**
 * Permission Group View Modal
 * Modal for viewing permission group details and managing group permissions
 */

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
	Shield,
	Plus,
	Trash2,
	Search,
	Calendar,
	CheckCircle,
	XCircle,
} from "lucide-react";
import {
	useGroupPermissions,
	usePermissions,
	useAssignGroupPermission,
	useRevokeGroupPermission,
} from "@/hooks/api/usePermissions";
import { format } from "date-fns";
import type {
	PermissionGroup,
	GroupPermission,
	Permission,
} from "@/types/api/permissions.types";
import type { ColumnDef } from "@tanstack/react-table";

interface PermissionGroupViewModalProps {
	isOpen: boolean;
	onClose: () => void;
	group: PermissionGroup | null;
}

export function PermissionGroupViewModal({
	isOpen,
	onClose,
	group,
}: PermissionGroupViewModalProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddPermissions, setShowAddPermissions] = useState(false);

	// Hooks
	const { data: groupPermissions = [], isLoading: isLoadingGroupPermissions } =
		useGroupPermissions(group?.id || "");
	const { data: allPermissions = [] } = usePermissions();
	const assignPermissionMutation = useAssignGroupPermission();
	const revokePermissionMutation = useRevokeGroupPermission();

	// Get available permissions (not already assigned to group)
	const assignedPermissionIds = new Set(
		groupPermissions.map((gp) => gp.permissionId)
	);
	const availablePermissions = allPermissions.filter(
		(p) => !assignedPermissionIds.has(p.id)
	);

	// Filter permissions based on search
	const filteredAvailablePermissions = availablePermissions.filter(
		(permission) =>
			permission.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
			permission.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
			permission.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Handle assign permission
	const handleAssignPermission = async (permissionId: string) => {
		if (!group) return;

		try {
			await assignPermissionMutation.mutateAsync({
				groupId: group.id,
				data: {
					permissionId,
					effect: "ALLOW",
				},
			});
		} catch (error) {
			console.error("Failed to assign permission:", error);
		}
	};

	// Handle revoke permission
	const handleRevokePermission = async (permissionId: string) => {
		if (!group) return;

		try {
			await revokePermissionMutation.mutateAsync({
				groupId: group.id,
				permissionId,
			});
		} catch (error) {
			console.error("Failed to revoke permission:", error);
		}
	};

	// Group permissions table columns
	const groupPermissionColumns: ColumnDef<GroupPermission>[] = [
		{
			accessorKey: "resource",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Resource" />
			),
			cell: ({ row }) => (
				<div className="flex items-center space-x-2">
					<Shield className="h-4 w-4 text-blue-500" />
					<span className="font-medium">{row.getValue("resource")}</span>
				</div>
			),
		},
		{
			accessorKey: "action",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Action" />
			),
			cell: ({ row }) => (
				<Badge variant="outline">{row.getValue("action")}</Badge>
			),
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
			accessorKey: "effect",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Effect" />
			),
			cell: ({ row }) => {
				const effect = row.getValue("effect") as string;
				return (
					<Badge variant={effect === "ALLOW" ? "default" : "destructive"}>
						{effect === "ALLOW" ? (
							<CheckCircle className="mr-1 h-3 w-3" />
						) : (
							<XCircle className="mr-1 h-3 w-3" />
						)}
						{effect}
					</Badge>
				);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const permission = row.original;
				return (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handleRevokePermission(permission.permissionId)}
						disabled={revokePermissionMutation.isPending}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				);
			},
		},
	];

	// Available permissions table columns
	const availablePermissionColumns: ColumnDef<Permission>[] = [
		{
			accessorKey: "resource",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Resource" />
			),
			cell: ({ row }) => (
				<div className="flex items-center space-x-2">
					<Shield className="h-4 w-4 text-green-500" />
					<span className="font-medium">{row.getValue("resource")}</span>
				</div>
			),
		},
		{
			accessorKey: "action",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Action" />
			),
			cell: ({ row }) => (
				<Badge variant="outline">{row.getValue("action")}</Badge>
			),
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
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const permission = row.original;
				return (
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleAssignPermission(permission.id)}
						disabled={assignPermissionMutation.isPending}
					>
						<Plus className="mr-1 h-3 w-3" />
						Assign
					</Button>
				);
			},
		},
	];

	if (!group) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] max-w-4xl">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<Shield className="h-5 w-5" />
						<span>{group.name}</span>
					</DialogTitle>
					<DialogDescription>
						View and manage permissions for this group
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[calc(90vh-120px)]">
					<div className="space-y-6">
						{/* Group Details */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Group Information</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<label className="text-muted-foreground text-sm font-medium">
											Name
										</label>
										<p className="text-sm">{group.name}</p>
									</div>
									<div>
										<label className="text-muted-foreground text-sm font-medium">
											Status
										</label>
										<div className="mt-1">
											<Badge variant={group.isActive ? "default" : "secondary"}>
												{group.isActive ? "Active" : "Inactive"}
											</Badge>
										</div>
									</div>
									<div>
										<label className="text-muted-foreground text-sm font-medium">
											Description
										</label>
										<p className="text-sm">{group.description}</p>
									</div>
									<div>
										<label className="text-muted-foreground text-sm font-medium">
											Tenant ID
										</label>
										<p className="text-sm">{group.tenantId}</p>
									</div>
									<div>
										<label className="text-muted-foreground text-sm font-medium">
											Created
										</label>
										<p className="flex items-center text-sm">
											<Calendar className="mr-1 h-3 w-3" />
											{format(group.createdAt, "PPP")}
										</p>
									</div>
									<div>
										<label className="text-muted-foreground text-sm font-medium">
											Last Updated
										</label>
										<p className="flex items-center text-sm">
											<Calendar className="mr-1 h-3 w-3" />
											{format(group.updatedAt, "PPP")}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Group Permissions */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-lg">Group Permissions</CardTitle>
										<CardDescription>
											Permissions currently assigned to this group
										</CardDescription>
									</div>
									<Button
										onClick={() => setShowAddPermissions(!showAddPermissions)}
										variant="outline"
									>
										<Plus className="mr-2 h-4 w-4" />
										Add Permissions
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<DataTable
									columns={groupPermissionColumns}
									data={groupPermissions}
									isLoading={isLoadingGroupPermissions}
									searchKey="resource"
								/>
							</CardContent>
						</Card>

						{/* Add Permissions Section */}
						{showAddPermissions && (
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Available Permissions
									</CardTitle>
									<CardDescription>
										Permissions that can be assigned to this group
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center space-x-2">
											<Search className="text-muted-foreground h-4 w-4" />
											<Input
												placeholder="Search available permissions..."
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
												className="max-w-sm"
											/>
										</div>

										<DataTable
											columns={availablePermissionColumns}
											data={filteredAvailablePermissions}
											searchKey="resource"
										/>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
