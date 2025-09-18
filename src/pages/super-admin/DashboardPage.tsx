import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import {
	DashboardHeader,
	DashboardStats,
	RecentActivities,
	QuickActions,
} from "@/components/dashboard";

export const SuperAdminDashboard = () => {
	const mockStats = {
		totalAdmins: 24,
		activeAdmins: 18,
		totalDoctors: 156,
		totalLocations: 8,
		totalSpecialties: 25,
		totalBlogs: 89,
		totalQuestions: 234,
		systemHealth: 98,
	};

	const mockSystemMetrics = {
		activeUsers: 1247,
		totalRequests: 15420,
		errorRate: 0.8,
	};

	const mockActivities = [
		{
			id: "1",
			type: "admin_created" as const,
			title: "New Admin Created",
			description:
				"Admin account for Nguyen Van A has been successfully created",
			user: {
				name: "Super Admin",
				role: "Super Admin",
			},
			timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
			status: "success" as const,
		},
		{
			id: "2",
			type: "blog_created" as const,
			title: "New Blog Published",
			description: "Article 'Health Care Guide' has been published",
			user: {
				name: "Dr. Tran Thi B",
				role: "Doctor",
			},
			timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
			status: "success" as const,
		},
		{
			id: "3",
			type: "doctor_updated" as const,
			title: "Doctor Information Updated",
			description: "Dr. Le Van C's profile has been updated",
			user: {
				name: "Admin System",
				role: "Admin",
			},
			timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
			status: "info" as const,
		},
		{
			id: "4",
			type: "location_created" as const,
			title: "New Location Added",
			description: "Hanoi branch has been added to the system",
			user: {
				name: "Super Admin",
				role: "Super Admin",
			},
			timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
			status: "success" as const,
		},
		{
			id: "5",
			type: "specialty_updated" as const,
			title: "Specialty Updated",
			description: "Cardiology specialty information has been updated",
			user: {
				name: "Admin Medical",
				role: "Admin",
			},
			timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
			status: "info" as const,
		},
		{
			id: "6",
			type: "question_deleted" as const,
			title: "Question Deleted",
			description: "Inappropriate question has been removed from the system",
			user: {
				name: "Super Admin",
				role: "Super Admin",
			},
			timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
			status: "warning" as const,
		},
	];

	const handleRefresh = () => {
		// Refresh dashboard data
	};

	const handleAddNew = () => {
		// Open add new dialog
	};

	const handleExport = () => {
		// Export data
	};

	const handleViewAllActivities = () => {
		// Navigate to activities page
	};

	const handleQuickAction = (_actionId: string) => {
		// Handle quick actions - navigation logic will be implemented later
	};

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<DashboardHeader
					title="Dashboard"
					showSearch={true}
					showFilters={true}
					onRefresh={handleRefresh}
					onAddNew={handleAddNew}
					onExport={handleExport}
				/>

				<div className="flex flex-1 flex-col gap-4 p-4 pt-6">
					{/* Statistics Cards */}
					<div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
						<DashboardStats stats={mockStats} />
					</div>

					{/* Main Content */}
					<div className="grid gap-4 lg:grid-cols-12">
						<div className="animate-in fade-in-0 slide-in-from-left-4 delay-200 duration-700 lg:col-span-7">
							<RecentActivities
								activities={mockActivities}
								onViewAll={handleViewAllActivities}
							/>
						</div>

						{/* Right Sidebar */}
						<div className="space-y-4 lg:col-span-5">
							{/* Quick Actions */}
							<div className="animate-in fade-in-0 slide-in-from-right-4 delay-400 duration-700">
								<QuickActions onActionClick={handleQuickAction} />
							</div>

							{/* System Overview - Compact version */}
							<div className="animate-in fade-in-0 slide-in-from-right-4 delay-600 duration-700">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2 text-base">
											<Activity className="h-4 w-4" />
											System Overview
										</CardTitle>
									</CardHeader>
									<CardContent className="pt-0">
										<div className="grid grid-cols-2 gap-3">
											<div className="text-center">
												<div className="text-xl font-bold text-green-600">
													{mockStats.activeAdmins}
												</div>
												<div className="text-muted-foreground text-xs">
													Online Admins
												</div>
											</div>
											<div className="text-center">
												<div className="text-xl font-bold text-blue-600">
													{mockSystemMetrics.activeUsers}
												</div>
												<div className="text-muted-foreground text-xs">
													Active Users
												</div>
											</div>
											<div className="text-center">
												<div className="text-xl font-bold text-purple-600">
													{mockSystemMetrics.totalRequests.toLocaleString()}
												</div>
												<div className="text-muted-foreground text-xs">
													Total Requests
												</div>
											</div>
											<div className="text-center">
												<div className="text-xl font-bold text-orange-600">
													{mockSystemMetrics.errorRate}%
												</div>
												<div className="text-muted-foreground text-xs">
													Error Rate
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
