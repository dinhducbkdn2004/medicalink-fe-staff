import { createFileRoute } from "@tanstack/react-router";
import { DoctorDashboard } from "@/pages/doctor/DashboardPage";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/doctor/dashboard")({
	component: () => (
		<RequireRole roles={["DOCTOR"]}>
			<DoctorDashboard />
		</RequireRole>
	),
});
