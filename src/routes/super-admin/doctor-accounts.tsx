import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/super-admin/doctor-accounts")({
	component: DoctorAccountsLayout,
});

function DoctorAccountsLayout() {
	return (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<Outlet />
		</RequireRole>
	);
}
