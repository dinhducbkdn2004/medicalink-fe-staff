import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/components/guards/RequireRole";
import { PermissionsPage } from "@/pages/super-admin/permissions/PermissionsPage";

export const Route = createFileRoute("/super-admin/permissions")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<PermissionsPage />
		</RequireRole>
	),
});
