import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/admin")({
	component: () => (
		<RequireRole roles={["ADMIN"]}>
			<AdminDashboardLayout userRole="ADMIN">
				<Outlet />
			</AdminDashboardLayout>
		</RequireRole>
	),
});
