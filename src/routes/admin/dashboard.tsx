import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/pages/admin/dashboard/DashboardPage";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/admin/dashboard")({
	component: () => (
		<RequireRole roles={["ADMIN"]}>
			<AdminDashboard />
		</RequireRole>
	),
});
