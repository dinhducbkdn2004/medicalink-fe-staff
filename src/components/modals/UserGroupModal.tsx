/**
 * User Group Modal
 * Modal for managing user group memberships
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
	Users,
	Plus,
	Trash2,
	Search,
	Shield,
	Calendar,
} from "lucide-react";
import {
	useUserGroups,
	usePermissionGroups,
	useAddUserToGroup,
	useRemoveUserFromGroup,
} from "@/hooks/api/usePermissions";
import { format } from "date-fns";
import type { PermissionGroup } from "@/types/api/permissions.types";
import type { ColumnDef } from "@tanstack/react-table";

interface UserWithPermissions {
	id: string;
	name: string;
	email: string;
	role: string;
	type: "staff" | "doctor";
}

interface UserGroupModalProps {
	isOpen: boolean;
	onClose: () => void;
	user: UserWithPermissions | null;
}

export function UserGroupModal({ isOpen, onClose, user }: UserGroupModalProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddGroups, setShowAddGroups] = useState(false);

	// Hooks
	const { data: userGroups = [], isLoading: isLoadingUserGroups } =
		useUserGroups(user?.id || "");
	const { data: allGroups = [] } = usePermissionGroups();
	const addUserToGroupMutation = useAddUserToGroup();
	const removeUserFromGroupMutation = useRemoveUserFromGroup();

	// Get available groups (not already assigned to user)
	const assignedGroupIds = new Set(userGroups.map((g) => g.id));
	const availableGroups = allGroups.filter(
		(g) => !assignedGroupIds.has(g.id) && g.isActive
	);

	// Filter groups based on search
	const filteredAvailableGroups = availableGroups.filter(
		(group) =>
			group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			group.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Handle add user to group
	const handleAddToGroup = async (groupId: string) => {
		if (!user) return;

		try {
			await addUserToGroupMutation.mutateAsync({
				userId: user.id,
				data: { groupId },
			});
		} catch (error) {
			console.error("Failed to add user to group:", error);
		}
	};

	// Handle remove user from group
	const handleRemoveFromGroup = async (groupId: string) => {
		if (!user) return;

		try {
			await removeUserFromGroupMutation.mutateAsync({
				userId: user.id,
				groupId,
			});
		} catch (error) {
			console.error("Failed to remove user from group:", error);
		}
	};

	// User groups table columns
	const userGroupColumns: ColumnDef<PermissionGroup>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Group Name" />
			),
			cell: ({ row }) => (
				<div className="flex items-center space-x-2">
					<Shield className="h-4 w-4 text-blue-500" />
					<span className="font-medium">{row.getValue("name")}</span>
				</div>
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
			accessorKey: "tenantId",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Tenant" />
			),
			cell: ({ row }) => (
				<Badge variant="outline">{row.getValue("tenantId")}</Badge>
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
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const group = row.original;
				return (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handleRemoveFromGroup(group.id)}
						disabled={
							removeUserFromGroupMutation.isPending ||
							group.name === "super_admin" // Prevent removing from super_admin group
						}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				);
			},
		},
	];

	// Available groups table columns
	const availableGroupColumns: ColumnDef<PermissionGroup>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Group Name" />
			),
			cell: ({ row }) => (
				<div className="flex items-center space-x-2">
					<Shield className="h-4 w-4 text-green-500" />
					<span className="font-medium">{row.getValue("name")}</span>
				</div>
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
			cell: ({ row }) => (
				<div className="text-muted-foreground flex items-center text-sm">
					<Calendar className="mr-1 h-3 w-3" />
					{format(row.getValue("createdAt"), "PPP")}
				</div>
			),
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const group = row.original;
				return (
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleAddToGroup(group.id)}
						disabled={addUserToGroupMutation.isPending}
					>
						<Plus className="mr-1 h-3 w-3" />
						Add
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
						<Users className="h-5 w-5" />
						<span>Group Memberships for {user.name}</span>
					</DialogTitle>
					<DialogDescription>
						Manage group memberships for this user
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

						{/* Current Groups */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-lg">Current Groups</CardTitle>
										<CardDescription>
											Groups this user is currently a member of
										</CardDescription>
									</div>
									<Button
										onClick={() => setShowAddGroups(!showAddGroups)}
										variant="outline"
									>
										<Plus className="mr-2 h-4 w-4" />
										Add to Groups
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								{userGroups.length === 0 ? (
									<div className="text-muted-foreground py-8 text-center">
										<Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
										<p>This user is not a member of any groups</p>
									</div>
								) : (
									<DataTable
										columns={userGroupColumns}
										data={userGroups}
										isLoading={isLoadingUserGroups}
										searchKey="name"
									/>
								)}
							</CardContent>
						</Card>

						{/* Add to Groups Section */}
						{showAddGroups && (
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Available Groups</CardTitle>
									<CardDescription>
										Groups this user can be added to
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center space-x-2">
											<Search className="text-muted-foreground h-4 w-4" />
											<Input
												placeholder="Search available groups..."
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
												className="max-w-sm"
											/>
										</div>

										{filteredAvailableGroups.length === 0 ? (
											<div className="text-muted-foreground py-8 text-center">
												<Shield className="mx-auto mb-4 h-12 w-12 opacity-50" />
												<p>No available groups to add this user to</p>
											</div>
										) : (
											<DataTable
												columns={availableGroupColumns}
												data={filteredAvailableGroups}
												searchKey="name"
											/>
										)}
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
