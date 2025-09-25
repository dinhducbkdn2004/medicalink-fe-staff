import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/super-admin")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<AdminDashboardLayout userRole="SUPER_ADMIN">
				<Outlet />
			</AdminDashboardLayout>
		</RequireRole>
	),
});
