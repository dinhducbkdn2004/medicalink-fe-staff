/**
 * User Permissions Management Page
 * Allows super admins to manage user permissions and group memberships
 */

import { useState } from "react";
import { Users, Shield, UserCheck, Settings } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { UserPermissionModal } from "@/components/modals/UserPermissionModal";
import { UserGroupModal } from "@/components/modals/UserGroupModal";
import { useStaffs } from "@/hooks/api/useStaffs";
import { useDoctors } from "@/hooks/api/useDoctors";
import { usePermissionGroups } from "@/hooks/api/usePermissions";
import { format } from "date-fns";
import type { StaffAccount } from "@/types/common";
import type { Doctor } from "@/types/api/doctors.types";
import type { ColumnDef } from "@tanstack/react-table";

interface UserWithPermissions {
	id: string;
	name: string;
	email: string;
	role: string;
	type: "staff" | "doctor";
	isActive: boolean;
	createdAt: string;
}

export default function UserPermissionsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUserType, setSelectedUserType] = useState<
		"all" | "staff" | "doctor"
	>("all");
	const [selectedUser, setSelectedUser] = useState<UserWithPermissions | null>(
		null
	);
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [showGroupModal, setShowGroupModal] = useState(false);

	// Hooks
	const { data: staffsResponse } = useStaffs();
	const { data: doctorsResponse } = useDoctors();
	const { data: _groups = [] } = usePermissionGroups();

	// Extract arrays from paginated responses
	const staffs = staffsResponse?.data || [];
	const doctors = doctorsResponse?.data || [];

	// Combine staff and doctors into a unified user list
	const allUsers: UserWithPermissions[] = [
		...staffs.map((staff: StaffAccount) => ({
			id: staff.id,
			name: staff.fullName,
			email: staff.email,
			role: staff.role,
			type: "staff" as const,
			isActive: true, // Note: StaffAccount doesn't have isActive field
			createdAt: staff.createdAt.toString(),
		})),
		...doctors.map((doctor: Doctor) => ({
			id: doctor.id,
			name: doctor.fullName,
			email: doctor.email,
			role: "doctor",
			type: "doctor" as const,
			isActive: true, // Note: StaffAccount doesn't have isActive field
			createdAt: doctor.createdAt.toString(),
		})),
	];

	// Filter users based on search term and type
	const filteredUsers = allUsers.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.role.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesType =
			selectedUserType === "all" || user.type === selectedUserType;

		return matchesSearch && matchesType;
	});

	// Table columns
	const columns: ColumnDef<UserWithPermissions>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="User" />
			),
			cell: ({ row }) => {
				const user = row.original;
				return (
					<div className="flex items-center space-x-2">
						{user.type === "staff" ? (
							<Shield className="h-4 w-4 text-blue-500" />
						) : (
							<UserCheck className="h-4 w-4 text-green-500" />
						)}
						<div>
							<div className="font-medium">{user.name}</div>
							<div className="text-muted-foreground text-sm">{user.email}</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "role",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Role" />
			),
			cell: ({ row }) => {
				const role = row.getValue("role") as string;
				const type = row.original.type;
				return (
					<div className="space-y-1">
						<Badge variant={type === "staff" ? "default" : "secondary"}>
							{role}
						</Badge>
						<div className="text-muted-foreground text-xs capitalize">
							{type}
						</div>
					</div>
				);
			},
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
				const user = row.original;
				return (
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSelectedUser(user);
								setShowAssignModal(true);
							}}
						>
							<Shield className="mr-1 h-3 w-3" />
							Permissions
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setSelectedUser(user);
								setShowGroupModal(true);
							}}
						>
							<Users className="mr-1 h-3 w-3" />
							Groups
						</Button>
					</div>
				);
			},
		},
	];

	// Calculate stats
	const totalUsers = allUsers.length;
	const activeUsers = allUsers.filter((u) => u.isActive).length;
	const staffCount = allUsers.filter((u) => u.type === "staff").length;
	const doctorCount = allUsers.filter((u) => u.type === "doctor").length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						User Permissions
					</h1>
					<p className="text-muted-foreground">
						Manage user permissions and group memberships
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalUsers}</div>
						<p className="text-muted-foreground text-xs">All users in system</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Users</CardTitle>
						<UserCheck className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activeUsers}</div>
						<p className="text-muted-foreground text-xs">
							Currently active users
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Staff Members</CardTitle>
						<Shield className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{staffCount}</div>
						<p className="text-muted-foreground text-xs">
							Admin & super admin staff
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Doctors</CardTitle>
						<Settings className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{doctorCount}</div>
						<p className="text-muted-foreground text-xs">
							Medical professionals
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Search and Filters */}
			<Card>
				<CardHeader>
					<CardTitle>User Management</CardTitle>
					<CardDescription>
						Assign permissions and manage group memberships for users
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-4 flex items-center space-x-4">
						<div className="flex-1">
							<Input
								placeholder="Search users..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="max-w-sm"
							/>
						</div>
						<Select
							value={selectedUserType}
							onValueChange={(value: "all" | "staff" | "doctor") =>
								setSelectedUserType(value)
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Users</SelectItem>
								<SelectItem value="staff">Staff Only</SelectItem>
								<SelectItem value="doctor">Doctors Only</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Data Table */}
					<DataTable columns={columns} data={filteredUsers} searchKey="name" />
				</CardContent>
			</Card>

			{/* User Permission Modal */}
			<UserPermissionModal
				isOpen={showAssignModal}
				onClose={() => {
					setShowAssignModal(false);
					setSelectedUser(null);
				}}
				user={selectedUser}
			/>

			{/* User Group Modal */}
			<UserGroupModal
				isOpen={showGroupModal}
				onClose={() => {
					setShowGroupModal(false);
					setSelectedUser(null);
				}}
				user={selectedUser}
			/>
		</div>
	);
}
