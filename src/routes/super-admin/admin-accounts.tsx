import { createFileRoute } from "@tanstack/react-router";
import { AdminAccountsPage } from "@/pages/super-admin/AdminAccountsPage";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/super-admin/admin-accounts")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<AdminAccountsPage />
		</RequireRole>
	),
});
