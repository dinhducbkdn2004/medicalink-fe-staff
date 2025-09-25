import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	DashboardStats,
	RecentActivities,
	QuickActions,
} from "@/components/dashboard";
import { useStaffStats } from "@/hooks/api/useStaffs";
import { useDoctorStats } from "@/hooks/api/useDoctors";
import { useSpecialtyStats } from "@/hooks/api/useSpecialties";
import { useLocationStats } from "@/hooks/api/useLocations";
import { Skeleton } from "@/components/ui/skeleton";

export const SuperAdminDashboard = () => {
	const { data: staffStats, isLoading: isLoadingStaffStats } = useStaffStats();
	const { data: doctorStats, isLoading: isLoadingDoctorStats } =
		useDoctorStats();
	const { data: specialtyStats, isLoading: isLoadingSpecialtyStats } =
		useSpecialtyStats();
	const { data: locationStats, isLoading: isLoadingLocationStats } =
		useLocationStats();

	const isLoading =
		isLoadingStaffStats ||
		isLoadingDoctorStats ||
		isLoadingSpecialtyStats ||
		isLoadingLocationStats;

	const stats = {
		totalStaffs: staffStats?.total || 0,
		activeStaffs: staffStats?.recentlyCreated || 0,
		totalDoctors: doctorStats?.total || 0,
		totalLocations: locationStats?.total || 0,
		totalSpecialties: specialtyStats?.total || 0,
		totalBlogs: 0,
		totalQuestions: 0,
		systemHealth: 98,
	};

	const activities = [
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
			timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
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
			timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
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
			timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
			status: "info" as const,
		},
		{
			id: "4",
			type: "location_created" as const,
			title: "New Location Added",
			description: "Hanoi branch has been added to the system",
			user: {
				name: "Admin User",
				role: "Admin",
			},
			timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
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
			timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
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
			timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
			status: "warning" as const,
		},
	];

	const handleViewAllActivities = () => {
		// Navigate to activities page
	};

	const handleQuickAction = () => {
		// Handle quick actions - navigation logic will be implemented later
	};

	return (
		<>
			{/* Statistics Cards */}
			<div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
				{isLoading ? (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{Array.from(
							{ length: 6 },
							(_, i) => `skeleton-SUPER_ADMIN-${i}`
						).map((key) => (
							<Card key={key}>
								<CardHeader className="pb-2">
									<Skeleton className="h-4 w-[150px]" />
								</CardHeader>
								<CardContent className="pt-0">
									<div className="mb-2 flex items-baseline justify-between">
										<Skeleton className="h-8 w-[80px]" />{" "}
										<Skeleton className="h-4 w-[40px]" />
									</div>
									<Skeleton className="h-3 w-[140px]" />
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<DashboardStats stats={stats} />
				)}
			</div>

			{/* Main Content */}
			<div className="grid gap-4 lg:grid-cols-12">
				<div className="animate-in fade-in-0 slide-in-from-left-4 delay-200 duration-700 lg:col-span-7">
					<RecentActivities
						activities={activities}
						onViewAll={handleViewAllActivities}
					/>
				</div>

				{/* Quick Actions */}
				<div className="animate-in fade-in-0 slide-in-from-right-4 delay-400 duration-700 lg:col-span-5">
					<QuickActions onActionClick={handleQuickAction} />
				</div>
			</div>
		</>
	);
};
