import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/components/guards/RequireRole";
import PermissionGroupsPage from "@/pages/super-admin/permissions/PermissionGroupsPage";

export const Route = createFileRoute("/super-admin/permissions/groups")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<PermissionGroupsPage />
		</RequireRole>
	),
});
