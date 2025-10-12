import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/components/guards/RequireRole";
import UserPermissionsPage from "@/pages/super-admin/permissions/UserPermissionsPage";

export const Route = createFileRoute("/super-admin/permissions/users")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<UserPermissionsPage />
		</RequireRole>
	),
});
