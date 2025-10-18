import { Link } from "@tanstack/react-router";
import {
	Shield,
	Users,
	Settings,
	BarChart3,
	UserCheck,
	Lock,
	Key,
	ArrowRight,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	usePermissionStats,
	usePermissionGroups,
	useMyPermissions,
} from "@/hooks/api/usePermissions";
import { useStaffs } from "@/hooks/api/useStaffs";
import { useDoctors } from "@/hooks/api/useDoctors";

export function PermissionsDashboard() {
	// Hooks
	const { data: stats } = usePermissionStats();
	const { data: groups = [] } = usePermissionGroups();
	const { data: myPermissions = [] } = useMyPermissions();
	const { data: staffsData } = useStaffs();
	const { data: doctorsData } = useDoctors();

	// Calculate totals
	const totalUsers =
		(staffsData?.meta?.total || 0) + (doctorsData?.meta?.total || 0);
	const activeGroups = groups.filter((g) => g.isActive).length;
	const totalPermissions = stats?.totalPermissions || 0;

	return (
		<div className="space-y-6">
			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Permissions
						</CardTitle>
						<Key className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalPermissions}</div>
						<p className="text-muted-foreground text-xs">
							System-wide permissions
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Permission Groups
						</CardTitle>
						<Shield className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{groups.length}</div>
						<p className="text-muted-foreground text-xs">
							{activeGroups} active groups
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalUsers}</div>
						<p className="text-muted-foreground text-xs">Staff and doctors</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							My Permissions
						</CardTitle>
						<UserCheck className="text-muted-foreground h-4 w-4" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{myPermissions.length}</div>
						<p className="text-muted-foreground text-xs">
							Your active permissions
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* Permission Groups Management */}
				<Card>
					<CardHeader>
						<div className="flex items-center space-x-2">
							<Shield className="h-5 w-5 text-blue-500" />
							<CardTitle>Permission Groups</CardTitle>
						</div>
						<CardDescription>
							Manage permission groups and their access levels
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<p className="text-muted-foreground text-sm">
								Create and manage groups to organize permissions efficiently.
								Assign users to groups for streamlined access control.
							</p>
							<div className="flex flex-wrap gap-2">
								{groups.slice(0, 3).map((group) => (
									<Badge key={group.id} variant="outline">
										{group.name}
									</Badge>
								))}
								{groups.length > 3 && (
									<Badge variant="secondary">+{groups.length - 3} more</Badge>
								)}
							</div>
						</div>
						<Link to="/super-admin/permissions/groups">
							<Button className="w-full">
								<Settings className="mr-2 h-4 w-4" />
								Manage Groups
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</CardContent>
				</Card>

				{/* User Permissions Management */}
				<Card>
					<CardHeader>
						<div className="flex items-center space-x-2">
							<Users className="h-5 w-5 text-green-500" />
							<CardTitle>User Permissions</CardTitle>
						</div>
						<CardDescription>
							Assign permissions and manage user access
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<p className="text-muted-foreground text-sm">
								Manage individual user permissions and group memberships.
								Control access to specific resources and actions.
							</p>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-medium">
										{staffsData?.meta?.total || 0}
									</span>
									<span className="text-muted-foreground"> Staff members</span>
								</div>
								<div>
									<span className="font-medium">
										{doctorsData?.meta?.total || 0}
									</span>
									<span className="text-muted-foreground"> Doctors</span>
								</div>
							</div>
						</div>
						<Link to="/super-admin/permissions/users">
							<Button className="w-full" variant="outline">
								<UserCheck className="mr-2 h-4 w-4" />
								Manage User Access
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{stats && (
					<Card>
						<CardHeader>
							<div className="flex items-center space-x-2">
								<BarChart3 className="h-5 w-5 text-purple-500" />
								<CardTitle>Permission Statistics</CardTitle>
							</div>
							<CardDescription>
								Overview of permission usage and distribution
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div className="space-y-2">
									<div className="flex justify-between">
										<span>Total Permissions:</span>
										<span className="font-medium">
											{stats.totalPermissions}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Total Groups:</span>
										<span className="font-medium">{stats.totalGroups}</span>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span>User Permissions:</span>
										<span className="font-medium">
											{stats.totalUserPermissions}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Group Permissions:</span>
										<span className="font-medium">
											{stats.totalGroupPermissions}
										</span>
									</div>
								</div>
							</div>

							{stats.mostUsedPermissions &&
								stats.mostUsedPermissions.length > 0 && (
									<div className="space-y-2">
										<h4 className="text-sm font-medium">
											Most Used Permissions
										</h4>
										<div className="space-y-1">
											{stats.mostUsedPermissions
												.slice(0, 3)
												.map((perm: any, index: number) => (
													<div
														key={index}
														className="flex justify-between text-sm"
													>
														<span className="text-muted-foreground">
															{perm.resource}:{perm.action}
														</span>
														<Badge variant="secondary" className="text-xs">
															{perm.usageCount}
														</Badge>
													</div>
												))}
										</div>
									</div>
								)}
						</CardContent>
					</Card>
				)}

				{/* System Security */}
				<Card>
					<CardHeader>
						<div className="flex items-center space-x-2">
							<Lock className="h-5 w-5 text-red-500" />
							<CardTitle>Security Overview</CardTitle>
						</div>
						<CardDescription>
							System security status and recommendations
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm">Active Groups</span>
								<Badge variant={activeGroups > 0 ? "default" : "destructive"}>
									{activeGroups > 0 ? "Configured" : "None"}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">Permission Coverage</span>
								<Badge variant="default">Complete</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">User Access Control</span>
								<Badge variant={totalUsers > 0 ? "default" : "secondary"}>
									{totalUsers > 0 ? "Active" : "No Users"}
								</Badge>
							</div>
						</div>

						<div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
							<p className="text-xs text-blue-900 dark:text-blue-100">
								<strong>Security Tip:</strong> Regularly review user permissions
								and group memberships to ensure proper access control.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
