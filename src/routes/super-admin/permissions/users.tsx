import { createFileRoute } from "@tanstack/react-router";
import UserPermissionsPage from "@/pages/super-admin/permissions/UserPermissionsPage";

export const Route = createFileRoute("/super-admin/permissions/users")({
	component: () => (
		//<RequireRole roles={["SUPER_ADMIN"]}>
			<UserPermissionsPage />
		//</RequireRole>
	),
});
