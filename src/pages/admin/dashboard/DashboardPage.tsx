import { Card } from "@/components/ui/card";
import { PageTransition } from "@/components/ui/page-transition";
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import {
	DashboardStats,
	RecentActivities,
	QuickActions,
} from "@/components/dashboard";
import { useStaffStats } from "@/hooks/api/useStaffs";
import { useDoctorStats } from "@/hooks/api/useDoctors";
import { useSpecialtyStats } from "@/hooks/api/useSpecialties";
import { useLocationStats } from "@/hooks/api/useLocations";

export const AdminDashboard = () => {
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
		systemHealth: 0,
	};

	const activities = [
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
	];

	const handleViewAllActivities = () => {
		// Navigate to activities page
	};

	const handleQuickAction = () => {
		// Handle quick actions - navigation logic will be implemented later
	};

	return (
		<PageTransition>
			{/* Statistics Cards */}
			<div className="mb-8">
				{isLoading ? (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
						{Array.from({ length: 5 }, (_, i) => `skeleton-ADMIN-${i}`).map(
							(key) => (
								<Card key={key} className="overflow-hidden">
									<EnhancedSkeleton variant="stats" shimmer={true} />
								</Card>
							)
						)}
					</div>
				) : (
					<DashboardStats stats={stats} />
				)}
			</div>

			{/* Main Content */}
			<div className="grid gap-6 lg:grid-cols-12">
				<div className="lg:col-span-7">
					<RecentActivities
						activities={activities}
						onViewAll={handleViewAllActivities}
					/>
				</div>

				{/* Quick Actions */}
				<div className="lg:col-span-5">
					<QuickActions onActionClick={handleQuickAction} />
				</div>
			</div>
		</PageTransition>
	);
};
