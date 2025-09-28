import { useState, useEffect, useMemo } from "react";
import debounce from "debounce";
import { Shield, Users, Settings, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useStaffs } from "@/hooks/api/useStaffs";
import {
	useRolePermissionsMatrix,
	useUpdateRolePermissions,
} from "@/hooks/api/usePermissions";
import { toast } from "sonner";
import type { Permission, Role } from "@/types";

export function PermissionsPage() {
	const { data: staffsData } = useStaffs();
	const { data: matrixData, isLoading } = useRolePermissionsMatrix();
	const updateRolePermissionsMutation = useUpdateRolePermissions();
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	// Create debounced function for search
	const debouncedSetSearch = useMemo(
		() =>
			debounce((value: string) => {
				setDebouncedSearchTerm(value);
			}, 300),
		[]
	);

	// Update debounced search when searchTerm changes
	useEffect(() => {
		debouncedSetSearch(searchTerm);
		return () => {
			debouncedSetSearch.clear();
		};
	}, [searchTerm, debouncedSetSearch]);
	const [selectedRole, setSelectedRole] = useState<string>("all");
	const [isUpdating, setIsUpdating] = useState(false);

	// Extract data from API response
	const availablePermissions: Permission[] = matrixData?.permissions || [];
	const rolePermissions: Role[] = matrixData?.roles || [];

	// Add user count to roles from staff data
	const rolesWithUserCount = rolePermissions.map((role) => {
		let userCount = 0;
		if (staffsData?.data && role.name) {
			userCount = staffsData.data.filter(
				(staff: any) => staff.role === role.name.toUpperCase().replace(" ", "_")
			).length;
		}
		return { ...role, userCount };
	});

	const filteredPermissions = availablePermissions.filter(
		(permission) =>
			permission.name
				.toLowerCase()
				.includes(debouncedSearchTerm.toLowerCase()) ||
			permission.description
				.toLowerCase()
				.includes(debouncedSearchTerm.toLowerCase()) ||
			permission.module
				.toLowerCase()
				.includes(debouncedSearchTerm.toLowerCase())
	);

	const filteredRoles = rolesWithUserCount.filter(
		(role) => selectedRole === "all" || role.id === selectedRole
	);

	const handlePermissionToggle = async (
		roleId: string,
		permissionId: string,
		checked: boolean
	) => {
		setIsUpdating(true);
		try {
			const role = rolesWithUserCount.find((r) => r.id === roleId);
			if (!role) return;

			const currentPermissionIds = role.permissions.map((p) => p.id);
			let newPermissionIds: string[];

			if (checked) {
				// Add permission
				newPermissionIds = [...currentPermissionIds, permissionId];
			} else {
				// Remove permission
				newPermissionIds = currentPermissionIds.filter(
					(id) => id !== permissionId
				);
			}

			await updateRolePermissionsMutation.mutateAsync({
				roleId,
				data: { permissionIds: newPermissionIds },
			});

			toast.success("Permission updated successfully", {
				description: `${checked ? "Added" : "Removed"} permission for ${role.name}`,
			});
		} catch (error) {
			console.error("Failed to update permission:", error);
			toast.error("Failed to update permission", {
				description: "Please try again.",
			});
		} finally {
			setIsUpdating(false);
		}
	};

	const getPermissionCount = () => {
		const totalAssigned = rolesWithUserCount.reduce(
			(total, role) => total + role.permissions.length,
			0
		);
		return {
			total: availablePermissions.length,
			assigned: totalAssigned,
		};
	};

	const permissionStats = getPermissionCount();

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Permissions Management
					</h1>
					<p className="text-muted-foreground">
						Manage role-based permissions and access control
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Total Permissions
							</p>
							<p className="text-2xl font-bold">{permissionStats.total}</p>
						</div>
						<Shield className="text-muted-foreground h-8 w-8" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Assigned
							</p>
							<p className="text-2xl font-bold text-blue-600">
								{permissionStats.assigned}
							</p>
						</div>
						<Users className="h-8 w-8 text-blue-600" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">Roles</p>
							<p className="text-2xl font-bold text-green-600">
								{rolePermissions.length}
							</p>
						</div>
						<Settings className="h-8 w-8 text-green-600" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Active Users
							</p>
							<p className="text-2xl font-bold text-purple-600">
								{rolePermissions.reduce(
									(total, role) => total + role.userCount,
									0
								)}
							</p>
						</div>
						<Users className="h-8 w-8 text-purple-600" />
					</CardContent>
				</Card>
			</div>

			{/* Permissions Matrix */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5" />
								Role Permissions Matrix
							</CardTitle>
							<CardDescription>
								Configure permissions for each role in the system
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{/* Filters */}
					<div className="mb-6 flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
							<Input
								placeholder="Search permissions..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={selectedRole} onValueChange={setSelectedRole}>
							<SelectTrigger className="w-48">
								<SelectValue placeholder="Filter by role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Roles</SelectItem>
								<SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
								<SelectItem value="ADMIN">Admin</SelectItem>
								<SelectItem value="DOCTOR">Doctor</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Permissions Table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[300px]">Permission</TableHead>
									<TableHead>Module</TableHead>
									{filteredRoles.map((role) => (
										<TableHead key={role.id} className="text-center">
											<div className="flex flex-col items-center">
												<span className="font-medium">{role.name}</span>
												<Badge variant="secondary" className="mt-1">
													{role.userCount} users
												</Badge>
											</div>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									// Loading rows
									Array.from({ length: 5 }, (_, index) => (
										<TableRow key={`loading-${index}`}>
											<TableCell>
												<div className="space-y-2">
													<div className="bg-muted h-4 w-48 animate-pulse rounded" />
													<div className="bg-muted h-3 w-32 animate-pulse rounded" />
												</div>
											</TableCell>
											<TableCell>
												<div className="bg-muted h-4 w-24 animate-pulse rounded" />
											</TableCell>
											{filteredRoles.map((role) => (
												<TableCell key={role.id} className="text-center">
													<div className="bg-muted mx-auto h-4 w-4 animate-pulse rounded" />
												</TableCell>
											))}
										</TableRow>
									))
								) : filteredPermissions.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={2 + filteredRoles.length}
											className="h-24 text-center"
										>
											No permissions found matching your search.
										</TableCell>
									</TableRow>
								) : (
									filteredPermissions.map((permission) => (
										<TableRow key={permission.id}>
											<TableCell>
												<div>
													<div className="font-medium">{permission.name}</div>
													<div className="text-muted-foreground text-sm">
														{permission.description}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant="outline">{permission.module}</Badge>
											</TableCell>
											{filteredRoles.map((role) => (
												<TableCell key={role.id} className="text-center">
													<Checkbox
														checked={role.permissions.some(
															(p) => p.id === permission.id
														)}
														disabled={isUpdating || role.name === "SUPER_ADMIN"} // Super admin always has all permissions
														onCheckedChange={(checked) => {
															void handlePermissionToggle(
																role.id,
																permission.id,
																checked as boolean
															);
														}}
													/>
												</TableCell>
											))}
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Legend */}
					<div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
						<div className="flex items-center gap-2">
							<Checkbox checked disabled />
							<span>Permission granted</span>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox disabled />
							<span>Permission denied</span>
						</div>
						<div className="ml-auto">
							<span className="text-xs">
								Note: Super Admin permissions cannot be modified
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
