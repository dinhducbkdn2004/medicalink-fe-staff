import { AppSidebarDoctor } from "@/components/app-sidebar-doctor";
import BigCalendar from "@/components/big-calendar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CalendarProvider } from "@/components/event-calendar/calendar-context";

export const DoctorDashboard = () => {
	return (
		<CalendarProvider>
			<SidebarProvider>
				<AppSidebarDoctor />
				<SidebarInset>
					<div className="flex flex-1 flex-col gap-4 p-2 pt-0">
						<BigCalendar />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</CalendarProvider>
	);
};
