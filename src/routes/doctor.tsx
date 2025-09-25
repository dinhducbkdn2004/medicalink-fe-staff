import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/guards/RequireRole";
import { AppSidebarDoctor } from "@/components/app-sidebar-doctor";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CalendarProvider } from "@/components/event-calendar/calendar-context";

export const Route = createFileRoute("/doctor")({
	component: () => (
		<RequireRole roles={["DOCTOR"]}>
			<CalendarProvider>
				<SidebarProvider>
					<AppSidebarDoctor />
					<SidebarInset>
						<Outlet />
					</SidebarInset>
				</SidebarProvider>
			</CalendarProvider>
		</RequireRole>
	),
});
