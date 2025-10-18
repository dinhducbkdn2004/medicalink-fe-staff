import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminDashboard } from "@/pages/super-admin/dashboard/DashboardPage";

export const Route = createFileRoute("/super-admin/dashboard")({
	component: () => (
		// <RequireRole roles={["SUPER_ADMIN"]}>
			<SuperAdminDashboard />
		// </RequireRole>
	),
});
