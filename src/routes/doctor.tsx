import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/guards/RequireRole";
import { AppSidebarDoctor } from "@/components/app-sidebar-doctor";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CalendarProvider } from "@/components/event-calendar/calendar-context";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export const Route = createFileRoute("/doctor")({
	component: () => (
		<RequireRole roles={["DOCTOR"]}>
			<CalendarProvider>
				<SidebarProvider>
					<AppSidebarDoctor />
					<SidebarInset>
						<DashboardHeader showSearch={true} />
						<div className="flex flex-1 flex-col gap-4 p-4 pt-6">
							<Outlet />
						</div>
					</SidebarInset>
				</SidebarProvider>
			</CalendarProvider>
		</RequireRole>
	),
});
