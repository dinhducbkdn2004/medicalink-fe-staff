import { createFileRoute } from "@tanstack/react-router";
import { EnhancedSpecialtiesPage } from "@/pages/super-admin/specialties/EnhancedSpecialtiesPage";

export const Route = createFileRoute("/super-admin/specialties/")({
	component: () => (
		// <RequireRole roles={["SUPER_ADMIN"]}>
		<EnhancedSpecialtiesPage />
		//</RequireRole>
	),
});
