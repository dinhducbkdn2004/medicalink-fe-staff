import { createFileRoute } from "@tanstack/react-router";
import { ChangePasswordPage } from "@/pages/auth/ChangePasswordPage";
import { RequireAuth } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/change-password")({
	component: () => (
		<RequireAuth>
			<ChangePasswordPage />
		</RequireAuth>
	),
});
