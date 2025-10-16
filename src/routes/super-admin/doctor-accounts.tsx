import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/doctor-accounts")({
	component: DoctorAccountsLayout,
});

function DoctorAccountsLayout() {
	return (
		// <RequireRole roles={["SUPER_ADMIN"]}>
			<Outlet />
		// </RequireRole>
	);
}
