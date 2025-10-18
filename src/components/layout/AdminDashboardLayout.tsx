import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard";
import type { StaffRole } from "@/types/common";
import { ReactNode } from "react";

interface AdminDashboardLayoutProps {
	userRole: StaffRole;
	children?: ReactNode;
}

export const AdminDashboardLayout = ({
	userRole,
	children,
}: AdminDashboardLayoutProps) => {
	const handleRefresh = () => {
		// Refresh dashboard data
		window.location.reload();
	};

	return (
		<SidebarProvider>
			<AppSidebar userRole={userRole} />
			<SidebarInset>
				<DashboardHeader onRefresh={handleRefresh} />

				<div className="flex flex-1 flex-col">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};
