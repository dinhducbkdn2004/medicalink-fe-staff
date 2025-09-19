import { createFileRoute } from "@tanstack/react-router";
import { SuperAdminDashboard } from "@/pages/super-admin/DashboardPage";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/super-admin/dashboard")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<SuperAdminDashboard />
		</RequireRole>
	),
});
