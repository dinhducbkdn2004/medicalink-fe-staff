/**
 * User Permission Modal
 * Modal for managing individual user permissions
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
	User,
	RefreshCw,
} from "lucide-react";
import {
	useUserPermissions,
	usePermissions,
	useAssignUserPermission,
	useRevokeUserPermission,
	useRefreshUserPermissionCache,
} from "@/hooks/api/usePermissions";
import type { Permission } from "@/types/api/permissions.types";
import type { ColumnDef } from "@tanstack/react-table";

interface UserWithPermissions {
	id: string;
	name: string;
	email: string;
	role: string;
	type: "staff" | "doctor";
}

interface UserPermissionModalProps {
	isOpen: boolean;
	onClose: () => void;
	user: UserWithPermissions | null;
}

export function UserPermissionModal({
	isOpen,
	onClose,
	user,
}: UserPermissionModalProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddPermissions, setShowAddPermissions] = useState(false);

	// Hooks
	const { data: userPermissions = [], isLoading: isLoadingUserPermissions } =
		useUserPermissions(user?.id || "");
	const { data: allPermissions = [] } = usePermissions();
	const assignPermissionMutation = useAssignUserPermission();
	const revokePermissionMutation = useRevokeUserPermission();
	const refreshCacheMutation = useRefreshUserPermissionCache();

	// Get available permissions (not already assigned to user)
	const assignedPermissionIds = new Set(
		userPermissions.map((p) => `${p.resource}:${p.action}`)
	);
	const availablePermissions = allPermissions.filter(
		(p) => !assignedPermissionIds.has(`${p.resource}:${p.action}`)
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
		if (!user) return;

		try {
			await assignPermissionMutation.mutateAsync({
				userId: user.id,
				permissionId,
				effect: "ALLOW",
			});
		} catch (error) {
			console.error("Failed to assign permission:", error);
		}
	};

	// Handle revoke permission
	const handleRevokePermission = async (permissionId: string) => {
		if (!user) return;

		try {
			await revokePermissionMutation.mutateAsync({
				userId: user.id,
				permissionId,
			});
		} catch (error) {
			console.error("Failed to revoke permission:", error);
		}
	};

	// Handle refresh cache
	const handleRefreshCache = async () => {
		if (!user) return;

		try {
			await refreshCacheMutation.mutateAsync(user.id);
		} catch (error) {
			console.error("Failed to refresh cache:", error);
		}
	};

	// User permissions table columns
	const userPermissionColumns: ColumnDef<Permission>[] = [
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
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const permission = row.original;
				return (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handleRevokePermission(permission.id)}
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

	if (!user) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] max-w-4xl">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<User className="h-5 w-5" />
						<span>Permissions for {user.name}</span>
					</DialogTitle>
					<DialogDescription>
						Manage individual permissions for this user
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[calc(90vh-120px)]">
					<div className="space-y-6">
						{/* User Details */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">User Information</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-3">
									<div>
										<label className="text-muted-foreground text-sm font-medium">
											Name
										</label>
										<p className="text-sm">{user.name}</p>
									</div>
									<div>
										<label className="text-muted-foreground text-sm font-medium">
											Email
										</label>
										<p className="text-sm">{user.email}</p>
									</div>
									<div>
										<label className="text-muted-foreground text-sm font-medium">
											Role
										</label>
										<div className="mt-1">
											<Badge
												variant={
													user.type === "staff" ? "default" : "secondary"
												}
											>
												{user.role}
											</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* User Permissions */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-lg">
											Current Permissions
										</CardTitle>
										<CardDescription>
											Permissions directly assigned to this user
										</CardDescription>
									</div>
									<div className="flex items-center space-x-2">
										<Button
											onClick={handleRefreshCache}
											variant="outline"
											size="sm"
											disabled={refreshCacheMutation.isPending}
										>
											<RefreshCw className="mr-2 h-4 w-4" />
											Refresh Cache
										</Button>
										<Button
											onClick={() => setShowAddPermissions(!showAddPermissions)}
											variant="outline"
										>
											<Plus className="mr-2 h-4 w-4" />
											Add Permissions
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<DataTable
									columns={userPermissionColumns}
									data={userPermissions}
									isLoading={isLoadingUserPermissions}
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
										Permissions that can be assigned to this user
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
