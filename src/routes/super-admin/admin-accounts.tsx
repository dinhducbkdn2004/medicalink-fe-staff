import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/admin-accounts")({
	component: AdminAccountsLayout,
});

function AdminAccountsLayout() {
	return (
		// <RequireRole roles={["SUPER_ADMIN"]}>
			<Outlet />
		// </RequireRole>
	);
}
