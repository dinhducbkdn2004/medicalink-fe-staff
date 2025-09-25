import { createFileRoute } from "@tanstack/react-router";
import { DoctorAccountsPage } from "@/pages/admin/DoctorAccountsPage";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/admin/doctor-accounts")({
	component: () => (
		<RequireRole roles={["ADMIN", "SUPER_ADMIN"]}>
			<DoctorAccountsPage />
		</RequireRole>
	),
});
