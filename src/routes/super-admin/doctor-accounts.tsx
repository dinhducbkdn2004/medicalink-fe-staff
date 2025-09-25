import { createFileRoute } from "@tanstack/react-router";
import { DoctorAccountsPage } from "@/pages/super-admin/DoctorAccountsPage";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/super-admin/doctor-accounts")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<DoctorAccountsPage />
		</RequireRole>
	),
});
