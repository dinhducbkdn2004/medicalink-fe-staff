import { createFileRoute } from "@tanstack/react-router";
import PermissionGroupsPage from "@/pages/super-admin/permissions/PermissionGroupsPage";

export const Route = createFileRoute("/super-admin/permissions/groups")({
	component: () => (
		//<RequireRole roles={["SUPER_ADMIN"]}>
			<PermissionGroupsPage />
		//</RequireRole>
	),
});
