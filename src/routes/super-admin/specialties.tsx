import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/specialties")({
	component: () => (
		// <RequireRole roles={["SUPER_ADMIN"]}>
		<Outlet />
		//</RequireRole>
	),
});
